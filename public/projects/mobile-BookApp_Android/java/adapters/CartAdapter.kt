package com.yourname.bookstore.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.yourname.bookstore.databinding.ItemCartBinding
import com.yourname.bookstore.models.CartItem

class CartAdapter(
    private val onQuantityChanged: (String, Int) -> Unit,
    private val onRemoveItem: (String) -> Unit
) : ListAdapter<CartItem, CartAdapter.CartViewHolder>(DiffCallback) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CartViewHolder {
        val binding = ItemCartBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return CartViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class CartViewHolder(private val binding: ItemCartBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(cartItem: CartItem) {
            val book = cartItem.book
            
            binding.bookTitle.text = book.title
            binding.bookAuthor.text = book.author
            binding.bookPrice.text = "$${book.price}"
            binding.quantityText.text = cartItem.quantity.toString()
            binding.itemTotal.text = "$${String.format("%.2f", book.price * cartItem.quantity)}"

            Glide.with(binding.root)
                .load(book.imageUrl)
                .placeholder(R.drawable.ic_book_placeholder)
                .into(binding.bookImage)

            binding.increaseButton.setOnClickListener {
                onQuantityChanged(book.id, cartItem.quantity + 1)
            }

            binding.decreaseButton.setOnClickListener {
                if (cartItem.quantity > 1) {
                    onQuantityChanged(book.id, cartItem.quantity - 1)
                }
            }

            binding.removeButton.setOnClickListener {
                onRemoveItem(book.id)
            }
        }
    }

    companion object DiffCallback : DiffUtil.ItemCallback<CartItem>() {
        override fun areItemsTheSame(oldItem: CartItem, newItem: CartItem): Boolean {
            return oldItem.book.id == newItem.book.id
        }

        override fun areContentsTheSame(oldItem: CartItem, newItem: CartItem): Boolean {
            return oldItem == newItem
        }
    }
}