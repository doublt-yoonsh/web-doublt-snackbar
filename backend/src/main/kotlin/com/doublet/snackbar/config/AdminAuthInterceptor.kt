package com.doublet.snackbar.config

import com.doublet.snackbar.domain.admin.AdminController
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor

@Component
class AdminAuthInterceptor : HandlerInterceptor {

    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        if (request.method == "OPTIONS") return true

        val token = request.getHeader("Authorization")?.removePrefix("Bearer ")
        if (!AdminController.activeSessions.containsKey(token) || !isValid(token)) {
            response.status = 401
            response.contentType = "application/json"
            response.writer.write("""{"error": "인증이 필요합니다"}""")
            return false
        }
        return true
    }

    private fun isValid(token: String?): Boolean {
        if (token == null) return false
        val createdAt = AdminController.activeSessions[token] ?: return false
        val timeoutMs = 8 * 60 * 60 * 1000L
        if (System.currentTimeMillis() - createdAt > timeoutMs) {
            AdminController.activeSessions.remove(token)
            return false
        }
        return true
    }
}
