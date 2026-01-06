<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\CategoryController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Ticket routes
    Route::apiResource('tickets', TicketController::class);
    
    // Category routes
    Route::apiResource('categories', CategoryController::class);
    
    // Get master data
    Route::get('/priorities', function () {
        return response()->json(\App\Models\Priority::all());
    });
    
    Route::get('/statuses', function () {
        return response()->json(\App\Models\Status::all());
    });
    
    Route::get('/users', function () {
        return response()->json(\App\Models\User::with('role')->get());
    });
});