package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "CUSTOMER_CART")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerCart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    @OneToOne
    @JoinColumn(name = "USER_ID")
    private User user;
}
