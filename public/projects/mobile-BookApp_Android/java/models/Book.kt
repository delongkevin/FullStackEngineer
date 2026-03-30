package com.yourname.bookstore.models

data class Book(
    val id: String,
    val title: String,
    val author: String,
    val price: Double,
    val description: String,
    val imageUrl: String,
    val category: String,
    val rating: Float,
    val stock: Int
)