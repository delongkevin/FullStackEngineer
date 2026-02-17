package com.yourname.bookstore.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import com.google.android.material.snackbar.Snackbar
import com.yourname.bookstore.adapters.BookAdapter
import com.yourname.bookstore.databinding.FragmentBookListBinding
import com.yourname.bookstore.viewmodel.BookStoreViewModel

class BookListFragment : Fragment() {
    
    private var _binding: FragmentBookListBinding? = null
    private val binding get() = _binding!!
    private val viewModel: BookStoreViewModel by viewModels()
    private lateinit var bookAdapter: BookAdapter
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentBookListBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        observeViewModel()
    }
    
    private fun setupRecyclerView() {
        bookAdapter = BookAdapter { book ->
            viewModel.addToCart(book)
            showAddedToCartMessage()
        }
        
        binding.booksRecyclerView.apply {
            adapter = bookAdapter
            layoutManager = GridLayoutManager(requireContext(), 2)
        }
    }
    
    private fun observeViewModel() {
        viewModel.books.observe(viewLifecycleOwner) { books ->
            bookAdapter.submitList(books)
        }
    }
    
    private fun showAddedToCartMessage() {
        Snackbar.make(binding.root, "Book added to cart", Snackbar.LENGTH_SHORT).show()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}