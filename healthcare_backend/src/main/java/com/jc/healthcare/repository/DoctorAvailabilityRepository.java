package com.jc.healthcare.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.jc.healthcare.model.DoctorAvailability;

public interface DoctorAvailabilityRepository
        extends JpaRepository<DoctorAvailability, Long> {

  
    List<DoctorAvailability>
    findByDoctorIdAndSlotDateBetweenAndSlotStatus(
            Long doctorId,
            LocalDate start,
            LocalDate end,
            String slotStatus
    );
    
    @Modifying
    @Query("""
        UPDATE DoctorAvailability d
        SET d.slotStatus = 'EXPIRED'
        WHERE d.slotDate < :today
    """)
    int expireOldSlots(LocalDate today);
    
    @Modifying
    @Query("""
        UPDATE DoctorAvailability d
        SET d.slotStatus = 'EXPIRED'
        WHERE d.endTime < CURRENT_TIMESTAMP
          AND d.slotStatus = 'AVAILABLE'
    """)
    int expireOldSlots();

    

}
