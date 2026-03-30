package com.yourname.bookstore.repository

import com.yourname.bookstore.models.Book
import com.yourname.bookstore.models.CartItem

class CartRepository {
    private val cartItems = mutableListOf<CartItem>()

    fun addToCart(book: Book) {
        val index = cartItems.indexOfFirst { it.book.id == book.id }
        if (index >= 0) {
            cartItems[index] = cartItems[index].copy(quantity = cartItems[index].quantity + 1)
        } else {
            cartItems.add(CartItem(book, 1))
        }
    }

    fun removeFromCart(bookId: String) {
        cartItems.removeAll { it.book.id == bookId }
    }

    fun updateQuantity(bookId: String, quantity: Int) {
        if (quantity <= 0) {
            removeFromCart(bookId)
            return
        }
        val index = cartItems.indexOfFirst { it.book.id == bookId }
        if (index >= 0) {
            cartItems[index] = cartItems[index].copy(quantity = quantity)
        }
    }

    fun getCartItems(): List<CartItem> = cartItems.toList()

    fun getTotalAmount(): Double =
        cartItems.sumOf { it.book.price * it.quantity }

    fun clearCart() {
        cartItems.clear()
    }

    fun getCartItemCount(): Int = cartItems.sumOf { it.quantity }
}
