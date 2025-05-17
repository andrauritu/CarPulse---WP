package org.example.carpulse_v1.repositories;

import org.example.carpulse_v1.domain.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {
    List<MaintenanceRecord> findByCarId(Long carId);
}