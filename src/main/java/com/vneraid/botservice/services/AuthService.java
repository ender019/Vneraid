package com.vneraid.botservice.services;

import org.springframework.stereotype.Service;

@Service
public class AuthService {
    public Boolean isAuthenticated() {

        return true;
    }

    public void login() {

    }

    public Boolean vereficate(String username, String password) {
        return true;
    }

    public void register(String username, String password) {}
}
