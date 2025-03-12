<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;


// Route::get('/csrf-token', function () {
//     return response()->json(['csrf_token' => csrf_token()]);
// });
//  Route::get('/',[TaskController::class, "index"]);
//  Route::post('/',[TaskController::class, "store"]);
//  Route::get('{todo}/edit', [TaskController::class, 'edit']);
//  Route::patch('/{todo}', [TasKController::class, 'update']);
//  Route::delete('/{todo}', [TasKController::class, 'destroy']);

// Route::prefix('api')->group(function () {
//     Route::get('/', [TaskController::class, "index"]);
//     Route::post('/', [TaskController::class, "store"]);
//     Route::get('{todo}/edit', [TaskController::class, 'edit']);
//     Route::patch('/{todo}', [TaskController::class, 'update']);
//     Route::delete('/{todo}', [TaskController::class, 'destroy']);
// });