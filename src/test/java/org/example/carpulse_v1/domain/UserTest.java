package org.example.carpulse_v1.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    private User user;
    private Family family;
    
    @BeforeEach
    void setUp() {
        family = new Family();
        family.setId(1L);
        family.setFamilyName("Test Family");
        
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setFamily(family);
    }
    
    @Test
    void userPropertiesShouldBeSetCorrectly() {
        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("password", user.getPassword());
        assertEquals(family, user.getFamily());
    }
    
    @Test
    void userRolesShouldBeManageableCorrectly() {
        // By default, no roles are set
        assertTrue(user.getRoles() == null || user.getRoles().isEmpty());
        
        // Add roles
        List<Role> roles = new ArrayList<>();
        roles.add(Role.ROLE_USER);
        user.setRoles(roles);
        
        assertEquals(1, user.getRoles().size());
        assertTrue(user.getRoles().contains(Role.ROLE_USER));
        
        // Add admin role
        roles.add(Role.ROLE_ADMIN);
        user.setRoles(roles);
        
        assertEquals(2, user.getRoles().size());
        assertTrue(user.getRoles().contains(Role.ROLE_ADMIN));
    }
    
    @Test
    void userAuthoritiesShouldContainRoles() {
        // Add roles
        List<Role> roles = new ArrayList<>();
        roles.add(Role.ROLE_USER);
        roles.add(Role.ROLE_ADMIN);
        user.setRoles(roles);
        
        // Check if authorities contain the roles
        assertEquals(2, user.getAuthorities().size());
        
        // Verify user is enabled
        assertTrue(user.isEnabled());
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
    }
    
    @Test
    void userIdDeterminesEquality() {
        // Create another user with the same ID but different fields
        User sameIdUser = new User();
        sameIdUser.setId(1L);
        sameIdUser.setUsername("different");
        
        // Create user with different ID
        User differentIdUser = new User();
        differentIdUser.setId(2L);
        
        // Reflexive: An object must equal itself
        assertEquals(user.getId(), user.getId());
        
        // Objects with same ID should have same hashCode
        assertEquals(user.getId().hashCode(), sameIdUser.getId().hashCode());
        
        // Objects with different IDs should have different hashCodes
        assertNotEquals(user.getId().hashCode(), differentIdUser.getId().hashCode());
    }
} 