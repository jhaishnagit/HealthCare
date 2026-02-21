package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "USER_MASTER")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FULL_NAME")
    private String fullName;

    @Column(name = "MOBILE_NUMBER")
    private String mobileNumber;

    @Column(name = "EMAIL_ID")
    private String emailId;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "ROLE")
    private String role; // CUSTOMER, ADMIN, DOCTOR, STAFF

    @Column(name = "AADHAR_NUMBER")
    private String aadharNumber;

    @Column(name = "PAN_NUMBER")
    private String panNumber;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "ORGANIZATION_ID")
    private Long organizationId;
}
