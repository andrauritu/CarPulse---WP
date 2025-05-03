package org.example.carpulse_v1.repositories;

import org.example.carpulse_v1.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findByFamilyId(Long familyId);
}