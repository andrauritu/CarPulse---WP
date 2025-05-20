package org.example.carpulse_v1.controllers;


//import lombok.RequiredArgsConstructor;
import org.example.carpulse_v1.services.UserService;
import org.example.carpulse_v1.domain.Role;
import org.springframework.http.ResponseEntity;
import org.example.carpulse_v1.domain.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class UserController {

    private final UserService userService;

    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> listByQueryParam(@RequestParam Long familyId) {
        return userService.listByFamily(familyId);
    }
    
    @GetMapping("/families/{familyId}/users")
    public List<User> listByFamily(@PathVariable Long familyId) {
        return userService.listByFamily(familyId);
    }

    @PostMapping("/users")
    public User invite(@RequestParam Long familyId,
                       @RequestBody User newUser) {
        return userService.createUser(familyId, newUser);
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, 
                                           @RequestBody User userUpdates, 
                                           @AuthenticationPrincipal User currentUser) {
        // Only admins can update user profiles
        if (!currentUser.getRoles().contains(Role.ROLE_ADMIN)) {
            return ResponseEntity.status(403).build();
        }
        
        // Validate that the current user is updating their own profile or a user in their family
        if (!id.equals(currentUser.getId()) && 
            !currentUser.getFamily().getId().equals(userService.findById(id).getFamily().getId())) {
            return ResponseEntity.status(403).build();
        }
        
        User updatedUser = userService.updateUser(id, userUpdates);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, 
                                       @AuthenticationPrincipal User currentUser) {
        // Only admins can delete users
        if (!currentUser.getRoles().contains(Role.ROLE_ADMIN)) {
            return ResponseEntity.status(403).build();
        }
        
        // Validate that the user is in the admin's family
        User userToDelete = userService.findById(id);
        if (!currentUser.getFamily().getId().equals(userToDelete.getFamily().getId())) {
            return ResponseEntity.status(403).build();
        }
        
        // Don't allow admins to delete themselves
        if (id.equals(currentUser.getId())) {
            return ResponseEntity.badRequest().build();
        }
        
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}