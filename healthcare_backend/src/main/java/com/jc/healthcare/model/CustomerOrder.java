package com.jc.healthcare.model;

import java.util.Date;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "CUSTOMER_ORDERS")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ORDER_ID")
    private Long orderId;

    // STAFF_ID = Customer/User ID
    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "ADDRESS_ID", nullable = false)
    private Long addressId;

    @Column(name = "ORDER_STATUS")
    private String orderStatus;

    @Column(name = "TOTAL_AMOUNT")
    private Double totalAmount;

    @Column(name = "PAYMENT_STATUS")
    private String paymentStatus;

    @Column(name = "PAYMENT_METHOD")
    private String paymentMethod;

    @Column(name = "ORDER_DATE")
    private Date orderDate;

    @Column(name = "UPDATED_ON")
    private Date updatedOn;

    // 👉 Generate getters & setters
}
