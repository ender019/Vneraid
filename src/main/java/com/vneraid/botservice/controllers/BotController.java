package com.vneraid.botservice.controllers;

import com.vneraid.botservice.dtos.MessageDTO;
import com.vneraid.botservice.services.BotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("bot")
public class BotController {
    @Autowired
    private BotService botService;

    @GetMapping("/check")
    public Integer check(@RequestBody MessageDTO message) {
        int res = botService.checkSpam(message.user_id(), message.group_id(), message.text());
        return res;
    }

    //TODO: group_id -> group_name
    @PostMapping("/session")
    public void add_session(@RequestBody MessageDTO message) {
        botService.addSession(message.user_id(), message.group_id(), message.group_id());
    }

    @PutMapping
    public void vereficate(@RequestBody MessageDTO message) {
        botService.vereficate(message.user_id());
    }
}
