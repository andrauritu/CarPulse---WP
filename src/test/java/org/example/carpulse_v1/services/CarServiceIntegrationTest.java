package org.example.carpulse_v1.services;

import org.example.carpulse_v1.domain.Car;
import org.example.carpulse_v1.domain.Family;
import org.example.carpulse_v1.domain.User;
import org.example.carpulse_v1.repositories.CarRepository;
import org.example.carpulse_v1.repositories.FamilyRepository;
import org.example.carpulse_v1.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test") // Use test profile if you have one
@Transactional // Rollback transactions after each test
public class CarServiceIntegrationTest {

    @Autowired
    private CarService carService;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private FamilyRepository familyRepository;

    @Autowired
    private UserRepository userRepository;

    private Family testFamily;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Create a test family
        testFamily = new Family();
        testFamily.setFamilyName("Test Integration Family");
        testFamily = familyRepository.save(testFamily);

        // Create a test user
        testUser = new User();
        testUser.setUsername("testintegration");
        testUser.setEmail("testintegration@example.com");
        testUser.setPassword("password");
        testUser.setFamily(testFamily);
        testUser = userRepository.save(testUser);
    }

    @Test
    void shouldCreateAndFindCar() {
        // Create a new car
        Car car = new Car();
        car.setBrand("Integration Test Brand");
        car.setModel("Integration Test Model");
        car.setLicensePlate("INT-123");
        car.setMileage(10000);
        car.setYear(2022);
        car.setEngine("1.6L");
        car.setDoors(5);
        car.setFuelType("Gasoline");

        // Save the car using the service
        Car savedCar = carService.create(testFamily.getId(), car);

        // Verify the car was saved with an ID
        assertNotNull(savedCar.getId());
        
        // Retrieve the car by ID
        Car foundCar = carService.findById(savedCar.getId());
        
        // Verify the retrieved car matches what we saved
        assertEquals("Integration Test Brand", foundCar.getBrand());
        assertEquals("Integration Test Model", foundCar.getModel());
        assertEquals("INT-123", foundCar.getLicensePlate());
        assertEquals(testFamily.getId(), foundCar.getFamily().getId());
    }

    @Test
    void shouldFindCarsByFamily() {
        // Create multiple cars
        Car car1 = new Car();
        car1.setBrand("Family Car 1");
        car1.setModel("Model 1");
        car1.setLicensePlate("FAM-001");
        car1.setFamily(testFamily);
        carRepository.save(car1);

        Car car2 = new Car();
        car2.setBrand("Family Car 2");
        car2.setModel("Model 2");
        car2.setLicensePlate("FAM-002");
        car2.setFamily(testFamily);
        carRepository.save(car2);

        // Find all cars for this family
        List<Car> familyCars = carService.findAllByFamily(testFamily.getId());

        // Verify we got both cars
        assertEquals(2, familyCars.size());
        
        // Verify the cars are for the right family
        familyCars.forEach(car -> assertEquals(testFamily.getId(), car.getFamily().getId()));
    }

    @Test
    void shouldAssignAndUnassignCar() {
        // Create a car
        Car car = new Car();
        car.setBrand("Assign Test Car");
        car.setModel("Assign Model");
        car.setLicensePlate("ASG-123");
        car.setFamily(testFamily);
        car = carRepository.save(car);

        // Assign the car to a user
        Car assignedCar = carService.assignToUser(car.getId(), testUser.getId());
        
        // Verify the car is assigned to the user
        assertNotNull(assignedCar.getAssignedUser());
        assertEquals(testUser.getId(), assignedCar.getAssignedUser().getId());

        // Unassign the car
        Car unassignedCar = carService.unassignFromUser(car.getId());
        
        // Verify the car is no longer assigned
        assertNull(unassignedCar.getAssignedUser());
    }

    @Test
    void shouldUpdateCarDetails() {
        // Create a car
        Car car = new Car();
        car.setBrand("Original Brand");
        car.setModel("Original Model");
        car.setLicensePlate("UPD-123");
        car.setFamily(testFamily);
        car = carRepository.save(car);

        // Create updated car details
        Car updatedDetails = new Car();
        updatedDetails.setBrand("Updated Brand");
        updatedDetails.setModel("Updated Model");
        updatedDetails.setLicensePlate("UPD-456");
        updatedDetails.setEngine("2.5L V6");
        updatedDetails.setDoors(2);
        updatedDetails.setFuelType("Diesel");
        updatedDetails.setMileage(25000);
        updatedDetails.setYear(2023);

        // Update the car
        Car updatedCar = carService.update(car.getId(), updatedDetails);
        
        // Verify the update
        assertEquals("Updated Brand", updatedCar.getBrand());
        assertEquals("Updated Model", updatedCar.getModel());
        assertEquals("UPD-456", updatedCar.getLicensePlate());
        assertEquals("2.5L V6", updatedCar.getEngine());
        assertEquals(Integer.valueOf(2), updatedCar.getDoors());
        assertEquals("Diesel", updatedCar.getFuelType());
        assertEquals(Integer.valueOf(25000), updatedCar.getMileage());
        assertEquals(Integer.valueOf(2023), updatedCar.getYear());
    }

    @Test
    void shouldDeleteCar() {
        // Create a car
        Car car = new Car();
        car.setBrand("Delete Test");
        car.setModel("Delete Model");
        car.setLicensePlate("DEL-123");
        car.setFamily(testFamily);
        car = carRepository.save(car);
        
        Long carId = car.getId();
        
        // Delete the car
        carService.delete(carId);
        
        // Verify the car no longer exists
        assertTrue(carRepository.findById(carId).isEmpty());
    }
} 