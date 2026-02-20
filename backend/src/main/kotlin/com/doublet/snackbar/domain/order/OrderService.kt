package com.doublet.snackbar.domain.order

import com.doublet.snackbar.domain.order.dto.CreateOrderRequest
import com.doublet.snackbar.domain.order.dto.OrderResponse
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
@Transactional(readOnly = true)
class OrderService(
    private val orderRepository: OrderRepository,
) {
    @Transactional
    fun createOrder(request: CreateOrderRequest): OrderResponse {
        val order = Order(
            type = request.type,
            name = request.name,
            department = request.department,
            note = request.note,
        )

        request.items.forEach { itemRequest ->
            order.addItem(
                OrderItem(
                    link = itemRequest.link,
                    productName = itemRequest.productName,
                    quantity = itemRequest.quantity,
                )
            )
        }

        return OrderResponse.from(orderRepository.save(order))
    }

    fun getOrders(
        name: String?,
        department: String?,
        status: OrderStatus?,
        type: String?,
        dateFrom: LocalDate?,
        dateTo: LocalDate?,
    ): List<OrderResponse> {
        var spec = Specification.where<Order>(null)

        if (status != null) {
            spec = spec.and(OrderSpecifications.hasStatus(status))
        }
        if (!type.isNullOrBlank()) {
            spec = spec.and(OrderSpecifications.hasType(type))
        }
        if (!department.isNullOrBlank()) {
            spec = spec.and(OrderSpecifications.hasDepartment(department))
        }
        if (!name.isNullOrBlank()) {
            spec = spec.and(OrderSpecifications.nameContains(name))
        }
        if (dateFrom != null) {
            spec = spec.and(OrderSpecifications.createdAfter(dateFrom.atStartOfDay()))
        }
        if (dateTo != null) {
            spec = spec.and(OrderSpecifications.createdBefore(dateTo.plusDays(1).atStartOfDay()))
        }

        return orderRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"))
            .map { OrderResponse.from(it) }
    }

    fun getOrder(id: Long): OrderResponse {
        val order = orderRepository.findById(id)
            .orElseThrow { NoSuchElementException("주문을 찾을 수 없습니다: $id") }
        return OrderResponse.from(order)
    }

    @Transactional
    fun updateOrderStatus(id: Long, status: OrderStatus): OrderResponse {
        val order = orderRepository.findById(id)
            .orElseThrow { NoSuchElementException("주문을 찾을 수 없습니다: $id") }
        order.status = status
        return OrderResponse.from(orderRepository.save(order))
    }
}
