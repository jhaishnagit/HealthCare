package com.jc.healthcare.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "DOCTOR_AVAILABILITY")
@Data
public class DoctorAvailability {

    @Id
    @Column(name = "SLOT_ID")
    private Long slotId;

    @Column(name = "DOCTOR_ID")
    private Long doctorId;

    @Column(name = "SLOT_DATE")
    private LocalDate slotDate;

    
    @Column(name = "START_TIME")
    private LocalDateTime startTime;

    @Column(name = "END_TIME")
    private LocalDateTime endTime;

    @Column(name = "SLOT_STATUS")
    private String slotStatus;

    @Column(name = "CREATED_AT")
    private LocalDate createdAt;

    // getters & setters
}
