package com.yourname.bookstore.repository

import com.yourname.bookstore.models.Book
import com.yourname.bookstore.models.CartItem

class CartRepository {
    private val cartItems = mutableListOf<CartItem>()
    
    fun addToCart(book: Book) {
        val existingItem = cartItems.find { it.book.id == book.id }
        if (existingItem != null) {
            existingItem.quantity++
        } else {
            cartItems.add(CartItem(book, 1))
        }
    }
    
    fun removeFromCart(bookId: String) {
        cartItems.removeAll { it.book.id == bookId }
    }
    
    fun updateQuantity(bookId: String, quantity: Int) {
        val item = cartItems.find { it.book.id == bookId }
        item?.quantity = quantity
        if (quantity <= 0) {
            removeFromCart(bookId)
        }
    }
    
    fun getCartItems(): List<CartItem> = cartItems
    
    fun getTotalAmount(): Double = 
        cartItems.sumOf { it.book.price * it.quantity }
    
    fun clearCart() {
        cartItems.clear()
    }
    
    fun getCartItemCount(): Int = cartItems.sumOf { it.quantity }
}