package com.yourname.bookstore.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.yourname.bookstore.databinding.ItemBookBinding
import com.yourname.bookstore.models.Book

class BookAdapter(private val onAddToCart: (Book) -> Unit) : 
    ListAdapter<Book, BookAdapter.BookViewHolder>(DiffCallback) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BookViewHolder {
        val binding = ItemBookBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return BookViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: BookViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    inner class BookViewHolder(private val binding: ItemBookBinding) : 
        RecyclerView.ViewHolder(binding.root) {
        
        fun bind(book: Book) {
            binding.bookTitle.text = book.title
            binding.bookAuthor.text = book.author
            binding.bookPrice.text = "$${book.price}"
            binding.ratingBar.rating = book.rating
            
            Glide.with(binding.root)
                .load(book.imageUrl)
                .placeholder(R.drawable.ic_book_placeholder)
                .into(binding.bookImage)
            
            binding.addToCartButton.setOnClickListener {
                onAddToCart(book)
            }
        }
    }
    
    companion object DiffCallback : DiffUtil.ItemCallback<Book>() {
        override fun areItemsTheSame(oldItem: Book, newItem: Book): Boolean {
            return oldItem.id == newItem.id
        }
        
        override fun areContentsTheSame(oldItem: Book, newItem: Book): Boolean {
            return oldItem == newItem
        }
    }
}