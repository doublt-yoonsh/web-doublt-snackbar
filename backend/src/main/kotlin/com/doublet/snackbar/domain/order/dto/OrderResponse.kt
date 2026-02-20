package com.doublet.snackbar.domain.order.dto

import com.doublet.snackbar.domain.order.Order
import com.doublet.snackbar.domain.order.OrderItem
import java.time.LocalDateTime

data class OrderResponse(
    val id: Long,
    val type: String,
    val name: String,
    val department: String,
    val note: String?,
    val status: String,
    val createdAt: LocalDateTime,
    val items: List<OrderItemResponse>,
) {
    companion object {
        fun from(order: Order) = OrderResponse(
            id = order.id!!,
            type = order.type,
            name = order.name,
            department = order.department,
            note = order.note,
            status = order.status.name,
            createdAt = order.createdAt,
            items = order.items.map { OrderItemResponse.from(it) },
        )
    }
}

data class OrderItemResponse(
    val id: Long,
    val link: String?,
    val productName: String,
    val quantity: Int,
) {
    companion object {
        fun from(item: OrderItem) = OrderItemResponse(
            id = item.id!!,
            link = item.link,
            productName = item.productName,
            quantity = item.quantity,
        )
    }
}
