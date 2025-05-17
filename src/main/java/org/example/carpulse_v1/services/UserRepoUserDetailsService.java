package org.example.carpulse_v1.services;


import org.example.carpulse_v1.domain.User;
import org.example.carpulse_v1.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserRepoUserDetailsService implements UserDetailsService {
    private final UserRepository users;

    public UserRepoUserDetailsService(UserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        User u = users.findByUsername(username);
        if (u != null) {
            return u;   // our User implements UserDetails
        }
        throw new UsernameNotFoundException("User " + username + " not found");
    }
}