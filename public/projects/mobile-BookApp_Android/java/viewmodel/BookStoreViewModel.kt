package com.yourname.bookstore.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.yourname.bookstore.models.Book
import com.yourname.bookstore.models.CartItem
import com.yourname.bookstore.repository.BookRepository
import com.yourname.bookstore.repository.CartRepository

class BookStoreViewModel : ViewModel() {
    private val bookRepository = BookRepository()
    private val cartRepository = CartRepository()
    
    private val _books = MutableLiveData<List<Book>>()
    val books: LiveData<List<Book>> = _books
    
    private val _cartItems = MutableLiveData<List<CartItem>>()
    val cartItems: LiveData<List<CartItem>> = _cartItems
    
    private val _totalAmount = MutableLiveData<Double>()
    val totalAmount: LiveData<Double> = _totalAmount
    
    private val _cartItemCount = MutableLiveData<Int>()
    val cartItemCount: LiveData<Int> = _cartItemCount
    
    init {
        loadBooks()
        updateCart()
    }
    
    private fun loadBooks() {
        _books.value = bookRepository.getAllBooks()
    }
    
    fun addToCart(book: Book) {
        cartRepository.addToCart(book)
        updateCart()
    }
    
    fun removeFromCart(bookId: String) {
        cartRepository.removeFromCart(bookId)
        updateCart()
    }
    
    fun updateQuantity(bookId: String, quantity: Int) {
        cartRepository.updateQuantity(bookId, quantity)
        updateCart()
    }
    
    private fun updateCart() {
        _cartItems.value = cartRepository.getCartItems()
        _totalAmount.value = cartRepository.getTotalAmount()
        _cartItemCount.value = cartRepository.getCartItemCount()
    }
    
    fun clearCart() {
        cartRepository.clearCart()
        updateCart()
    }
}