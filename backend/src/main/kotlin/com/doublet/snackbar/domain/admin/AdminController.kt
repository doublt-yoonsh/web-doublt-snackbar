package com.doublet.snackbar.domain.admin

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

data class AdminLoginRequest(val password: String)
data class AdminLoginResponse(val success: Boolean, val token: String? = null)

@RestController
@RequestMapping("/api/admin")
class AdminController(
    @Value("\${admin.password}")
    private val adminPassword: String,
    private val sessionService: AdminSessionService
) {
    @PostMapping("/login")
    fun login(@RequestBody request: AdminLoginRequest): AdminLoginResponse {
        if (request.password != adminPassword) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "비밀번호가 올바르지 않습니다")
        }
        val token = sessionService.createSession()
        return AdminLoginResponse(success = true, token = token)
    }
}
