package com.jc.healthcare.repository;

import com.jc.healthcare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByMobileNumber(String mobileNumber);

    Optional<User> findByEmailId(String emailId);

    boolean existsByMobileNumber(String mobileNumber);
}
