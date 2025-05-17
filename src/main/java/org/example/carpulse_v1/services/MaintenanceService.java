package org.example.carpulse_v1.services;


import lombok.RequiredArgsConstructor;
import org.example.carpulse_v1.domain.Car;
import org.example.carpulse_v1.domain.MaintenanceRecord;
import org.example.carpulse_v1.exception.ResourceNotFoundException;
import org.example.carpulse_v1.repositories.CarRepository;
import org.example.carpulse_v1.repositories.MaintenanceRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service

@Transactional
public class MaintenanceService {
    private final MaintenanceRecordRepository repo;
    private final CarRepository carRepository;

    public MaintenanceService(MaintenanceRecordRepository repo, CarRepository carRepository) {
        this.repo = repo;
        this.carRepository = carRepository;
    }

    public List<MaintenanceRecord> findAllByCar(Long carId) {
        carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + carId));
        return repo.findByCarId(carId);
    }

    public MaintenanceRecord findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MaintenanceRecord not found: " + id));
    }

    public MaintenanceRecord create(Long carId, MaintenanceRecord rec) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + carId));
        rec.setCar(car);
        return repo.save(rec);
    }

    public MaintenanceRecord update(Long id, MaintenanceRecord detail) {
        MaintenanceRecord rec = findById(id);
        rec.setType(detail.getType());
        rec.setDescription(detail.getDescription());
        rec.setDatePerformed(detail.getDatePerformed());
        rec.setNextDueDate(detail.getNextDueDate());
        rec.setMileageAtService(detail.getMileageAtService());
        rec.setEstimatedCost(detail.getEstimatedCost());
        return repo.save(rec);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("MaintenanceRecord not found: " + id);
        }
        repo.deleteById(id);
    }
}