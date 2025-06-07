package com.vneraid.botservice.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @PostMapping("/signup")
    public String registration() {
        return "Registration Successful";
    }

    @GetMapping("/signin")
    public String authentication() {
        return "Signin Successful";
    }

    @GetMapping("/logout")
    public String logout() {
        return "Logout Successful";
    }

    @GetMapping("/vereficate/{id}")
    public String verification(@PathVariable Long id) {
        return "Verification Successful";
    }
}
