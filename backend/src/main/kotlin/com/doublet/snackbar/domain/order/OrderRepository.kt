package com.doublet.snackbar.domain.order

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface OrderRepository : JpaRepository<Order, Long>, JpaSpecificationExecutor<Order>
