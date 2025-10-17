<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $products = Product::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => number_format($product->price, 2),
                    'created_at' => $product->created_at->format('Y-m-d'),
                ];
            });
        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search,
            ],
        ]);
        // $products = Product::all()->map(function ($product) {
        //     return [
        //         'id' => $product->id,
        //         'name' => $product->name,
        //         'description' => $product->description,
        //         'price' => number_format($product->price, 2),
        //         'created_at' => $product->created_at->format('Y-m-d'),
        //     ];
        // });

        // return Inertia::render('Products/Index', [
        //     'products' => $products,
        // ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|min:0'
        ]);
        Product::create($validated);
        return redirect('/products')->with('success', 'Product created successfully.');
    }
    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
            ]
        ]);
    }
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0'
        ]);

        $product->update($validated);

        return redirect('/products')->with('success', 'Product updated successfully.');
    }
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect('/products')->with('success', 'Product deleted successfully.');
    }
}
