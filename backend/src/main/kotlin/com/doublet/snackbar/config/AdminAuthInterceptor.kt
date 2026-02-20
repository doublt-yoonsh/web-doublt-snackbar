package com.doublet.snackbar.config

import com.doublet.snackbar.domain.admin.AdminSessionService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor

@Component
class AdminAuthInterceptor(
    private val sessionService: AdminSessionService
) : HandlerInterceptor {

    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        if (request.method == "OPTIONS") return true

        // /api/orders는 GET만 보호, POST는 일반 사용자도 접근 가능
        if (request.requestURI == "/api/orders" && request.method != "GET") {
            return true
        }

        val token = request.getHeader("Authorization")?.removePrefix("Bearer ")
        if (!sessionService.isValidSession(token)) {
            response.status = 401
            response.contentType = "application/json"
            response.writer.write("""{"error": "인증이 필요합니다"}""")
            return false
        }
        return true
    }
}
