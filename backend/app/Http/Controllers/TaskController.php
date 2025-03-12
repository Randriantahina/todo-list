<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    // Obtenir toutes les tâches
    public function index()
    {
        return response()->json(Task::all(), 200);
    }

    // Ajouter une nouvelle tâche
    public function store(Request $request)
    {
        $attributes = $request->validate([
            "title" => "required",
            "description" => "nullable",
        ]);

        $task = Task::create($attributes);

        return response()->json($task, 201); 
    }
    //Valider et mettre à jour une tâche 
public function update(Request $request, Task $task)
{
    
    // Valider les nouvelles données
    $attributes = $request->validate([
        'title' => 'sometimes|required',
        'description' => 'sometimes|nullable',
        'isDone' => 'sometimes|boolean'
    ]);

    // Mettre à jour la tâche avec les valeurs fournies
    $task->update($attributes);

    // Retourner la tâche mise à jour en format JSON
    return response()->json($task, 200);
}


    // Supprimer une tâche
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(["message" => "Tâche supprimée"], 200);
    }
}
