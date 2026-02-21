package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "CUSTOMER_PAYMENTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne
    @JoinColumn(name = "ORDER_ID")
    private CustomerOrder order;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "PAYMENT_METHOD")
    private String paymentMethod;

    @Column(name = "TRANSACTION_ID")
    private String transactionId;

    @Column(name = "PAYMENT_STATUS")
    private String paymentStatus;
}
