package com.vneraid.botservice.controllers;

import com.vneraid.botservice.dtos.*;
import com.vneraid.botservice.repository.UserRepository;
import com.vneraid.botservice.services.AppService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/app")
public class AppController {
    @Autowired
    private AppService appService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        log.info("App Get User Endpoint");
        log.debug("User Id: {}", id);
        return appService.getUser(id);
    }

    @GetMapping("/users/{id}/sessions")
    public SessionDTO getSessions(@PathVariable Long id) {
        log.info("App Get Session Endpoint");
        log.debug("Session Id: {}", id);
        return appService.getSession(id);
    }

    @GetMapping("/sessions/{id}")
    public SettingsDTO getSession(@PathVariable Long id) {
        return appService.getSettings(id);
    }

    @GetMapping("/app/session/{id}/collaborators")
    public List<CollabaratorsDTO> getCollaborators(@PathVariable Long id) {
        log.info("App Get Collaborators Endpoint");
        log.debug("Collaborator Id: {}", id);
        return appService.getCollaborators(id);
    }

    @PutMapping("/session/{id}/settings")
    public String setSessionSettings(@PathVariable Long id, @RequestBody SettingsDTO settings) {
        appService.setSettings(id, settings);
        return "Success";
    }

    @PutMapping("/session/{id}/add")
    public String addSession(@PathVariable Long id, @RequestBody AddUserDTO new_user) {
        log.info("Adding new user: " + new_user);
        var user = userRepository.getUsersByUsername(new_user.username()).orElseThrow();
        appService.addSession(user.getId(), id, new_user.role());
        return "Success";
    }

    @DeleteMapping("/app/session/{id}/remove")
    public Map<String, String> removeSession(@PathVariable Long id) {
        log.info("Removing session: " + id);
        var user = userRepository.findUserById(id).orElseThrow();
        userRepository.deleteUserById(id);
        return Map.of("username", user.getUsername());
    }
}
