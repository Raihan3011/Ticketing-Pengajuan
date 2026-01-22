<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Otp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if there's already a valid OTP for this email
        $existingOtp = Otp::where('email', $request->email)
                          ->where('expires_at', '>', Carbon::now())
                          ->first();

        if ($existingOtp) {
            $remainingTime = $existingOtp->expires_at->diffInMinutes(Carbon::now());
            return response()->json([
                'message' => "OTP already sent to this email. Please wait {$remainingTime} minutes before requesting a new one."
            ], 429);
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        Otp::where('email', $request->email)->delete();
        
        Otp::create([
            'email' => $request->email,
            'otp' => $otp,
            'name' => $request->name,
            'password' => Hash::make($request->password),
            'expires_at' => Carbon::now()->addMinutes(10)
        ]);

        // Send OTP via email
        try {
            Mail::raw("Your OTP code is: {$otp}\n\nThis code will expire in 10 minutes.", function($message) use ($request) {
                $message->to($request->email)
                       ->subject('OTP Verification - Ticketing System');
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send OTP email'], 500);
        }

        return response()->json([
            'message' => 'OTP sent successfully to your email'
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $otpRecord = Otp::valid($request->email, $request->otp)->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'Invalid or expired OTP'], 422);
        }

        $pengaduRole = Role::where('name', 'pengadu')->first();

        $user = User::create([
            'name' => $otpRecord->name,
            'email' => $otpRecord->email,
            'password' => $otpRecord->password,
            'role_id' => $pengaduRole->id,
            'email_verified_at' => now()
        ]);

        $otpRecord->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user->load('role'),
            'token' => $token
        ]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Account is deactivated'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->load('role'),
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('role')
        ]);
    }

    public function updateProfile(Request $request)
    {
        try {
            \Log::info('Update profile request:', $request->all());
            
            $rules = [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $request->user()->id,
                'phone' => 'nullable|string|max:20',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'remove_avatar' => 'nullable'
            ];
            
            // Only validate department if column exists
            if (Schema::hasColumn('users', 'department')) {
                $rules['department'] = 'nullable|string|max:255';
            }
            
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                \Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = $request->user();

            // Handle remove avatar
            if ($request->remove_avatar) {
                if ($user->avatar && \Storage::disk('public')->exists(str_replace('/storage/', '', $user->avatar))) {
                    \Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
                }
                $user->avatar = null;
            }
            // Handle avatar upload
            elseif ($request->hasFile('avatar')) {
                // Delete old avatar if exists
                if ($user->avatar && \Storage::disk('public')->exists(str_replace('/storage/', '', $user->avatar))) {
                    \Storage::disk('public')->delete(str_replace('/storage/', '', $user->avatar));
                }
                
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $user->avatar = '/storage/' . $avatarPath;
            }

            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
            ];
            
            if (Schema::hasColumn('users', 'department')) {
                $updateData['department'] = $request->department;
            }
            
            if ($user->avatar !== null) {
                $updateData['avatar'] = $user->avatar;
            }
            
            $user->update($updateData);

            \Log::info('Profile updated successfully for user:', ['id' => $user->id]);

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh()->load('role')
            ]);
        } catch (\Exception $e) {
            \Log::error('Profile update error:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // Check current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Implement password reset logic
        return response()->json(['message' => 'Password reset link sent']);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Implement password reset logic
        return response()->json(['message' => 'Password reset successful']);
    }
}