package com.vneraid.botservice.services;

import com.vneraid.botservice.dtos.SessionDTO;
import com.vneraid.botservice.dtos.SettingsDTO;
import com.vneraid.botservice.dtos.UserDTO;
import com.vneraid.botservice.entities.Connection;
import com.vneraid.botservice.entities.Session;
import com.vneraid.botservice.repository.ConnectionRepository;
import com.vneraid.botservice.repository.SessionRepository;
import com.vneraid.botservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.NoSuchElementException;

@Service
public class AppService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private ConnectionRepository connectionRepository;


    public void setSettings(long id, SettingsDTO settings) {
        var ses = sessionRepository.findSessionById(id).orElseThrow();
        ses.setSession_name(settings.name());
        ses.setImgPossible(settings.imgPossible());
        ses.setVideoPossible(settings.videoPossible());
        ses.setAudioPossible(settings.audioPossible());
        ses.setLinkPossible(settings.linkPossible());
        ses.setMaxWarn(settings.maxWarn());
        ses.setActive(settings.active());
        sessionRepository.save(ses);
    }

    public SettingsDTO getSettings(Long id) {
        var res = sessionRepository.findById(id).orElseThrow();
        return new SettingsDTO(res.getSession_name(), res.getImgPossible(), res.getVideoPossible(),
                res.getAudioPossible(), res.getLinkPossible(), res.getMaxWarn(), res.getActive());
    }

    public SessionDTO getSession(Long id) {
        var res = connectionRepository.findConnectionByUserId(id);
        return new SessionDTO(
                res.stream().filter(el -> el.getRole().equals("writer"))
                        .map(el -> el.getUser().getUsername()).toList(),
                res.stream().filter(el -> el.getRole().equals("reader"))
                        .map(el -> el.getUser().getUsername()).toList());
    }

    public UserDTO getUser(Long id) {
        var res = userRepository.findUserById(id).orElseThrow();
        return new UserDTO(res.getUsername(), res.getEmail(), res.getCreated_at());
    }

    public void addSession(Long user_id, Long session_id, String role) {
        var ses = sessionRepository.getSessionById(user_id).orElseThrow();
        var user = userRepository.findUserById(session_id).orElseThrow();
        connectionRepository.save(new Connection(user, ses, "admin"));
    }
}
