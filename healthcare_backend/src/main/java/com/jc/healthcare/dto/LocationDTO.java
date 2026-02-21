package com.jc.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationDTO {
    private Long id;
    private Double latitude;
    private Double longitude;
    private String mapUrl;
}
