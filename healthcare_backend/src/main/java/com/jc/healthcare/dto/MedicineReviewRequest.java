package com.jc.healthcare.dto;

import lombok.Data;

@Data
public class MedicineReviewRequest {
    private Long userId;
    private Integer rating;
    private String comment;

    
}
