package com.jc.healthcare.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jc.healthcare.model.Doctor;
import com.jc.healthcare.model.DoctorAvailability;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByStatus(String status);

    List<Doctor> findBySpecialization(String specialization);

    Optional<Doctor> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByMedicalLicenseNo(String medicalLicenseNo);

    @Query("SELECT COUNT(d) FROM Doctor d")
    long getDoctorCount();

    List<Doctor> findByTalkAvailable(String talkAvailable);
    

@Query("""
    SELECT d FROM Doctor d
    WHERE d.talkAvailable = 'YES'
    AND (
        LOWER(d.doctorName) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(d.specialization) LIKE LOWER(CONCAT('%', :search, '%'))
    )
""")
Page<Doctor> searchTalkAvailableDoctors(String search, Pageable pageable);

}


