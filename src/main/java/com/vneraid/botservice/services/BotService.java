package com.vneraid.botservice.services;

import com.vneraid.botservice.dtos.AiAnswerDTO;
import com.vneraid.botservice.dtos.AiDTO;
import com.vneraid.botservice.dtos.CheckDTO;
import com.vneraid.botservice.entities.Connection;
import com.vneraid.botservice.entities.Session;
import com.vneraid.botservice.entities.Warning;
import com.vneraid.botservice.repository.ConnectionRepository;
import com.vneraid.botservice.repository.SessionRepository;
import com.vneraid.botservice.repository.UserRepository;
import com.vneraid.botservice.repository.WarningRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.NoSuchElementException;

@Slf4j
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
    private RestTemplate restTemplate = new RestTemplate();

    public BotService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(ai_host).build();
    }

    public int checkSpam(CheckDTO message) {
        log.info("Checking spam");
        int res;
        var request = new AiDTO(message.text(), message.hiddenUrlCount(),
                message.mediaAttachment(), message.stickerOrGifPresent());
        try {
//            res = webClient.post().uri("/bot/predict").contentType(MediaType.TEXT_PLAIN)
//                    .bodyValue(request).retrieve().bodyToMono(Integer.class).block();
            AiAnswerDTO response = restTemplate.postForObject(ai_host + "/bot/predict", request, AiAnswerDTO.class);
            log.info("Resposta do servidor: " + response);
            res = response.prediction();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        log.info("Response is: " + res);
//        if (res == 1) {
//            var user = warningRepository.findByUser_id(Long.valueOf(message.user_id())).orElse(new Warning());
//            var ses = sessionRepository.findSessionByGroup_id(message.group_id()).orElseThrow(
//                    () -> new NoSuchElementException("Session not found")
//            );
//            user.setUser_id(message.user_id());
//            user.setSession(ses);
//            user.setWarns(1);
//            if(user.getBaned()) return 2;
//            if (user.getWarns() + 1 == ses.getMaxWarn()) {
//                res = 2;
//                user.setBaned(true);
//            }
//            user.setWarns(ses.getMaxWarn() + 1);
//            warningRepository.save(user);
//        }
        log.info("Verdict is: " + res);
        return res;
    }

    @Transactional
    public void addSession(String user_id, String session_id, String group_name) {
        var ses = sessionRepository.save(new Session(session_id, group_name));
        var user = userRepository.findUserByTg_id(user_id).orElseThrow();
        connectionRepository.save(new Connection(user, ses, "admin"));
    }

    @Transactional
    public void delSession(String session_id) {
        var ses = sessionRepository.findSessionByGroup_id(session_id).orElseThrow(
                () -> new NoSuchElementException("Session not found")
        );
        sessionRepository.deleteSessionById(ses.getId());
    }
}
