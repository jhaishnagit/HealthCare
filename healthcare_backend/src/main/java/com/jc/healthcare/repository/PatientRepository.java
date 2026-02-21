package com.jc.healthcare.repository;

import com.jc.healthcare.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("SELECT COUNT(p) FROM Patient p")
    long getPatientCount();

    List<Patient> findByMedisionStatusIgnoreCase(String medisionStatus);
    List<Patient> findByDoctorStatusIgnoreCase(String doctorStatus);
    List<Patient> findByLabStatusIgnoreCase(String labStatus);

    // 🔍 Filter by Date + Status + Doctor
    @Query(value = """
            SELECT * FROM patients p
            WHERE TO_DATE(p.appointment_date, 'DD-MON-RR') = TO_DATE(:fromDate, 'YYYY-MM-DD')
              AND (:doctorStatus IS NULL OR :doctorStatus='' OR LOWER(:doctorStatus)='all' 
                   OR LOWER(p.doctor_status)=LOWER(:doctorStatus))
              AND (:medisionStatus IS NULL OR :medisionStatus='' OR LOWER(:medisionStatus)='all' 
                   OR LOWER(p.medision_status)=LOWER(:medisionStatus))
              AND (:doctorId IS NULL OR :doctorId=0 OR p.doctor_id = :doctorId)
            ORDER BY p.appointment_time ASC
            """, nativeQuery = true)
    List<Patient> findPatientsByStatusAndDateNative(
            @Param("fromDate") String fromDate,
            @Param("medisionStatus") String medisionStatus,
            @Param("doctorStatus") String doctorStatus,
            @Param("doctorId") Long doctorId
    );

    // 🧍 Full patient + bed + ward details
    @Query(value = """
            SELECT 
                p.patient_id, p.name, p.gender, p.disease, p.phone, p.address, 
                p.doctor_status, p.medision_status, p.lab_status,
                b.booking_id, b.bed_id, b.admission_date, b.discharge_date, b.status AS bed_status,
                w.ward_id, w.ward_name, w.ward_type, w.total_beds, w.created_on
            FROM patients p
            LEFT JOIN bed_booking b ON p.patient_id = b.patient_id
            LEFT JOIN ward_master w ON b.ward_id = w.ward_id
            WHERE p.patient_id = :patientId
            """, nativeQuery = true)
    List<Object[]> getFullPatientDetails(@Param("patientId") Long patientId);

    @Query(value = """
            SELECT p.* FROM patients p
            WHERE TO_DATE(p.appointment_date, 'DD-MON-RR') = TRUNC(SYSDATE)
            ORDER BY p.appointment_time ASC
            """, nativeQuery = true)
    List<Patient> findAllTodayPatients();


    @Query(value = """
            SELECT p.* FROM patients p
            WHERE TO_DATE(p.appointment_date, 'DD-MON-RR') = TRUNC(SYSDATE)
              AND LOWER(p.doctor_status) = 'completed'
            ORDER BY p.appointment_time ASC
            """, nativeQuery = true)
    List<Patient> findTodayDoctorCompleted();


    @Query(value = """
            SELECT p.* FROM patients p
            WHERE TO_DATE(p.appointment_date, 'DD-MON-RR') = TRUNC(SYSDATE)
              AND LOWER(p.doctor_status) = 'pending'
            ORDER BY p.appointment_time ASC
            """, nativeQuery = true)
    List<Patient> findTodayDoctorPending();

}
