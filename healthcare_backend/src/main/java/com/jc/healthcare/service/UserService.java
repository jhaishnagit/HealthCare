package com.jc.healthcare.service;

import com.jc.healthcare.model.User;
import com.jc.healthcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        return userRepository.save(user);
    }

    public User login(String mobileNumber, String password) {
        Optional<User> existing = userRepository.findByMobileNumber(mobileNumber);

        if (existing.isPresent() && existing.get().getPassword().equals(password)) {
            return existing.get();
        }
        return null;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
