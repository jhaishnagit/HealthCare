package com.jc.healthcare.service;

import com.jc.healthcare.model.DoctorAvailability;
import com.jc.healthcare.repository.DoctorAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
public class DoctorAvailabilityService {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    public List<DoctorAvailability> getAvailableSlots(Long doctorId) {
        LocalDate today = LocalDate.now();
        return availabilityRepository
                .findByDoctorIdAndSlotDateBetweenAndSlotStatus(
                        doctorId,
                        today,
                        today.plusDays(3),
                        "AVAILABLE"
                );
    }
}
