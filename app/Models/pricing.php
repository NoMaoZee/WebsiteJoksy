<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class pricing extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'original_price',
        'discounted_price',
        'features',
    ];

    protected $casts = [
        'features' => 'array',
    ];
}