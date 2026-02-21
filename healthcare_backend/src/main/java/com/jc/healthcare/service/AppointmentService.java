package com.jc.healthcare.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jc.healthcare.model.Appointment;
import com.jc.healthcare.model.DoctorAvailability;
import com.jc.healthcare.repository.AppointmentRepository;
import com.jc.healthcare.repository.DoctorAvailabilityRepository;

import jakarta.transaction.Transactional;
@Service
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepo;

    @Autowired
    private DoctorAvailabilityRepository availabilityRepo;

    public Appointment bookAppointment(Long userId, Long doctorId, Long slotId) {

        DoctorAvailability slot = availabilityRepo.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!"AVAILABLE".equalsIgnoreCase(slot.getSlotStatus())) {
            throw new RuntimeException("Slot not available");
        }

        if (appointmentRepo.existsBySlotIdAndStatus(slotId, "BOOKED")) {
            throw new RuntimeException("Slot already booked");
        }

        Appointment appointment = new Appointment();
        appointment.setUserId(userId);
        appointment.setDoctorId(doctorId);
        appointment.setSlotId(slotId);
        appointment.setAppointmentDate(slot.getSlotDate());
        appointment.setStartTime(slot.getStartTime());

        appointment.setStatus("BOOKED");
        appointment.setCreatedAt(LocalDateTime.now());

        Appointment saved = appointmentRepo.save(appointment);

        slot.setSlotStatus("BOOKED");
        availabilityRepo.save(slot);

        return saved;
    }

    public void cancelAppointment(Long appointmentId, Long userId) {

        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        appointment.setStatus("CANCELLED");
        appointmentRepo.save(appointment);

        DoctorAvailability slot = availabilityRepo
                .findById(appointment.getSlotId())
                .orElseThrow();

        slot.setSlotStatus("AVAILABLE");
        availabilityRepo.save(slot);
    }
}
