package org.example.carpulse_v1.services;


import lombok.RequiredArgsConstructor;
import org.example.carpulse_v1.domain.Car;
import org.example.carpulse_v1.domain.ComplianceRecord;
import org.example.carpulse_v1.exception.ResourceNotFoundException;
import org.example.carpulse_v1.repositories.CarRepository;
import org.example.carpulse_v1.repositories.ComplianceRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service

@Transactional
public class ComplianceService {
    private final ComplianceRecordRepository repo;
    private final CarRepository carRepository;

    public ComplianceService(ComplianceRecordRepository repo, CarRepository carRepository) {
        this.repo = repo;
        this.carRepository = carRepository;
    }
    public List<ComplianceRecord> findAllByCar(Long carId) {
        carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + carId));
        return repo.findByCarId(carId);
    }

    public ComplianceRecord findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ComplianceRecord not found: " + id));
    }

    public ComplianceRecord create(Long carId, ComplianceRecord rec) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + carId));
        rec.setCar(car);
        return repo.save(rec);
    }

    public ComplianceRecord update(Long id, ComplianceRecord detail) {
        ComplianceRecord rec = findById(id);
        rec.setType(detail.getType());
        rec.setExpiryDate(detail.getExpiryDate());
        rec.setReminderDate(detail.getReminderDate());
        rec.setNotes(detail.getNotes());
        return repo.save(rec);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("ComplianceRecord not found: " + id);
        }
        repo.deleteById(id);
    }
}