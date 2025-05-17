package org.example.carpulse_v1.controllers;

import org.example.carpulse_v1.domain.Car;
import org.example.carpulse_v1.services.CarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/admin")
public class CarController {
    private static final Logger logger = LoggerFactory.getLogger(CarController.class);

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping("/cars")
    public ResponseEntity<List<Car>> listCarsByFamilyParam(@RequestParam Long familyId) {
        try {
            logger.info("Fetching cars by family ID (param): {}", familyId);
            List<Car> cars = carService.findAllByFamily(familyId);
            logger.info("Found {} cars for family ID: {}", cars.size(), familyId);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            logger.error("Error fetching cars by family ID (param): {}", familyId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching cars: " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/families/{familyId}/cars")
    public ResponseEntity<List<Car>> listCars(@PathVariable Long familyId) {
        try {
            logger.info("Fetching cars by family ID (path): {}", familyId);
            List<Car> cars = carService.findAllByFamily(familyId);
            logger.info("Found {} cars for family ID: {}", cars.size(), familyId);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            logger.error("Error fetching cars by family ID (path): {}", familyId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching cars: " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/users/{userId}/cars") 
    public ResponseEntity<List<Car>> listUserCars(@PathVariable Long userId) {
        try {
            logger.info("Fetching cars by user ID: {}", userId);
            List<Car> cars = carService.findAllByUser(userId);
            logger.info("Found {} cars for user ID: {}", cars.size(), userId);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            logger.error("Error fetching cars by user ID: {}", userId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching user cars: " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/families/{familyId}/unassigned-cars")
    public ResponseEntity<List<Car>> listUnassignedCars(@PathVariable Long familyId) {
        try {
            logger.info("Fetching unassigned cars for family ID: {}", familyId);
            List<Car> cars = carService.findUnassignedCarsByFamily(familyId);
            logger.info("Found {} unassigned cars for family ID: {}", cars.size(), familyId);
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            logger.error("Error fetching unassigned cars for family ID: {}", familyId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching unassigned cars: " + e.getMessage(), e);
        }
    }

    @GetMapping("/cars/{id}")
    public ResponseEntity<Car> getCar(@PathVariable Long id) {
        try {
            logger.info("Fetching car by ID: {}", id);
            Car car = carService.findById(id);
            logger.info("Found car: {} {}", car.getBrand(), car.getModel());
            return ResponseEntity.ok(car);
        } catch (Exception e) {
            logger.error("Error fetching car by ID: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching car: " + e.getMessage(), e);
        }
    }

    @PostMapping("/cars")
    public ResponseEntity<Car> createCar(@RequestParam Long familyId, @RequestBody Car car) {
        try {
            logger.info("Creating car for family ID: {}, Car: {} {}", familyId, car.getBrand(), car.getModel());
            Car created = carService.create(familyId, car);
            logger.info("Created car with ID: {}", created.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            logger.error("Error creating car for family ID: {}", familyId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error creating car: " + e.getMessage(), e);
        }
    }
    
    @PostMapping("/cars/{carId}/assign")
    public ResponseEntity<Car> assignCar(@PathVariable Long carId, @RequestParam Long userId) {
        try {
            logger.info("Assigning car ID: {} to user ID: {}", carId, userId);
            Car updated = carService.assignToUser(carId, userId);
            logger.info("Car assigned successfully");
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error assigning car ID: {} to user ID: {}", carId, userId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error assigning car: " + e.getMessage(), e);
        }
    }
    
    @PostMapping("/cars/{carId}/unassign")
    public ResponseEntity<Car> unassignCar(@PathVariable Long carId) {
        try {
            logger.info("Unassigning car ID: {}", carId);
            Car updated = carService.unassignFromUser(carId);
            logger.info("Car unassigned successfully");
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error unassigning car ID: {}", carId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error unassigning car: " + e.getMessage(), e);
        }
    }

    @PutMapping("/cars/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car car) {
        try {
            logger.info("Updating car ID: {}", id);
            Car updated = carService.update(id, car);
            logger.info("Car updated successfully");
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating car ID: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating car: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/cars/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        try {
            logger.info("Deleting car ID: {}", id);
            carService.delete(id);
            logger.info("Car deleted successfully");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting car ID: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting car: " + e.getMessage(), e);
        }
    }

    // stub for image upload if you add it later
    // @PostMapping("/{id}/image")
    // public ResponseEntity<?> uploadImage(@PathVariable Long id, @RequestParam MultipartFile file) { … }
}