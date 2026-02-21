package com.jc.healthcare.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LoginResponse {
    private String status;
    private String email;

    private List<String> roles;
    private String role;

    private Long organizationId;
    private String organizationCode;   // NEW
    private String organizationType;   // NEW

    private String verificationLevel;

    private boolean requiresOtp;
    private String message;
}
