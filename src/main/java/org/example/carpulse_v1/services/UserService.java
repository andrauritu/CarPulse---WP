package org.example.carpulse_v1.services;

import lombok.RequiredArgsConstructor;
import org.example.carpulse_v1.domain.Family;
import org.example.carpulse_v1.domain.User;

import org.example.carpulse_v1.domain.Role;

import org.example.carpulse_v1.repositories.FamilyRepository;
import org.example.carpulse_v1.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service

@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, FamilyRepository familyRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.familyRepository = familyRepository;
        this.passwordEncoder = passwordEncoder;

    }
    /**
     * List all users in a given family.
     */
    public List<User> listByFamily(Long familyId) {
        // verify family exists
        familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Family not found: " + familyId));
        return userRepository.findByFamilyId(familyId);
    }

    /**
     * Invite / create a new USER in the given family.
     * Sets ROLE_USER, hashes password, and ties to Family.
     */
    public User createUser(Long familyId, User incoming) {
        Family fam = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Family not found: " + familyId));

        incoming.setFamily(fam);
        incoming.setPassword(passwordEncoder.encode(incoming.getPassword()));
        incoming.setRoles(List.of(Role.ROLE_USER));
        return userRepository.save(incoming);
    }

    /**
     * Delete a user by their ID.
     */
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found: " + userId);
        }
        userRepository.deleteById(userId);
    }
}