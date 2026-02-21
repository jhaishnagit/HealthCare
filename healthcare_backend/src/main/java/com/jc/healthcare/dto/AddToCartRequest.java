package com.jc.healthcare.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long userId;
    private Long medicineId;
    private Integer qty;
    private Double price;
}
