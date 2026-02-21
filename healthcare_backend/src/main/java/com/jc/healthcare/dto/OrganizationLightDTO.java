package com.jc.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrganizationLightDTO {
    private Long id;
    private String name;
    private String city;
    private String code;
    private String verificationLevel;
    private String type;
}
