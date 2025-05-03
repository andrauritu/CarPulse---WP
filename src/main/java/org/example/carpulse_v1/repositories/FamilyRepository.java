package org.example.carpulse_v1.repositories;

import org.example.carpulse_v1.domain.Family;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FamilyRepository extends JpaRepository<Family, Long> {
}