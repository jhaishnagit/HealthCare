package com.jc.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemResponse {

    private Long cartItemId;
    private Long itemId;

    private String medicineName;
    private String imageUrl;

    private Integer quantity;
    private Double price;
    private Double totalPrice;
}
