package org.example.carpulse_v1.controllers;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.example.carpulse_v1.domain.Role;
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
    public Map<String, Object> getProfile(Principal principal) {
        // principal.getName() is the username
        User u = userRepo.findByUsername(principal.getName());
        if (u == null) {
            throw new UsernameNotFoundException("User not found: " + principal.getName());
        }
        
        // Create a response map with the needed information
        Map<String, Object> response = new HashMap<>();
        response.put("id", u.getId());
        response.put("username", u.getUsername());
        response.put("email", u.getEmail());
        response.put("familyId", u.getFamily().getId());
        
        // Determine the single role (we use the first one if multiple exist)
        Role primaryRole = u.getRoles().isEmpty() ? Role.ROLE_USER : u.getRoles().get(0);
        response.put("role", primaryRole.name());
        
        return response;
    }
}
