package org.example.carpulse_v1.repositories;

import org.example.carpulse_v1.domain.ComplianceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplianceRecordRepository extends JpaRepository<ComplianceRecord, Long> {
    List<ComplianceRecord> findByCarId(Long carId);
}