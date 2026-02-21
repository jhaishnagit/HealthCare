package com.jc.healthcare.repository;

import com.jc.healthcare.model.CustomerAddress;
import com.jc.healthcare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {

    List<CustomerAddress> findByUser(User user);

    List<CustomerAddress> findByUserId(Long userId);

    CustomerAddress findByUserIdAndIsDefault(Long userId, Integer isDefault);
}
