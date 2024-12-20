<?php

namespace App\Http\Controllers;

use App\Models\Pricing;
use Illuminate\Http\Request;

class PricingController extends Controller
{
    // Display all pricing plans
    public function index()
    {
        $pricingPlans = Pricing::all();
        return response()->json($pricingPlans);
    }

    // Show specific pricing plan
    public function show($id)
    {
        $pricingPlan = Pricing::find($id);
        if (!$pricingPlan) {
            return response()->json(['message' => 'Pricing Plan not found'], 404);
        }
        return response()->json($pricingPlan);
    }

    // Create a new pricing plan
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'original_price' => 'required|numeric',
            'discounted_price' => 'required|numeric',
            'features' => 'required|array',
        ]);

        $pricingPlan = Pricing::create([
            'title' => $validatedData['title'],
            'original_price' => $validatedData['original_price'],
            'discounted_price' => $validatedData['discounted_price'],
            'features' => json_encode($validatedData['features']),
        ]);

        return response()->json($pricingPlan, 201);
    }

    // Update an existing pricing plan
    public function update(Request $request, $id)
    {
        $pricingPlan = Pricing::find($id);
        if (!$pricingPlan) {
            return response()->json(['message' => 'Pricing Plan not found'], 404);
        }

        $validatedData = $request->validate([
            'title' => 'sometimes|string|max:255',
            'original_price' => 'sometimes|numeric',
            'discounted_price' => 'sometimes|numeric',
            'features' => 'sometimes|array',
        ]);

        $pricingPlan->update([
            'title' => $validatedData['title'] ?? $pricingPlan->title,
            'original_price' => $validatedData['original_price'] ?? $pricingPlan->original_price,
            'discounted_price' => $validatedData['discounted_price'] ?? $pricingPlan->discounted_price,
            'features' => isset($validatedData['features']) ? json_encode($validatedData['features']) : $pricingPlan->features,
        ]);

        return response()->json($pricingPlan);
    }

    // Delete a pricing plan
    public function destroy($id)
    {
        $pricingPlan = Pricing::find($id);
        if (!$pricingPlan) {
            return response()->json(['message' => 'Pricing Plan not found'], 404);
        }

        $pricingPlan->delete();
        return response()->json(['message' => 'Pricing Plan deleted successfully']);
    }
}