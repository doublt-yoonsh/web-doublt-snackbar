package com.doublet.snackbar.domain.order.dto

import jakarta.validation.constraints.NotBlank

data class UpdateOrderStatusRequest(
    @field:NotBlank
    val status: String,
)
