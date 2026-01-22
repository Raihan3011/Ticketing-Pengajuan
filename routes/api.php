<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PriorityController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SupervisorController;
use App\Http\Controllers\Api\ExecutiveController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\RatingController;

// Public routes
Route::post('/public/check-ticket', [PublicController::class, 'checkTicketStatus']);

// Auth routes
Route::post('/register/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/register/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile', [AuthController::class, 'updateProfile']); // Support POST with _method
    Route::put('/profile/password', [AuthController::class, 'updatePassword']);
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/analytics', [DashboardController::class, 'analytics']);
    
    // Tickets
    Route::apiResource('tickets', TicketController::class);
    Route::post('/tickets/{ticket}/assign', [TicketController::class, 'assign']);
    Route::post('/tickets/{ticket}/notify-pimpinan', [TicketController::class, 'notifyPimpinan']);
    Route::post('/tickets/{ticket}/approve-pimpinan', [TicketController::class, 'approvePimpinan']);
    Route::post('/tickets/{ticket}/complete-staff', [TicketController::class, 'completeByStaff']);
    Route::get('/tickets/{ticket}/comments', [TicketController::class, 'getComments']);
    Route::post('/tickets/{ticket}/comments', [TicketController::class, 'addComment']);
    Route::post('/tickets/{ticket}/attachments', [TicketController::class, 'uploadAttachment']);
    Route::get('/tickets/{ticket}/history', [TicketController::class, 'getHistory']);
    
    // Supervisor routes
    Route::middleware('role:supervisor,admin')->group(function () {
        Route::get('/supervisor/team-overview', [SupervisorController::class, 'teamOverview']);
        Route::post('/supervisor/tickets/{ticket}/reassign', [SupervisorController::class, 'reassignTicket']);
        Route::post('/supervisor/tickets/bulk-assign', [SupervisorController::class, 'bulkAssign']);
        Route::get('/supervisor/team-performance', [SupervisorController::class, 'teamPerformance']);
    });
    
    // Executive routes
    Route::middleware('role:pimpinan,admin')->group(function () {
        Route::get('/executive/dashboard', [ExecutiveController::class, 'executiveDashboard']);
        Route::get('/executive/export-report', [ExecutiveController::class, 'exportReport']);
    });
    
    // Master data (read-only for all authenticated users)
    Route::get('/priorities', [PriorityController::class, 'index']);
    Route::get('/statuses', [StatusController::class, 'index']);
    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/users/pimpinan', [UserController::class, 'getPimpinan']);
    
    // Users (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
    });
    
    // Categories (Admin only for write operations)
    Route::middleware('role:admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::get('/categories/{category}', [CategoryController::class, 'show']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::patch('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });
    
    // Staff features
    Route::middleware('role:staff_support,admin')->group(function () {
        Route::get('/staff/sla-alerts', [StaffController::class, 'getSlaAlerts']);
        Route::post('/staff/tickets/{ticket}/escalate', [StaffController::class, 'escalateTicket']);
        Route::post('/staff/tickets/bulk-status', [StaffController::class, 'bulkUpdateStatus']);
    });
    
    // Customer features
    Route::post('/tickets/{ticket}/rate', [CustomerController::class, 'rateTicket']);
    Route::get('/knowledge-base', [CustomerController::class, 'getKnowledgeBase']);
    Route::get('/knowledge-base/{article}', [CustomerController::class, 'getKnowledgeArticle']);
    Route::post('/knowledge-base/{article}/helpful', [CustomerController::class, 'voteHelpful']);
    Route::get('/ticket-templates', [CustomerController::class, 'getTicketTemplates']);
    Route::get('/ticket-templates/{template}', [CustomerController::class, 'getTicketTemplate']);
    Route::get('/notification-settings', [CustomerController::class, 'getNotificationSettings']);
    Route::put('/notification-settings', [CustomerController::class, 'updateNotificationSettings']);
    
    // Ratings
    Route::get('/ratings', [RatingController::class, 'index']);
    Route::get('/ratings/statistics', [RatingController::class, 'statistics']);
});