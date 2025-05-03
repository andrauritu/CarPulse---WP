package org.example.carpulse_v1.repositories;

import org.example.carpulse_v1.domain.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {
    List<FuelLog> findByCarId(Long carId);
}