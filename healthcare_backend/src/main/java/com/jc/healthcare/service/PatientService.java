package com.jc.healthcare.service;

import com.jc.healthcare.model.Patient;
import com.jc.healthcare.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public long Count() {
        return patientRepository.getPatientCount();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient updatePatient(Long id, Patient updatedPatient) {
        return patientRepository.findById(id).map(patient -> {

            patient.setName(updatedPatient.getName());
            patient.setGender(updatedPatient.getGender());
            patient.setAadhar(updatedPatient.getAadhar());
            patient.setPhone(updatedPatient.getPhone());
            patient.setDateOfBirth(updatedPatient.getDateOfBirth());
            patient.setAddress(updatedPatient.getAddress());
            patient.setDoctorId(updatedPatient.getDoctorId());
            patient.setAppointmentDate(updatedPatient.getAppointmentDate());
            patient.setAppointmentTime(updatedPatient.getAppointmentTime());

            patient.setDosageInstructions(updatedPatient.getDosageInstructions());
            patient.setGeneratedAt(updatedPatient.getGeneratedAt());
            patient.setNotes(updatedPatient.getNotes());
            patient.setSelectedMedicines(updatedPatient.getSelectedMedicines());
            patient.setDateIssued(updatedPatient.getDateIssued());
            patient.setMedication(updatedPatient.getMedication());
            patient.setSelectedTests(updatedPatient.getSelectedTests());
            patient.setMedisionStatus(updatedPatient.getMedisionStatus());
            patient.setDoctorStatus(updatedPatient.getDoctorStatus());
            patient.setLabStatus(updatedPatient.getLabStatus());

            return patientRepository.save(patient);
        }).orElseThrow(() -> new RuntimeException("Patient not found with ID: " + id));
    }

    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found with ID: " + id);
        }
        patientRepository.deleteById(id);
    }

    public List<Patient> getByMedisionStatus(String status) {
        return patientRepository.findByMedisionStatusIgnoreCase(status);
    }

    public List<Patient> getByDoctorStatus(String status) {
        return patientRepository.findByDoctorStatusIgnoreCase(status);
    }

    public List<Patient> getByLabStatus(String status) {
        return patientRepository.findByLabStatusIgnoreCase(status);
    }

    // Filter native
    public List<Patient> getFilteredPatientsNative(String fromDate, String medisionStatus, String doctorStatus, Long doctorId) {
        return patientRepository.findPatientsByStatusAndDateNative(fromDate, medisionStatus, doctorStatus, doctorId);
    }

    // Full details mapping
    public Map<String, Object> getFullPatientDetails(Long patientId) {
        List<Object[]> result = patientRepository.getFullPatientDetails(patientId);
        if (result.isEmpty()) throw new RuntimeException("No details found");

        Object[] row = result.get(0);
        Map<String, Object> map = new HashMap<>();

        Map<String, Object> patient = new HashMap<>();
        patient.put("patientId", row[0]);
        patient.put("name", row[1]);
        patient.put("gender", row[2]);
        patient.put("disease", row[3]);
        patient.put("phone", row[4]);
        patient.put("address", row[5]);
        patient.put("doctorStatus", row[6]);
        patient.put("medisionStatus", row[7]);
        patient.put("labStatus", row[8]);

        Map<String, Object> bed = new HashMap<>();
        bed.put("bookingId", row[9]);
        bed.put("bedId", row[10]);
        bed.put("admissionDate", row[11]);
        bed.put("dischargeDate", row[12]);
        bed.put("status", row[13]);

        Map<String, Object> ward = new HashMap<>();
        ward.put("wardId", row[14]);
        ward.put("wardName", row[15]);
        ward.put("wardType", row[16]);
        ward.put("totalBeds", row[17]);
        ward.put("createdOn", row[18]);

        map.put("patient", patient);
        map.put("bedBooking", bed);
        map.put("ward", ward);

        return map;
    }

    public Patient partialUpdatePatient(Long id, Map<String, Object> updates) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "doctorStatus" -> patient.setDoctorStatus((String) value);
                case "labStatus" -> patient.setLabStatus((String) value);
                case "medisionStatus" -> patient.setMedisionStatus((String) value);
                case "selectedTests" -> patient.setSelectedTests((String) value);
                case "selectedMedicines" -> patient.setSelectedMedicines((String) value);
                case "notes" -> patient.setNotes((String) value);
                case "appointmentTime" -> patient.setAppointmentTime((String) value);
                case "appointmentDate" -> patient.setAppointmentDate((String) value);
                default -> {}
            }
        });

        return patientRepository.save(patient);
    }

    // TODAY FEATURES
    public List<Patient> getAllTodayPatients() {
        return patientRepository.findAllTodayPatients();
    }
    public List<Patient> getTodayDoctorCompleted() {
        return patientRepository.findTodayDoctorCompleted();
    }
    public List<Patient> getTodayDoctorPending() {
        return patientRepository.findTodayDoctorPending();
    }
}
