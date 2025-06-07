package com.vneraid.botservice.controllers;

import com.vneraid.botservice.dtos.SessionDTO;
import com.vneraid.botservice.dtos.SettingsDTO;
import com.vneraid.botservice.dtos.UserDTO;
import com.vneraid.botservice.services.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/app")
public class AppController {
    @Autowired
    private AppService appService;

    @GetMapping("/users/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        return appService.getUser(id);
    }

    @GetMapping("/users/{id}/sessions")
    public SessionDTO getSessions(@PathVariable Long id) {
        return appService.getSession(id);
    }

    @GetMapping("/sessions/{id}")
    public SettingsDTO getSession(@PathVariable Long id) {
        return appService.getSettings(id);
    }

    @PatchMapping("/session/{id}/settings")
    public String setSessionSettings(@PathVariable Long id, @RequestBody SettingsDTO settings) {
        appService.setSettings(id, settings);
        return "Success";
    }
}
