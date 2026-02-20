package com.doublet.snackbar.domain.order

import org.springframework.data.jpa.domain.Specification
import java.time.LocalDateTime

object OrderSpecifications {

    fun hasStatus(status: OrderStatus): Specification<Order> =
        Specification { root, _, cb -> cb.equal(root.get<OrderStatus>("status"), status) }

    fun hasType(type: String): Specification<Order> =
        Specification { root, _, cb -> cb.equal(root.get<String>("type"), type) }

    fun hasDepartment(department: String): Specification<Order> =
        Specification { root, _, cb -> cb.equal(root.get<String>("department"), department) }

    fun nameContains(name: String): Specification<Order> =
        Specification { root, _, cb ->
            cb.like(cb.lower(root.get("name")), "%${name.lowercase()}%")
        }

    fun createdAfter(dateFrom: LocalDateTime): Specification<Order> =
        Specification { root, _, cb ->
            cb.greaterThanOrEqualTo(root.get("createdAt"), dateFrom)
        }

    fun createdBefore(dateTo: LocalDateTime): Specification<Order> =
        Specification { root, _, cb ->
            cb.lessThan(root.get("createdAt"), dateTo)
        }
}
