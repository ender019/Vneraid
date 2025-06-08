package com.vneraid.botservice.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {
    @PostMapping("/signup")
    public String registration() {
        log.info("Auth Signup Endpoint");
        return "Registration Successful";
    }

    @GetMapping("/signin")
    public String authentication() {
        log.info("Auth Authentication Endpoint");
        return "Signin Successful";
    }

    @GetMapping("/logout")
    public String logout() {
        log.info("Auth Logout Endpoint");
        return "Logout Successful";
    }

    @GetMapping("/vereficate/{id}")
    public String verification(@PathVariable Long id) {
        log.info("Auth Verfication Endpoint");
        return "Verification Successful";
    }
}
