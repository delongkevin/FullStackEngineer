package com.yourname.bookstore.ui

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import com.yourname.bookstore.databinding.FragmentCheckoutBinding
import com.yourname.bookstore.models.Order
import com.yourname.bookstore.viewmodel.BookStoreViewModel
import java.util.UUID

class CheckoutFragment : Fragment() {
    
    private var _binding: FragmentCheckoutBinding? = null
    private val binding get() = _binding!!
    private val viewModel: BookStoreViewModel by viewModels()
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCheckoutBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        observeViewModel()
        setupPaymentMethods()
        setupPlaceOrderButton()
    }
    
    private fun observeViewModel() {
        viewModel.totalAmount.observe(viewLifecycleOwner) { total ->
            binding.totalAmount.text = "$${String.format("%.2f", total)}"
        }
    }
    
    private fun setupPaymentMethods() {
        binding.paymentMethodGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.credit_card_radio -> showCreditCardForm()
                R.id.paypal_radio -> hideCreditCardForm()
                R.id.google_pay_radio -> hideCreditCardForm()
            }
        }
    }
    
    private fun showCreditCardForm() {
        binding.creditCardForm.visibility = View.VISIBLE
    }
    
    private fun hideCreditCardForm() {
        binding.creditCardForm.visibility = View.GONE
    }
    
    private fun setupPlaceOrderButton() {
        binding.placeOrderButton.setOnClickListener {
            if (validateForm()) {
                processPayment()
            }
        }
    }
    
    private fun validateForm(): Boolean {
        val selectedPayment = binding.paymentMethodGroup.checkedRadioButtonId
        
        if (selectedPayment == -1) {
            showError("Please select a payment method")
            return false
        }
        
        if (selectedPayment == R.id.credit_card_radio) {
            val cardNumber = binding.cardNumber.text.toString()
            val expiryDate = binding.expiryDate.text.toString()
            val cvv = binding.cvv.text.toString()
            
            if (cardNumber.length < 16) {
                showError("Please enter valid card number")
                return false
            }
            if (expiryDate.length < 5) {
                showError("Please enter valid expiry date (MM/YY)")
                return false
            }
            if (cvv.length < 3) {
                showError("Please enter valid CVV")
                return false
            }
        }
        
        val shippingAddress = binding.shippingAddress.text.toString()
        if (shippingAddress.isEmpty()) {
            showError("Please enter shipping address")
            return false
        }
        
        return true
    }
    
    private fun processPayment() {
        val selectedPayment = when (binding.paymentMethodGroup.checkedRadioButtonId) {
            R.id.credit_card_radio -> "Credit Card"
            R.id.paypal_radio -> "PayPal"
            R.id.google_pay_radio -> "Google Pay"
            else -> "Unknown"
        }
        
        // Simulate payment processing
        binding.progressBar.visibility = View.VISIBLE
        binding.placeOrderButton.isEnabled = false
        
        Handler(Looper.getMainLooper()).postDelayed({
            binding.progressBar.visibility = View.GONE
            binding.placeOrderButton.isEnabled = true
            
            // Create order
            val order = createOrder(selectedPayment)
            completeOrder(order)
        }, 2000)
    }
    
    private fun createOrder(paymentMethod: String): Order {
        val items = viewModel.cartItems.value ?: emptyList()
        val total = viewModel.totalAmount.value ?: 0.0
        
        return Order(
            id = UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
            items = items,
            totalAmount = total,
            timestamp = System.currentTimeMillis(),
            status = "Processing",
            shippingAddress = binding.shippingAddress.text.toString(),
            paymentMethod = paymentMethod
        )
    }
    
    private fun completeOrder(order: Order) {
        viewModel.clearCart()
        
        val action = CheckoutFragmentDirections.actionCheckoutFragmentToOrderConfirmationFragment(
            orderId = order.id,
            totalAmount = order.totalAmount.toFloat()
        )
        findNavController().navigate(action)
    }
    
    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).show()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}