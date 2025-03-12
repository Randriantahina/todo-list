<?php

use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route pour obtenir l'utilisateur authentifié
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// Route pour obtenir le CSRF token (normalement pas nécessaire pour une API)
Route::get('csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
// Routes API pour la gestion des tâches
    Route::get('', [TaskController::class, "index"]); // Récupérer toutes les tâches
    Route::post('', [TaskController::class, "store"]); // Créer une nouvelle tâche
    Route::patch('tasks/{task}', [TaskController::class, 'update']); // Mettre à jour une tâche
    Route::delete('{task}', [TaskController::class, 'destroy']); // Supprimer une tâche


