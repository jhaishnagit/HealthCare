package com.jc.healthcare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jc.healthcare.model.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

boolean existsBySlotId(Long slotId);

List<Appointment> findByUserId(Long userId);

List<Appointment> findByDoctorId(Long doctorId);
boolean existsBySlotIdAndStatus(Long slotId, String status);
}
