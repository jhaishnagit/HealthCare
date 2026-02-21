package com.jc.healthcare.dto;

import lombok.Data;
import lombok.Getter;
@Data
@Getter
public class HospitalListDTO {

    private Long id;
    private String name;
    private String city;
    private String type;
    private Double rating;
    private Integer ratingCount;

    private Double latitude;
    private Double longitude;
    private String address;
    private String hospitalPhone;

    public HospitalListDTO(
            Long id,
            String name,
            String city,
            String type,
            Double rating,
            Integer ratingCount,
            Double latitude,
            Double longitude,
            String address,
            String hospitalPhone
    ) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.type = type;
        this.rating = rating;
        this.ratingCount = ratingCount;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.hospitalPhone = hospitalPhone;
    }
}
