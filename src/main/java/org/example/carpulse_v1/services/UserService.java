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
     * Check if a user exists with the given username
     */
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    /**
     * Check if a user exists with the given email
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
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
     * Find a user by their ID
     */
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found: " + id));
    }
    
    /**
     * Create a new user in the given family
     */
    public User createUser(Long familyId, User newUser) {
        // Check if family exists
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Family not found: " + familyId));
        
        // Check if username or email already exist
        if (userRepository.existsByUsername(newUser.getUsername())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Username already exists: " + newUser.getUsername());
        }
        
        if (userRepository.existsByEmail(newUser.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Email already exists: " + newUser.getEmail());
        }
        
        // Encode password and set family
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setFamily(family);
        
        return userRepository.save(newUser);
    }
    
    /**
     * Update an existing user
     */
    public User updateUser(Long id, User userUpdates) {
        User existingUser = findById(id);
        
        // Update fields that are allowed to be changed
        if (userUpdates.getUsername() != null && !userUpdates.getUsername().equals(existingUser.getUsername())) {
            // Check if new username is already taken
            if (userRepository.existsByUsername(userUpdates.getUsername())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Username already exists: " + userUpdates.getUsername());
            }
            existingUser.setUsername(userUpdates.getUsername());
        }
        
        if (userUpdates.getEmail() != null && !userUpdates.getEmail().equals(existingUser.getEmail())) {
            // Check if new email is already taken
            if (userRepository.existsByEmail(userUpdates.getEmail())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Email already exists: " + userUpdates.getEmail());
            }
            existingUser.setEmail(userUpdates.getEmail());
        }
        
        // Update password if provided
        if (userUpdates.getPassword() != null && !userUpdates.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userUpdates.getPassword()));
        }
        
        // Update name if provided
        if (userUpdates.getName() != null) {
            existingUser.setName(userUpdates.getName());
        }
        
        return userRepository.save(existingUser);
    }
    
    /**
     * Delete a user
     */
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found: " + id);
        }
        userRepository.deleteById(id);
    }
    
    /**
     * Save a user
     */
    public User save(User user) {
        return userRepository.save(user);
    }
}