package com.doublet.snackbar.domain.order.dto

import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

data class CreateOrderRequest(
    @field:NotBlank
    val type: String,

    @field:NotBlank
    val name: String,

    @field:NotBlank
    val department: String,

    val note: String? = null,

    @field:NotEmpty
    @field:Valid
    val items: List<OrderItemRequest>,
)

data class OrderItemRequest(
    val link: String? = null,

    @field:NotBlank
    val productName: String,

    val quantity: Int = 1,
)
