package com.jc.healthcare.controller;

import com.jc.healthcare.model.User;
import com.jc.healthcare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    // REGISTER CUSTOMER / ADMIN / STAFF
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // LOGIN
    @PostMapping("/login")
    public User login(@RequestParam String mobileNumber,
                      @RequestParam String password) {
        return userService.login(mobileNumber, password);
    }

    // GET USER BY ID
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}
