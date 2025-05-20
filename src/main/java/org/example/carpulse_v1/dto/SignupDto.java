package org.example.carpulse_v1.dto;

import org.example.carpulse_v1.domain.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class SignupDto {
    private Long familyId;
    private String username;
    private String email;
    private String password;
    private String role; // This will store the role as a string from frontend

    // getters / setters
    public Long getFamilyId() { return familyId; }
    public void setFamilyId(Long familyId) { this.familyId = familyId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    @JsonIgnore
    public Role getRoleEnum() { 
        // Convert string role to enum when needed
        if (role != null) {
            try {
                return Role.valueOf(role);
            } catch (IllegalArgumentException e) {
                // Default to USER if invalid
                return Role.ROLE_USER;
            }
        }
        return null;
    }
}