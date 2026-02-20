package com.doublet.snackbar.domain.admin

import org.springframework.stereotype.Service
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Service
class AdminSessionService {
    private val activeSessions = ConcurrentHashMap<String, Long>()

    companion object {
        const val SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000L // 8시간
    }

    fun createSession(): String {
        val token = UUID.randomUUID().toString()
        activeSessions[token] = System.currentTimeMillis()
        return token
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

    fun invalidateSession(token: String) {
        activeSessions.remove(token)
    }
}
