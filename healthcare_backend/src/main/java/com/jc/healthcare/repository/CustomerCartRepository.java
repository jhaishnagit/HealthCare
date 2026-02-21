package com.jc.healthcare.repository;

import com.jc.healthcare.model.CustomerCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerCartRepository extends JpaRepository<CustomerCart, Long> {

    Optional<CustomerCart> findByUserId(Long userId);
}
