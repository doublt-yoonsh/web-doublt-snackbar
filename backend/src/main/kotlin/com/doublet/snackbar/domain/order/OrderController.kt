package com.doublet.snackbar.domain.order

import com.doublet.snackbar.domain.order.dto.CreateOrderRequest
import com.doublet.snackbar.domain.order.dto.OrderResponse
import com.doublet.snackbar.domain.order.dto.UpdateOrderStatusRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderService: OrderService,
) {
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createOrder(@Valid @RequestBody request: CreateOrderRequest): OrderResponse {
        return orderService.createOrder(request)
    }

    @GetMapping
    fun getOrders(
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) department: String?,
        @RequestParam(required = false) status: String?,
        @RequestParam(required = false) type: String?,
        @RequestParam(required = false) dateFrom: LocalDate?,
        @RequestParam(required = false) dateTo: LocalDate?,
    ): List<OrderResponse> {
        val orderStatus = status?.let {
            try { OrderStatus.valueOf(it) }
            catch (e: IllegalArgumentException) { null }
        }
        return orderService.getOrders(name, department, orderStatus, type, dateFrom, dateTo)
    }

    @GetMapping("/{id}")
    fun getOrder(@PathVariable id: Long): OrderResponse {
        return orderService.getOrder(id)
    }

    @PatchMapping("/{id}/status")
    fun updateOrderStatus(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateOrderStatusRequest,
    ): OrderResponse {
        val status = try {
            OrderStatus.valueOf(request.status)
        } catch (e: IllegalArgumentException) {
            throw IllegalArgumentException("유효하지 않은 상태입니다: ${request.status}")
        }
        return orderService.updateOrderStatus(id, status)
    }
}
