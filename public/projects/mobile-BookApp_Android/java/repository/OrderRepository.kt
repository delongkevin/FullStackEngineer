package com.yourname.bookstore.repository

import android.content.Context
import com.yourname.bookstore.models.CartItem
import com.yourname.bookstore.models.Order
import org.json.JSONArray
import org.json.JSONObject

class OrderRepository(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun getOrderHistory(): List<Order> =
        parseOrders(prefs.getString(KEY_ORDERS, "[]") ?: "[]")

    fun saveOrder(order: Order) {
        val updated = getOrderHistory().toMutableList()
        updated.add(0, order)
        prefs.edit().putString(KEY_ORDERS, serializeOrders(updated)).apply()
    }

    fun clearOrders() {
        prefs.edit().remove(KEY_ORDERS).apply()
    }

    private fun serializeOrders(orders: List<Order>): String {
        val array = JSONArray()
        orders.forEach { order ->
            array.put(
                JSONObject().apply {
                    put("id", order.id)
                    put("totalAmount", order.totalAmount)
                    put("timestamp", order.timestamp)
                    put("status", order.status)
                    put("shippingAddress", order.shippingAddress)
                    put("paymentMethod", order.paymentMethod)
                    put("items", JSONArray().apply {
                        order.items.forEach { item ->
                            put(
                                JSONObject().apply {
                                    put("bookId", item.book.id)
                                    put("title", item.book.title)
                                    put("author", item.book.author)
                                    put("price", item.book.price)
                                    put("description", item.book.description)
                                    put("imageUrl", item.book.imageUrl)
                                    put("category", item.book.category)
                                    put("rating", item.book.rating.toDouble())
                                    put("stock", item.book.stock)
                                    put("quantity", item.quantity)
                                }
                            )
                        }
                    })
                }
            )
        }

        return array.toString()
    }

    private fun parseOrders(json: String): List<Order> {
        return try {
            val array = JSONArray(json)
            buildList {
                for (i in 0 until array.length()) {
                    val orderObject = array.getJSONObject(i)
                    val itemsArray = orderObject.getJSONArray("items")
                    val items = buildList {
                        for (j in 0 until itemsArray.length()) {
                            val itemObject = itemsArray.getJSONObject(j)
                            add(
                                CartItem(
                                    book = com.yourname.bookstore.models.Book(
                                        id = itemObject.getString("bookId"),
                                        title = itemObject.getString("title"),
                                        author = itemObject.getString("author"),
                                        price = itemObject.getDouble("price"),
                                        description = itemObject.getString("description"),
                                        imageUrl = itemObject.getString("imageUrl"),
                                        category = itemObject.getString("category"),
                                        rating = itemObject.getDouble("rating").toFloat(),
                                        stock = itemObject.getInt("stock")
                                    ),
                                    quantity = itemObject.getInt("quantity")
                                )
                            )
                        }
                    }

                    add(
                        Order(
                            id = orderObject.getString("id"),
                            items = items,
                            totalAmount = orderObject.getDouble("totalAmount"),
                            timestamp = orderObject.getLong("timestamp"),
                            status = orderObject.getString("status"),
                            shippingAddress = orderObject.getString("shippingAddress"),
                            paymentMethod = orderObject.getString("paymentMethod")
                        )
                    )
                }
            }
        } catch (_: Exception) {
            emptyList()
        }
    }

    companion object {
        private const val PREFS_NAME = "bookstore_orders"
        private const val KEY_ORDERS = "orders"
    }
}
