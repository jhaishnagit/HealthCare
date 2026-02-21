package com.jc.healthcare.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "APPOINTMENTS")
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 🔥 THIS FIXES ORA-32795
    @Column(name = "APPOINTMENT_ID")
    private Long appointmentId;

    @Column(name = "DOCTOR_ID", nullable = false)
    private Long doctorId;

    @Column(name = "SLOT_ID", nullable = false)
    private Long slotId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "HOSPITAL_ID")
    private Long hospitalId;

    @Column(name = "APPOINTMENT_DATE")
    private LocalDate appointmentDate;

    @Column(name = "START_TIME")
    private LocalDateTime startTime;


    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;
}
