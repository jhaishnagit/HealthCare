package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "MEDICINE_REVIEWS")
@Data
public class MedicineReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Oracle 19c identity support
    @Column(name = "REVIEW_ID")
    private Long id;

    @Column(name = "MEDICINE_ID", nullable = false)
    private Long medicineId;

    @Column(name = "ID", nullable = false)  // foreign key to user table
    private Long userId;

    @Column(name = "RATING")
    private Integer rating;

    @Column(name = "REVIEW_TEXT")   
    private String comment;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_ON")
    private Date createdAt = new Date();
}
