package com.yourname.bookstore.ui

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import com.yourname.bookstore.R
import com.yourname.bookstore.databinding.FragmentCheckoutBinding
import com.yourname.bookstore.models.Order
import com.yourname.bookstore.viewmodel.BookStoreViewModel
import java.util.UUID

class CheckoutFragment : Fragment() {

    private var _binding: FragmentCheckoutBinding? = null
    private val binding get() = _binding!!
    private val viewModel: BookStoreViewModel by activityViewModels()

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
                R.id.credit_card_radio -> binding.creditCardForm.visibility = View.VISIBLE
                else -> binding.creditCardForm.visibility = View.GONE
            }
        }
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
            Snackbar.make(binding.root, "Please select a payment method", Snackbar.LENGTH_LONG).show()
            return false
        }

        if (selectedPayment == R.id.credit_card_radio) {
            val cardNumber = binding.cardNumber.text.toString()
            val expiryDate = binding.expiryDate.text.toString()
            val cvv = binding.cvv.text.toString()

            if (cardNumber.length < 16) {
                Snackbar.make(binding.root, "Please enter valid card number", Snackbar.LENGTH_LONG).show()
                return false
            }
            if (expiryDate.length < 5) {
                Snackbar.make(binding.root, "Please enter valid expiry date (MM/YY)", Snackbar.LENGTH_LONG).show()
                return false
            }
            if (cvv.length < 3) {
                Snackbar.make(binding.root, "Please enter valid CVV", Snackbar.LENGTH_LONG).show()
                return false
            }
        }

        val shippingAddress = binding.shippingAddress.text.toString()
        if (shippingAddress.isEmpty()) {
            Snackbar.make(binding.root, "Please enter shipping address", Snackbar.LENGTH_LONG).show()
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

        binding.progressBar.visibility = View.VISIBLE
        binding.placeOrderButton.isEnabled = false

        Handler(Looper.getMainLooper()).postDelayed({
            if (_binding != null) {
                binding.progressBar.visibility = View.GONE
                binding.placeOrderButton.isEnabled = true

                val order = createOrder(selectedPayment)
                viewModel.clearCart()

                val bundle = Bundle().apply {
                    putString("orderId", order.id)
                    putFloat("totalAmount", order.totalAmount.toFloat())
                }
                findNavController().navigate(R.id.action_checkoutFragment_to_orderConfirmationFragment, bundle)
            }
        }, 2000)
    }

    private fun createOrder(paymentMethod: String): Order {
        val items = viewModel.cartItems.value ?: emptyList()
        val total = viewModel.totalAmount.value ?: 0.0

        return Order(
            id = UUID.randomUUID().toString().substring(0, 8).uppercase(),
            items = items,
            totalAmount = total,
            timestamp = System.currentTimeMillis(),
            status = "Processing",
            shippingAddress = binding.shippingAddress.text.toString(),
            paymentMethod = paymentMethod
        )
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
