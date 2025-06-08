package com.vneraid.botservice.controllers;

import com.vneraid.botservice.dtos.AddSessionDTO;
import com.vneraid.botservice.dtos.CheckDTO;
import com.vneraid.botservice.services.BotService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("bot")
public class BotController {
    @Autowired
    private BotService botService;

    @PostMapping("/check")
    public Integer check(@RequestBody CheckDTO message) {
        log.info("Bot Check Endpoint");
        log.debug("message: {}", message);
        int res = botService.checkSpam(message);
        return res;
    }

    @PostMapping("/session")
    public void add_session(@RequestBody AddSessionDTO message) {
        log.info("Bot Add Session Endpoint");
        log.debug("message: {}", message);
        botService.addSession(message.user_id(), message.group_id(), message.group_name());
    }

    @PutMapping("/vereficate")
    public void vereficate(@RequestBody String tg_id) {
        log.info("Bot Vereficate Endpoint");
        log.debug("User id: {}", tg_id);
        botService.vereficate(tg_id);
    }
}
