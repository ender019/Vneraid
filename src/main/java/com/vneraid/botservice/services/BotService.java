package com.vneraid.botservice.services;

import com.vneraid.botservice.entities.Connection;
import com.vneraid.botservice.entities.Session;
import com.vneraid.botservice.entities.Warning;
import com.vneraid.botservice.repository.ConnectionRepository;
import com.vneraid.botservice.repository.SessionRepository;
import com.vneraid.botservice.repository.UserRepository;
import com.vneraid.botservice.repository.WarningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class BotService {

    @Value("${services.ai.host}")
    private String ai_host;
    private final WebClient webClient;

    @Autowired
    private WarningRepository warningRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ConnectionRepository connectionRepository;

    public BotService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(ai_host).build();
    }

    public int checkSpam(String user_id, String session_id, String message) {
        boolean res;
        try {
            res = webClient.post().uri("/check").bodyValue(message).retrieve().bodyToMono(Boolean.class).block();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        int out = res ? 1 : 0;
        if(res) {
            var user = warningRepository.findByUser_id(Long.valueOf(user_id)).orElse(new Warning());
            var ses = sessionRepository.findSessionByGroup_id(session_id).orElseThrow();
            user.setUser_id(user_id);
            user.setSession(ses);
            user.setWarns(1);
            if(user.getWarns() + 1 == ses.getMaxWarn()) {
                out = 3;
                user.setBaned(true);
            }
            user.setWarns(ses.getMaxWarn()+1);
            warningRepository.save(user);
        }
        return out;
    }

    public void addSession(String user_id, String session_id, String group_name) {
        var ses = sessionRepository.save(new Session(session_id, group_name));
        var user = userRepository.findUserByTg_id(user_id).orElseThrow();
        connectionRepository.save(new Connection(user, ses, "admin"));
    }
}
