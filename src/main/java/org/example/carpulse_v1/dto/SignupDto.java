package org.example.carpulse_v1.dto;


import org.example.carpulse_v1.domain.Role;

public class SignupDto {
    private Long familyId;
    private String username;
    private String email;
    private String password;
    private Role role;       // ADMIN or USER

    // getters / setters
    public Long   getFamilyId() { return familyId; }
    public void   setFamilyId(Long familyId) { this.familyId = familyId; }
    public String getUsername() { return username; }
    public void   setUsername(String username) { this.username = username; }
    public String getEmail()    { return email; }
    public void   setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void   setPassword(String password) { this.password = password; }
    public Role   getRole()     { return role; }
    public void   setRole(Role role) { this.role = role; }
}