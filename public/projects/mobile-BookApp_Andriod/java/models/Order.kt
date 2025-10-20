package com.yourname.bookstore.models

data class Order(
    val id: String,
    val items: List<CartItem>,
    val totalAmount: Double,
    val timestamp: Long,
    val status: String,
    val shippingAddress: String,
    val paymentMethod: String
)