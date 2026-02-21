package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "CUSTOMER_ORDER_ITEMS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ORDER_ITEM_ID")
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "ORDER_ID", nullable = false)
    private CustomerOrder order;

    // 🔥 MUST MATCH DB COLUMN
    @Column(name = "PRODUCT_ID", nullable = false)
    private Long productId;

    @Column(name = "QUANTITY")
    private Integer quantity;

    @Column(name = "PRICE_PER_UNIT")
    private Double pricePerUnit;

    @Column(name = "SUBTOTAL")
    private Double subtotal;
}