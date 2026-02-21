package com.jc.healthcare.controller;

import com.jc.healthcare.model.CustomerAddress;
import com.jc.healthcare.service.CustomerAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin
public class CustomerAddressController {

    @Autowired
    private CustomerAddressService addressService;

    // ADD ADDRESS
    @PostMapping("/add/{userId}")
    public CustomerAddress addAddress(
            @PathVariable Long userId,
            @RequestBody CustomerAddress address) {
        return addressService.addAddress(userId, address);
    }

    // LIST CUSTOMER ADDRESSES
    @GetMapping("/list/{userId}")
    public List<CustomerAddress> getAddresses(@PathVariable Long userId) {
        return addressService.getAddressesByUser(userId);
    }

    // SET DEFAULT ADDRESS
    @PutMapping("/default/{userId}/{addressId}")
    public CustomerAddress setDefaultAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {
        return addressService.setDefaultAddress(userId, addressId);
    }
}
