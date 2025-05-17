package org.example.carpulse_v1.controllers;

        import jakarta.persistence.EntityNotFoundException;
        import java.util.Collections;

        import org.example.carpulse_v1.domain.Family;
        import org.example.carpulse_v1.domain.Role;
        import org.example.carpulse_v1.domain.User;
        import org.example.carpulse_v1.dto.SignupDto;
        import org.example.carpulse_v1.repositories.FamilyRepository;
        import org.example.carpulse_v1.services.UserService;
        import org.springframework.http.ResponseEntity;
        import org.springframework.security.crypto.password.PasswordEncoder;
        import org.springframework.web.bind.annotation.CrossOrigin;
        import org.springframework.web.bind.annotation.PostMapping;
        import org.springframework.web.bind.annotation.RequestBody;
        import org.springframework.web.bind.annotation.RestController;

        @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

        @RestController
        public class AuthController {

            private final UserService userService;
            private final FamilyRepository familyRepo;
            private final PasswordEncoder encoder;

            public AuthController(UserService userService,
                                  FamilyRepository familyRepo,
                                  PasswordEncoder encoder) {
                this.userService = userService;
                this.familyRepo   = familyRepo;
                this.encoder      = encoder;
            }

            @PostMapping("/signup")
            public ResponseEntity<User> signup(@RequestBody SignupDto dto) {
                // familyId is mandatory for all users:
                if (dto.getFamilyId() == null) {
                    return ResponseEntity.badRequest().build();
                }

                Family family = familyRepo.findById(dto.getFamilyId())
                        .orElseThrow(() -> new EntityNotFoundException("Family not found"));

                User user = new User();
                user.setUsername(dto.getUsername());
                user.setEmail(dto.getEmail());
                user.setPassword(encoder.encode(dto.getPassword()));
                user.setRoles(Collections.singletonList(
                        dto.getRole() == Role.ROLE_ADMIN ? Role.ROLE_ADMIN : Role.ROLE_USER
                ));
                user.setFamily(family);

                User saved = userService.save(user);
                return ResponseEntity.ok(saved);
            }
        }