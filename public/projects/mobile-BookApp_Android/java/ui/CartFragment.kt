package com.yourname.bookstore.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.yourname.bookstore.adapters.CartAdapter
import com.yourname.bookstore.databinding.FragmentCartBinding
import com.yourname.bookstore.viewmodel.BookStoreViewModel

class CartFragment : Fragment() {
    
    private var _binding: FragmentCartBinding? = null
    private val binding get() = _binding!!
    private val viewModel: BookStoreViewModel by viewModels()
    private lateinit var cartAdapter: CartAdapter
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCartBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        observeViewModel()
        setupCheckoutButton()
    }
    
    private fun setupRecyclerView() {
        cartAdapter = CartAdapter(
            onQuantityChanged = { bookId, quantity ->
                viewModel.updateQuantity(bookId, quantity)
            },
            onRemoveItem = { bookId ->
                viewModel.removeFromCart(bookId)
            }
        )
        
        binding.cartRecyclerView.apply {
            adapter = cartAdapter
            layoutManager = LinearLayoutManager(requireContext())
        }
    }
    
    private fun observeViewModel() {
        viewModel.cartItems.observe(viewLifecycleOwner) { items ->
            cartAdapter.submitList(items)
            binding.emptyCartText.visibility = if (items.isEmpty()) View.VISIBLE else View.GONE
            binding.checkoutSection.visibility = if (items.isEmpty()) View.GONE else View.VISIBLE
        }
        
        viewModel.totalAmount.observe(viewLifecycleOwner) { total ->
            binding.totalAmount.text = "Total: $${String.format("%.2f", total)}"
        }
    }
    
    private fun setupCheckoutButton() {
        binding.checkoutButton.setOnClickListener {
            val action = CartFragmentDirections.actionCartFragmentToCheckoutFragment()
            findNavController().navigate(action)
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}