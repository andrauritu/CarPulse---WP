package org.example.carpulse_v1.repositories;

import org.example.carpulse_v1.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findByFamilyId(Long familyId);
    Optional<User> findByEmail(String email);
}