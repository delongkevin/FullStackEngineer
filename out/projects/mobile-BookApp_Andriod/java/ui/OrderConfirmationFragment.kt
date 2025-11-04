package com.yourname.bookstore.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.yourname.bookstore.databinding.FragmentOrderConfirmationBinding
import java.text.SimpleDateFormat
import java.util.*

class OrderConfirmationFragment : Fragment() {
    
    private var _binding: FragmentOrderConfirmationBinding? = null
    private val binding get() = _binding!!
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentOrderConfirmationBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val orderId = arguments?.getString("orderId") ?: "UNKNOWN"
        val totalAmount = arguments?.getFloat("totalAmount") ?: 0.0f
        
        binding.orderId.text = "Order #$orderId"
        binding.totalAmount.text = "$${String.format("%.2f", totalAmount)}"
        binding.estimatedDelivery.text = "Estimated delivery: ${getDeliveryDate()}"
        
        binding.continueShoppingButton.setOnClickListener {
            // Navigate back to book list and clear back stack
            findNavController().popBackStack()
        }
    }
    
    private fun getDeliveryDate(): String {
        val calendar = Calendar.getInstance()
        calendar.add(Calendar.DAY_OF_YEAR, 5)
        val formatter = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
        return formatter.format(calendar.time)
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}