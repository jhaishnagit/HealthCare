package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Entity
@Table(name = "CUSTOMER_CART_ITEMS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerCartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CART_ITEM_ID")
    private Long cartItemId;

    @ManyToOne
    @JoinColumn(name = "CART_ID")
    private CustomerCart cart;

    @Column(name = "ITEM_ID")   
    private Long itemId;

    @Column(name = "QUANTITY")
    private Integer quantity;

    @Column(name = "PRICE_AT_ADD")
    private Double priceAtAdd;
}
