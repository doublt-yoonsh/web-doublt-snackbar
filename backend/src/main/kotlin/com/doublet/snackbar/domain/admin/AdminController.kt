package com.doublet.snackbar.domain.admin

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

data class AdminLoginRequest(val password: String)
data class AdminLoginResponse(val success: Boolean, val token: String? = null)

@RestController
@RequestMapping("/api/admin")
class AdminController(
    @Value("\${admin.password}")
    private val adminPassword: String,
) {
    companion object {
        val activeSessions = ConcurrentHashMap<String, Long>()
        private const val SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000L // 8시간
    }

    @PostMapping("/login")
    fun login(@RequestBody request: AdminLoginRequest): AdminLoginResponse {
        if (request.password != adminPassword) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "비밀번호가 올바르지 않습니다")
        }
        val token = UUID.randomUUID().toString()
        activeSessions[token] = System.currentTimeMillis()
        return AdminLoginResponse(success = true, token = token)
    }

    fun isValidSession(token: String?): Boolean {
        if (token == null) return false
        val createdAt = activeSessions[token] ?: return false
        if (System.currentTimeMillis() - createdAt > SESSION_TIMEOUT_MS) {
            activeSessions.remove(token)
            return false
        }
        return true
    }
}
