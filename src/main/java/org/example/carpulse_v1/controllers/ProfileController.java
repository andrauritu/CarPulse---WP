package org.example.carpulse_v1.controllers;

import java.security.Principal;

import org.example.carpulse_v1.domain.User;
import org.example.carpulse_v1.repositories.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RestController
public class ProfileController {
    private final UserRepository userRepo;

    public ProfileController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping("/admin/profile")
    public User getProfile(Principal principal) {
        // principal.getName() is the username
        User u = userRepo.findByUsername(principal.getName());
        if (u == null) {
            throw new UsernameNotFoundException("User not found: " + principal.getName());
        }
        return u;
    }
}
