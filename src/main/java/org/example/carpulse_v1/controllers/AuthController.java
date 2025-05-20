package org.example.carpulse_v1.controllers;

import jakarta.persistence.EntityNotFoundException;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;

import org.example.carpulse_v1.domain.Family;
import org.example.carpulse_v1.domain.Role;
import org.example.carpulse_v1.domain.User;
import org.example.carpulse_v1.dto.SignupDto;
import org.example.carpulse_v1.repositories.FamilyRepository;
import org.example.carpulse_v1.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final FamilyRepository familyRepo;
    private final PasswordEncoder encoder;

    public AuthController(UserService userService,
                          FamilyRepository familyRepo,
                          PasswordEncoder encoder) {
        this.userService = userService;
        this.familyRepo = familyRepo;
        this.encoder = encoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody SignupDto dto) {
        try {
            logger.info("Received signup request for username: {}, email: {}, role: {}, familyId: {}", 
                         dto.getUsername(), dto.getEmail(), dto.getRole(), dto.getFamilyId());
            
            // First, check if username or email already exists
            if (userService.existsByUsername(dto.getUsername())) {
                logger.error("Username already exists: {}", dto.getUsername());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .header("X-Error-Message", "Username already exists")
                    .build();
            }
            
            if (userService.existsByEmail(dto.getEmail())) {
                logger.error("Email already exists: {}", dto.getEmail());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .header("X-Error-Message", "Email already exists")
                    .build();
            }
            
            Role role = dto.getRoleEnum();
            if (role == null) {
                logger.error("Invalid role format: {}", dto.getRole());
                return ResponseEntity.badRequest().build();
            }
            
            Family family;
            
            // If familyId is provided, try to use that family
            if (dto.getFamilyId() != null) {
                logger.debug("Looking up family with ID: {}", dto.getFamilyId());
                var optionalFamily = familyRepo.findById(dto.getFamilyId());
                
                if (optionalFamily.isPresent()) {
                    // Family exists, use it
                    family = optionalFamily.get();
                    logger.debug("Found family: {}", family.getFamilyName());
                } else {
                    // Family doesn't exist
                    if (role == Role.ROLE_ADMIN) {
                        // For admin, create a new family
                        logger.debug("Family not found, but creating new family for admin user: {}", dto.getUsername());
                        family = new Family();
                        family.setFamilyName(dto.getUsername() + "'s Family");
                        family = familyRepo.save(family);
                        logger.debug("Created new family with ID: {}", family.getId());
                    } else {
                        // For regular user, return error
                        logger.error("Family not found with ID: {}", dto.getFamilyId());
                        return ResponseEntity.badRequest()
                            .header("X-Error-Message", "Family not found with ID: " + dto.getFamilyId())
                            .build();
                    }
                }
            }
            // If no familyId is provided
            else if (role == Role.ROLE_ADMIN) {
                // If role is ADMIN and no familyId, create a new family
                logger.debug("Creating new family for admin user: {}", dto.getUsername());
                family = new Family();
                family.setFamilyName(dto.getUsername() + "'s Family");
                family = familyRepo.save(family);
                logger.debug("Created new family with ID: {}", family.getId());
            } 
            // If role is USER and no familyId, return error
            else {
                logger.error("Missing familyId for USER role signup");
                return ResponseEntity.badRequest()
                    .header("X-Error-Message", "Family ID is required for regular users")
                    .build();
            }

            User user = new User();
            user.setUsername(dto.getUsername());
            user.setEmail(dto.getEmail());
            user.setPassword(encoder.encode(dto.getPassword()));
            user.setRoles(Collections.singletonList(role));
            user.setFamily(family);

            logger.debug("Saving new user");
            User saved = userService.save(user);
            logger.info("User created successfully with ID: {}", saved.getId());
            
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation during signup", e);
            String message = e.getMostSpecificCause().getMessage();
            
            if (message.contains("email")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .header("X-Error-Message", "Email already exists")
                    .build();
            } else if (message.contains("username")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .header("X-Error-Message", "Username already exists")
                    .build();
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error during signup: " + e.getMessage(), e);
            }
        } catch (Exception e) {
            logger.error("Error in signup process", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error during signup: " + e.getMessage(), e);
        }
    }
}