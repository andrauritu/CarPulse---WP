package org.example.carpulse_v1.services;


import lombok.RequiredArgsConstructor;
import org.example.carpulse_v1.domain.Car;
import org.example.carpulse_v1.domain.FuelLog;
import org.example.carpulse_v1.exception.ResourceNotFoundException;
import org.example.carpulse_v1.repositories.CarRepository;
import org.example.carpulse_v1.repositories.FuelLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import java.util.List;

@Service
@Transactional
public class FuelLogService {
    private final FuelLogRepository repo;
    private final CarRepository carRepository;

    public FuelLogService(FuelLogRepository repo, CarRepository carRepository) {
        this.repo = repo;
        this.carRepository = carRepository;
    }

    public List<FuelLog> findAllByCar(Long carId) {
        carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + carId));
        return repo.findByCarId(carId);
    }

    public FuelLog findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FuelLog not found: " + id));
    }

    public FuelLog create(Long carId, FuelLog log) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + carId));
        log.setCar(car);
        return repo.save(log);
    }

    public FuelLog update(Long id, FuelLog detail) {
        FuelLog log = findById(id);
        log.setDate(detail.getDate());
        log.setLitersFilled(detail.getLitersFilled());
        log.setPricePerLiter(detail.getPricePerLiter());
        log.setOdometer(detail.getOdometer());
        log.setTotalCost(detail.getTotalCost());
        return repo.save(log);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("FuelLog not found: " + id);
        }
        repo.deleteById(id);
    }
}