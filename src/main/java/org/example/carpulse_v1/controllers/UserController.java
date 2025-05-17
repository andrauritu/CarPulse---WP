package org.example.carpulse_v1.controllers;


//import lombok.RequiredArgsConstructor;
import org.example.carpulse_v1.services.UserService;
import org.springframework.http.ResponseEntity;
import org.example.carpulse_v1.domain.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")

public class UserController {

    private final UserService userService;

    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> list(@RequestParam Long familyId) {
        return userService.listByFamily(familyId);
    }

    @PostMapping
    public User invite(@RequestParam Long familyId,
                       @RequestBody User newUser) {
        return userService.createUser(familyId, newUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}