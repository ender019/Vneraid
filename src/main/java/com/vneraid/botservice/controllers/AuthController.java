package com.vneraid.botservice.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/vereficate")
    public String verification() {
        return "Verification Successful";
    }
}
