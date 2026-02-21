package com.jc.healthcare.repository;

import com.jc.healthcare.model.CustomerOrder;
import com.jc.healthcare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {

    List<CustomerOrder> findByUserId(Long userId);
}

