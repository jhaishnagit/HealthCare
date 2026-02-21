package com.jc.healthcare.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import com.jc.healthcare.repository.DoctorAvailabilityRepository;

@Component
public class SlotCleanupJob {

    @Autowired
    private DoctorAvailabilityRepository repo;

    // Runs every 1 hour
    @Scheduled(cron = "0 0 * * * *") // every hour
    public void autoExpireSlots() {
        repo.expireOldSlots();
    }

        
       /* @Scheduled(cron = "0 30 2 * * *") // daily at 2:30 AM
        public void cleanupOldSlots() {
            repo.deleteOldSlots();
       }*/

    
}
