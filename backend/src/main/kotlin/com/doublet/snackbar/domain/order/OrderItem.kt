package com.doublet.snackbar.domain.order

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "order_items")
class OrderItem(
    @Column(length = 2048)
    val link: String? = null,

    @Column(nullable = false)
    val productName: String,

    @Column(nullable = false)
    val quantity: Int = 1,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    var order: Order? = null,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
)
