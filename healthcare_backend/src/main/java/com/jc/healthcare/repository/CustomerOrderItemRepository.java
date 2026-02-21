package com.jc.healthcare.repository;

import com.jc.healthcare.model.CustomerOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerOrderItemRepository extends JpaRepository<CustomerOrderItem, Long> {

    List<CustomerOrderItem> findByOrderOrderId(Long orderId);
}
