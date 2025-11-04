package com.yourname.bookstore.repository

import com.yourname.bookstore.models.Book

class BookRepository {
    private val books = mutableListOf<Book>()
    
    init {
        // Sample book data
        books.addAll(
            listOf(
                Book(
                    id = "1",
                    title = "The Great Gatsby",
                    author = "F. Scott Fitzgerald",
                    price = 12.99,
                    description = "A classic novel of the Jazz Age",
                    imageUrl = "https://images.pexels.com/photos/1275235/pexels-photo-1275235.jpeg",
                    category = "Fiction",
                    rating = 4.5f,
                    stock = 10
                ),
                Book(
                    id = "2",
                    title = "To Kill a Mockingbird",
                    author = "Harper Lee",
                    price = 14.99,
                    description = "A gripping tale of racial injustice",
                    imageUrl = "https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg",
                    category = "Fiction",
                    rating = 4.8f,
                    stock = 8
                ),
                Book(
                    id = "3",
                    title = "1984",
                    author = "George Orwell",
                    price = 10.99,
                    description = "Dystopian social science fiction",
                    imageUrl = "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg",
                    category = "Science Fiction",
                    rating = 4.7f,
                    stock = 15
                ),
                Book(
                    id = "4",
                    title = "Pride and Prejudice",
                    author = "Jane Austen",
                    price = 11.99,
                    description = "Romantic novel of manners",
                    imageUrl = "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg",
                    category = "Romance",
                    rating = 4.6f,
                    stock = 12
                )
            )
        )
    }
    
    fun getAllBooks(): List<Book> = books
    fun getBookById(id: String): Book? = books.find { it.id == id }
    fun getBooksByCategory(category: String): List<Book> = 
        books.filter { it.category.equals(category, true) }
}