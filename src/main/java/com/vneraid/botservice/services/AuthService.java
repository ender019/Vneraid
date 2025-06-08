package com.vneraid.botservice.services;

import com.vneraid.botservice.entities.Submit;
import com.vneraid.botservice.entities.User;
import com.vneraid.botservice.repository.SubmitRepository;
import com.vneraid.botservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
public class AuthService {
    @Autowired
    private SubmitRepository submitRepository;
    @Autowired
    private UserRepository userRepository;

    public Boolean isAuthenticated() {

        return true;
    }

    public void login() {

    }

    public Boolean vereficate(String hash, String tg_id) {
        var sub = submitRepository.findSubmitByHash(hash).orElseThrow(NoSuchElementException::new);
        sub.getUser().setTg_id(tg_id);
        userRepository.save(sub.getUser());
        return true;
    }

    public void register(String username, String password) {}

    public String gen_hash(Long id) {
        var user = userRepository.findUserById(id).orElseThrow(NoSuchElementException::new);
        if(user.getTg_id() == null) throw new NoSuchElementException("Vereficated yet");
        LocalDateTime deadtime = LocalDateTime.now().plusHours(6);
        String hash = String.valueOf(System.currentTimeMillis() * 1000 % 834562748);
        var sub = submitRepository.findSubmitByUserId(id).orElse(new Submit(hash, deadtime, user));
        if(sub.getDeadline().isBefore(LocalDateTime.now())) {
            sub.setDeadline(deadtime);
            sub.setHash(hash);
            submitRepository.save(sub);
        }
        return sub.getHash();
    }
}
