<?php

namespace App\Http\Controllers;

use App\Models\Services;
use Illuminate\Http\Request;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Menampilkan semua data services
        $services = Services::all();
        return response()->json($services); // Mengembalikan dalam bentuk JSON
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Return view untuk form create (jika diperlukan)
        return view('services.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'image' => 'required|string|max:255',
        ]);

        // Membuat data baru
        $service = Services::create([
            'name' => $request->name,
            'price' => $request->price,
            'image' => $request->image,
        ]);

        return response()->json(['message' => 'Service created successfully!', 'data' => $service], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Services $service)
    {
        // Menampilkan detail data services berdasarkan ID
        return response()->json($service);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Services $service)
    {
        // Return view untuk form edit (jika diperlukan)
        return view('services.edit', compact('service'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Services $service)
    {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'image' => 'required|string|max:255',
        ]);

        // Mengupdate data service
        $service->update([
            'name' => $request->name,
            'price' => $request->price,
            'image' => $request->image,
        ]);

        return response()->json(['message' => 'Service updated successfully!', 'data' => $service]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Services $service)
    {
        // Menghapus data service
        $service->delete();

        return response()->json(['message' => 'Service deleted successfully!']);
    }
}