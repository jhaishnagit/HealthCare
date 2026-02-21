package com.jc.healthcare.dto;

public class NearbyOrganization {

    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;
    private String city;
    private String type;
    private String hospitalPhone;
    private String services;        // ✅ NEW
    private Double distance;

    // ✅ Constructor MUST match JPQL order exactly
    public NearbyOrganization(
            Long id,
            String name,
            Double latitude,
            Double longitude,
            String city,
            String type,
            String hospitalPhone,
            String services,
            Double distance
    ) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
        this.type = type;
        this.hospitalPhone = hospitalPhone;
        this.services = services;
        this.distance = distance;
    }

    // getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getCity() { return city; }
    public String getType() { return type; }
    public String getHospitalPhone() { return hospitalPhone; }
    public String getServices() { return services; }
    public Double getDistance() { return distance; }
}
