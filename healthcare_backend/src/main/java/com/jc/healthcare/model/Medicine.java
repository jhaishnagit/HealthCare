package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
@Entity
@Table(name = "medicine")
@Data
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "medicine_seq")
    @SequenceGenerator(name = "medicine_seq", sequenceName = "MEDICINE_SEQ", allocationSize = 1)
    @Column(name = "MEDICINE_ID")
    private Long id;

    @Column(name = "MEDICINE_NAME")
    private String medicineName;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "MANUFACTURER")
    private String manufacturer;

    @Column(name = "BATCH_NO")
    private String batchNo;

    @Column(name = "PRICE_PER_UNIT")
    private Double pricePerUnit;

    @Column(name = "PURCHASE_COST")
    private Double purchaseCost;

    @Column(name = "QUANTITY_AVAILABLE")
    private Integer quantityAvailable;

    @Column(name = "REORDER_LEVEL")
    private Integer reorderLevel;

    @Column(name = "EXPIRY_DATE")
    private Date expiryDate;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "LOCATION_OF_RACK")
    private String locationOfRack;

    @Column(name = "SUPPLIER_ID")
    private Long supplierId;

    @Column(name = "PERSON_ID")
    private Long personId;

    @Column(name = "ORGANIZATION_ID")
    private Long organizationId;

    @Column(name = "CREATED_AT")
    private Date createdAt;

    @Column(name = "UPDATED_AT")
    private Date updatedAt;

    @Column(name = "IMAGE_URL")
    private String imageUrl;
}
