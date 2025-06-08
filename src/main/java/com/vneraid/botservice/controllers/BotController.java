package com.vneraid.botservice.controllers;

import com.vneraid.botservice.dtos.AddSessionDTO;
import com.vneraid.botservice.dtos.CheckDTO;
import com.vneraid.botservice.dtos.VerificateDTO;
import com.vneraid.botservice.services.AuthService;
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
    @Autowired
    private AuthService authService;

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

    @DeleteMapping("/session/del")
    public void del_session(@RequestBody String group_id) {
        log.info("Bot Delete Session Endpoint");
        log.debug("Group id: {}", group_id);
        botService.delSession(group_id);
    }

    @PutMapping("/vereficate")
    public Boolean vereficate(@RequestBody VerificateDTO data) {
        log.info("Bot Vereficate Endpoint");
        log.debug("User id: {}", data);
        return authService.vereficate(data.hash(), data.tg_id());
    }
}
