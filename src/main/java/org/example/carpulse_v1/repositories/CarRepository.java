package org.example.carpulse_v1.repositories;

import org.example.carpulse_v1.domain.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByFamilyId(Long familyId);
    List<Car> findByAssignedUserId(Long userId);
    List<Car> findByFamilyIdAndAssignedUserIdIsNull(Long familyId);
}