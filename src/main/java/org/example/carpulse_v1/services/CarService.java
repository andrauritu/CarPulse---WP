package org.example.carpulse_v1.services;

import lombok.RequiredArgsConstructor;
import org.example.carpulse_v1.domain.Car;
import org.example.carpulse_v1.domain.Family;
import org.example.carpulse_v1.domain.User;
import org.example.carpulse_v1.exception.ResourceNotFoundException;
import org.example.carpulse_v1.repositories.CarRepository;
import org.example.carpulse_v1.repositories.FamilyRepository;
import org.example.carpulse_v1.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class CarService {
    private final CarRepository carRepository;
    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;

    public CarService(CarRepository carRepository, FamilyRepository familyRepository, UserRepository userRepository) {
        this.carRepository = carRepository;
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
    }

    public List<Car> findAllByFamily(Long familyId) {
        if (!familyRepository.existsById(familyId)) {
            return Collections.emptyList();
        }
        return carRepository.findByFamilyId(familyId);
    }
    
    public List<Car> findAllByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            return Collections.emptyList();
        }
        return carRepository.findByAssignedUserId(userId);
    }
    
    public List<Car> findUnassignedCarsByFamily(Long familyId) {
        if (!familyRepository.existsById(familyId)) {
            return Collections.emptyList();
        }
        return carRepository.findByFamilyIdAndAssignedUserIdIsNull(familyId);
    }

    public Car findById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found: " + id));
    }

    public Car create(Long familyId, Car car) {
        Family fam = familyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException("Family not found: " + familyId));
        car.setFamily(fam);
        return carRepository.save(car);
    }
    
    public Car assignToUser(Long carId, Long userId) {
        Car car = findById(carId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        
        // Check if user belongs to the same family as the car
        if (!user.getFamily().getId().equals(car.getFamily().getId())) {
            throw new IllegalArgumentException("Cannot assign car to user from a different family");
        }
        
        car.setAssignedUser(user);
        return carRepository.save(car);
    }
    
    public Car unassignFromUser(Long carId) {
        Car car = findById(carId);
        car.setAssignedUser(null);
        return carRepository.save(car);
    }

    public Car update(Long id, Car details) {
        Car car = findById(id);
        car.setLicensePlate(details.getLicensePlate());
        car.setBrand(details.getBrand());
        car.setModel(details.getModel());
        car.setYear(details.getYear());
        car.setMileage(details.getMileage());
        car.setImageUrl(details.getImageUrl());
        
        // Don't update the assignment here as it's handled by assignToUser method
        
        return carRepository.save(car);
    }

    public void delete(Long id) {
        if (!carRepository.existsById(id)) {
            throw new ResourceNotFoundException("Car not found: " + id);
        }
        carRepository.deleteById(id);
    }
}