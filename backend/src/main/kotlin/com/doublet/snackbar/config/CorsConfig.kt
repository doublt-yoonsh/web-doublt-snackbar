package com.doublet.snackbar.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class CorsConfig(
    @Value("\${cors.allowed-origins:http://localhost:3000,http://localhost:3001}")
    private val allowedOrigins: List<String>,
) {

    @Bean
    fun corsFilter(): CorsFilter {
        val config = CorsConfiguration().apply {
            this.allowedOrigins = this@CorsConfig.allowedOrigins
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
            allowedHeaders = listOf(
                "Content-Type",
                "Authorization",
                "Accept",
                "X-Requested-With"
            )
            allowCredentials = true
            maxAge = 3600L // preflight 요청 캐싱 (1시간)
        }
        val source = UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/api/**", config)
        }
        return CorsFilter(source)
    }
}
