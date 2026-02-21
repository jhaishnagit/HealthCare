package com.jc.healthcare.controller;

import com.jc.healthcare.model.CustomerOrder;
import com.jc.healthcare.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService orderService;

    // PLACE ORDER
    @PostMapping("/place/{userId}")
    public CustomerOrder placeOrder(@PathVariable Long userId) {
        return orderService.placeOrder(userId);
    }

    // ORDER DETAILS
    @GetMapping("/{orderId}")
    public CustomerOrder getOrder(@PathVariable Long orderId) {
        return orderService.getOrder(orderId);
    }

    // ORDER HISTORY
    @GetMapping("/history/{userId}")
    public List<CustomerOrder> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrderHistory(userId);
    }
    
   
    
    @GetMapping("/shop/{shopId}")
    public List<CustomerOrder> getShopOrders(@PathVariable Long shopId) {
        return orderService.getOrdersByShop(shopId);
    }

    @PutMapping("/confirm/{orderId}")
    public CustomerOrder confirmOrder(@PathVariable Long orderId) {
        return orderService.confirmOrder(orderId);
    }
    @PutMapping("/status/{orderId}")
    public CustomerOrder updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        return orderService.updateOrderStatus(orderId, status);
    }

}
