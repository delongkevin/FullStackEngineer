package com.yourname.bookstore.models

data class CartItem(
    val book: Book,
    var quantity: Int
)