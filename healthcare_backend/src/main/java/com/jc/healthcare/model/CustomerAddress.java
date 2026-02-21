package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "CUSTOMER_ADDRESSES")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ADDRESS_ID")        // 🔥 MUST MATCH TABLE COLUMN
    private Long addressId;

    @ManyToOne
    @JoinColumn(name = "USER_ID")       // FK to USER_MASTER.ID
    private User user;

    @Column(name = "ADDRESS_LINE1")
    private String addressLine1;

    @Column(name = "ADDRESS_LINE2")
    private String addressLine2;

    @Column(name = "CITY")
    private String city;

    @Column(name = "STATE")
    private String state;

    @Column(name = "PINCODE")
    private String pincode;

    @Column(name = "LANDMARK")
    private String landmark;

    @Column(name = "IS_DEFAULT")
    private Integer isDefault;
}
