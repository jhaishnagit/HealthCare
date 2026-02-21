package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "HOSPITALS_MEDICALSTORES")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;
    private String type;
    private String tagline;

    @Lob
    private String description;

    private Integer established_year;
    private String ownership_type;

    // DB column: ORGANIZATION_MAIL (NOT NULL in your DB)
    @Column(name = "ORGANIZATION_MAIL")
    private String organizationMail;

    private String hospital_phone;
    private String alternate_phone;
    private String website;

    @Lob
    private String address;

    private String landmark;
    private String area;
    private String city;
    private String district;
    private String state;
    private String country;
    private String pincode;

    private Double latitude;
    private Double longitude;

    private Integer geofence_radius;
    private String location_accuracy;

    private String google_place_id;
    private String google_map_link;

    private Integer total_beds;
    private Integer icu_beds;
    private Integer emergency_beds;
    private Integer operation_theatres;
    private Integer ventilators;
    private Integer ambulances;

    // Stored as JSON ARRAY string: ["dep1","dep2"]
    @Lob
    private String departments;

    @Lob
    private String services;

    @Lob
    private String facilities;

    @Lob
    private String documents;

    @Lob
    private String images;

    private String registration_number;
    private String gst_number;

    @Temporal(TemporalType.DATE)
    private Date licence_expiry;

    @Temporal(TemporalType.DATE)
    private Date fire_safety_validity;

    @Lob
    private String insurance_details;

    private String status;

    // Java field name = verificationLevel
    // DB column name = VERIFICATION_LEVEL
    @Column(name = "VERIFICATION_LEVEL")
    private String verificationLevel = "0";

    @Temporal(TemporalType.DATE)
    private Date reviewed_at;

    private Long reviewed_by;

    @Lob
    private String rejection_reason;

    private Integer onboarding_stage;

    private Double rating;
    private Integer rating_count;
    private Integer views;
    private Integer profile_completion;

    @Temporal(TemporalType.DATE)
    private Date submitted_at;

    @Temporal(TemporalType.DATE)
    private Date last_login_at;

    private String ip_address;

    @Temporal(TemporalType.DATE)
    private Date created_at;

    @Temporal(TemporalType.DATE)
    private Date updated_at;

    // ---------- Bank Details ----------
    private String account_no;
    private String ifsc_code;
    private String branch_name;
    private String bank_name;
    private String bank_holder_name;

    @Lob
    private String passbookImage;  // JSON object
}
