package com.jc.healthcare.service;

import com.jc.healthcare.model.CustomerAddress;
import com.jc.healthcare.model.User;
import com.jc.healthcare.repository.CustomerAddressRepository;
import com.jc.healthcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerAddressService {

    @Autowired
    private CustomerAddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public CustomerAddress addAddress(Long userId, CustomerAddress address) {
        User user = userRepository.findById(userId).orElse(null);
        address.setUser(user);
        return addressRepository.save(address);
    }

    public List<CustomerAddress> getAddressesByUser(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public CustomerAddress setDefaultAddress(Long userId, Long addressId) {
        List<CustomerAddress> addresses = addressRepository.findByUserId(userId);

        for (CustomerAddress a : addresses) {
            a.setIsDefault(0);
            addressRepository.save(a);
        }

        CustomerAddress selected = addressRepository.findById(addressId).orElse(null);
        if (selected != null) {
            selected.setIsDefault(1);
            addressRepository.save(selected);
        }
        return selected;
    }
}
