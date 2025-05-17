package org.example.carpulse_v1.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public Family getFamily() {
        return family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;      // your “login name”

    @Column(nullable = false)
    private String password;

    @Getter
    @Column(nullable = false, unique = true)
    private String email;

    // EAGER so authorities are available at login time
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "role")
    private List<Role> roles = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "family_id")
    @JsonIgnore    // never serialize this field
    private Family family;
    // --- UserDetails methods ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // map each Role enum to a SimpleGrantedAuthority
        return roles.stream()
                .map(r -> (GrantedAuthority) r::name)
                .toList();
    }

    @Override public String getUsername()            { return username; }
    @Override public String getPassword()            { return password; }
    @Override public boolean isAccountNonExpired()   { return true; }
    @Override public boolean isAccountNonLocked()    { return true; }
    @Override public boolean isCredentialsNonExpired(){ return true; }
    @Override public boolean isEnabled()             { return true; }
}