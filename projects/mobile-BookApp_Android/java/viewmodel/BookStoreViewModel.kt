package com.yourname.bookstore.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.yourname.bookstore.models.Book
import com.yourname.bookstore.models.CartItem
import com.yourname.bookstore.models.Order
import com.yourname.bookstore.repository.BookRepository
import com.yourname.bookstore.repository.CartRepository
import com.yourname.bookstore.repository.OrderRepository
import java.util.Locale
import java.util.UUID

class BookStoreViewModel(application: Application) : AndroidViewModel(application) {
    private val bookRepository = BookRepository()
    private val cartRepository = CartRepository()
    private val orderRepository = OrderRepository(application.applicationContext)
    
    private val _books = MutableLiveData<List<Book>>()
    val books: LiveData<List<Book>> = _books
    
    private val _cartItems = MutableLiveData<List<CartItem>>()
    val cartItems: LiveData<List<CartItem>> = _cartItems
    
    private val _totalAmount = MutableLiveData<Double>()
    val totalAmount: LiveData<Double> = _totalAmount
    
    private val _cartItemCount = MutableLiveData<Int>()
    val cartItemCount: LiveData<Int> = _cartItemCount

    private val _orderHistory = MutableLiveData<List<Order>>()
    val orderHistory: LiveData<List<Order>> = _orderHistory
    
    init {
        loadBooks()
        updateCart()
        loadOrderHistory()
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

    fun placeOrder(shippingAddress: String, paymentMethod: String): Order? {
        val items = cartRepository.getCartItems()
        if (items.isEmpty()) {
            return null
        }

        val order = Order(
            id = UUID.randomUUID().toString().take(8).uppercase(Locale.getDefault()),
            items = items,
            totalAmount = cartRepository.getTotalAmount(),
            timestamp = System.currentTimeMillis(),
            status = "Processing",
            shippingAddress = shippingAddress,
            paymentMethod = paymentMethod
        )

        orderRepository.saveOrder(order)
        loadOrderHistory()
        clearCart()
        return order
    }

    private fun loadOrderHistory() {
        _orderHistory.value = orderRepository.getOrderHistory()
    }
}