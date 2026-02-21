package com.jc.healthcare.service;

import com.jc.healthcare.dto.LoginResponse;
import com.jc.healthcare.model.Doctor;
import com.jc.healthcare.model.Hospital;
import com.jc.healthcare.model.Staff;
import com.jc.healthcare.repository.DoctorRepository;
import com.jc.healthcare.repository.HospitalRepository;
import com.jc.healthcare.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Long> otpTimestamps = new ConcurrentHashMap<>();

    // =========================================================
    // LOGIN
    // =========================================================
    public LoginResponse login(String email, String password) {

        List<String> roles = new ArrayList<>();
        boolean staffMatched = false;
        boolean doctorMatched = false;

        // ------------------------------
        // 1️⃣ STAFF login check
        // ------------------------------
        Staff staff = staffRepository.findByEmail(email);
        if (staff != null && Objects.equals(staff.getPassword(), password)) {
            staffMatched = true;
            if (staff.getRole() != null && !staff.getRole().isBlank()) {
                roles.add(staff.getRole().toLowerCase());
            }
        }

        // ------------------------------
        // 2️⃣ DOCTOR login check
        // ------------------------------
        Doctor matchedDoctor = null;
        Optional<Doctor> docOpt = doctorRepository.findByEmail(email);

        if (docOpt.isPresent()) {
            Doctor doctor = docOpt.get();
            if (Objects.equals(doctor.getPassword(), password)) {
                doctorMatched = true;
                matchedDoctor = doctor;

                if (doctor.getRole() != null && !doctor.getRole().isBlank()) {
                    roles.add(doctor.getRole().toLowerCase());
                } else {
                    roles.add("doctor");
                }
            }
        }

        // Invalid login
        if (!staffMatched && !doctorMatched) {
            return LoginResponse.builder()
                    .status("error")
                    .message("Invalid email or password")
                    .email(email)
                    .roles(Collections.emptyList())
                    .role(null)
                    .organizationId(null)
                    .organizationCode(null)
                    .organizationType(null)
                    .verificationLevel(null)
                    .requiresOtp(false)
                    .build();
        }

        // ------------------------------
        // 3️⃣ Resolve organizationId
        // ------------------------------
        Long staffOrgId = staffMatched ? staff.getOrganizationId() : null;
        Long doctorOrgId = doctorMatched ? matchedDoctor.getOrganizationId() : null;
        Long organizationId = null;

        if (staffMatched && doctorMatched) {
            if (!Objects.equals(staffOrgId, doctorOrgId)) {
                return LoginResponse.builder()
                        .status("error")
                        .email(email)
                        .roles(roles)
                        .role(roles.isEmpty() ? null : roles.get(0))
                        .organizationId(null)
                        .organizationCode(null)
                        .organizationType(null)
                        .verificationLevel(null)
                        .requiresOtp(false)
                        .message("Organization mismatch for multiple roles")
                        .build();
            }
            organizationId = staffOrgId;
        } else if (staffMatched) {
            organizationId = staffOrgId;
        } else if (doctorMatched) {
            organizationId = doctorOrgId;
        }

        // ------------------------------
        // 4️⃣ Get Hospital info
        // ------------------------------
        String verificationLevel = null;
        String organizationCode = null;
        String organizationType = null;

        if (organizationId != null) {
            Optional<Hospital> hospitalOpt = hospitalRepository.findById(organizationId);
            if (hospitalOpt.isPresent()) {
                Hospital hospital = hospitalOpt.get();
                verificationLevel = hospital.getVerificationLevel();   // UPDATED ✔
                organizationCode = hospital.getCode();
                organizationType = hospital.getType();
            }
        }

        // ------------------------------
        // 5️⃣ OTP Check
        // ------------------------------
        boolean requiresOtp = false;

        if (staffMatched && staff != null) {
            Integer tfa = staff.getTwoFactAuthentication();
            requiresOtp = (tfa != null && tfa == 0);
        }

        String primaryRole = roles.isEmpty() ? null : roles.get(0);

        if (requiresOtp) {
            String otp = generateOtp();
            sendOtpEmail(email, otp);

            otpStore.put(email, otp);
            otpTimestamps.put(email, System.currentTimeMillis());

            return LoginResponse.builder()
                    .status("otp_required")
                    .email(email)
                    .roles(roles)
                    .role(primaryRole)
                    .organizationId(organizationId)
                    .organizationCode(organizationCode)
                    .organizationType(organizationType)
                    .verificationLevel(verificationLevel)
                    .requiresOtp(true)
                    .message("OTP sent to your registered email")
                    .build();
        }

        // SUCCESS Login
        return LoginResponse.builder()
                .status("success")
                .email(email)
                .roles(roles)
                .role(primaryRole)
                .organizationId(organizationId)
                .organizationCode(organizationCode)
                .organizationType(organizationType)
                .verificationLevel(verificationLevel)
                .requiresOtp(false)
                .message(roles.size() > 1 ? "Multiple roles found" : "Login successful")
                .build();
    }

    // =========================================================
    // VERIFY OTP
    // =========================================================
    public LoginResponse verifyOtp(String email, String enteredOtp) {

        String storedOtp = otpStore.get(email);
        Long createdAt = otpTimestamps.get(email);

        if (storedOtp == null || createdAt == null) {
            return errorOtp(email, "OTP not generated or expired");
        }

        if (System.currentTimeMillis() - createdAt > 120_000) {
            otpStore.remove(email);
            otpTimestamps.remove(email);
            return errorOtp(email, "OTP expired. Please login again.");
        }

        if (!storedOtp.equals(enteredOtp)) {
            return errorOtp(email, "Invalid OTP");
        }

        otpStore.remove(email);
        otpTimestamps.remove(email);

        return buildSuccessfulOtpResponse(email);
    }

    // =========================================================
    // HELPERS
    // =========================================================
    private LoginResponse errorOtp(String email, String msg) {
        return LoginResponse.builder()
                .status("error")
                .email(email)
                .roles(Collections.emptyList())
                .role(null)
                .organizationId(null)
                .organizationCode(null)
                .organizationType(null)
                .verificationLevel(null)
                .requiresOtp(true)
                .message(msg)
                .build();
    }

    private LoginResponse buildSuccessfulOtpResponse(String email) {

        List<String> roles = new ArrayList<>();

        Staff staff = staffRepository.findByEmail(email);
        Doctor doctor = doctorRepository.findByEmail(email).orElse(null);

        boolean staffExists = staff != null;
        boolean doctorExists = doctor != null;

        if (staffExists && staff.getRole() != null) {
            roles.add(staff.getRole().toLowerCase());
        }

        if (doctorExists) {
            if (doctor.getRole() != null && !doctor.getRole().isBlank()) {
                roles.add(doctor.getRole().toLowerCase());
            } else {
                roles.add("doctor");
            }
        }

        Long staffOrgId = staffExists ? staff.getOrganizationId() : null;
        Long doctorOrgId = doctorExists ? doctor.getOrganizationId() : null;
        Long organizationId = null;

        if (staffExists && doctorExists) {

            if (!Objects.equals(staffOrgId, doctorOrgId)) {
                return LoginResponse.builder()
                        .status("error")
                        .email(email)
                        .roles(roles)
                        .role(roles.isEmpty() ? null : roles.get(0))
                        .organizationId(null)
                        .organizationCode(null)
                        .organizationType(null)
                        .verificationLevel(null)
                        .requiresOtp(false)
                        .message("Organization mismatch for multiple roles")
                        .build();
            }

            organizationId = staffOrgId;

        } else if (staffExists) {
            organizationId = staffOrgId;
        } else if (doctorExists) {
            organizationId = doctorOrgId;
        }

        String verificationLevel = null;
        String organizationCode = null;
        String organizationType = null;

        if (organizationId != null) {

            Optional<Hospital> hospitalOpt = hospitalRepository.findById(organizationId);
            if (hospitalOpt.isPresent()) {

                Hospital hospital = hospitalOpt.get();
                verificationLevel = hospital.getVerificationLevel();   // UPDATED ✔
                organizationCode = hospital.getCode();
                organizationType = hospital.getType();
            }
        }

        return LoginResponse.builder()
                .status("success")
                .email(email)
                .roles(roles)
                .role(roles.isEmpty() ? null : roles.get(0))
                .organizationId(organizationId)
                .organizationCode(organizationCode)
                .organizationType(organizationType)
                .verificationLevel(verificationLevel)
                .requiresOtp(false)
                .message(roles.size() > 1 ? "Multiple roles found" : "Login successful")
                .build();
    }


    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    private void sendOtpEmail(String to, String otp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Your Login OTP - JC Healthcare");
        msg.setText("Your OTP is: " + otp + "\n\nValid for 2 minutes.\n\n- JC Healthcare Team");
        mailSender.send(msg);
    }
}
