package org.example.carpulse_v1.services;

import org.example.carpulse_v1.domain.Car;
import org.example.carpulse_v1.domain.Family;
import org.example.carpulse_v1.domain.User;
import org.example.carpulse_v1.exception.ResourceNotFoundException;
import org.example.carpulse_v1.repositories.CarRepository;
import org.example.carpulse_v1.repositories.FamilyRepository;
import org.example.carpulse_v1.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CarServiceTest {

    @Mock
    private CarRepository carRepository;

    @Mock
    private FamilyRepository familyRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CarService carService;

    private Car testCar;
    private Family testFamily;
    private User testUser;

    @BeforeEach
    void setUp() {
        testFamily = new Family();
        testFamily.setId(1L);
        testFamily.setFamilyName("Test Family");

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setFamily(testFamily);

        testCar = new Car();
        testCar.setId(1L);
        testCar.setBrand("Toyota");
        testCar.setModel("Corolla");
        testCar.setLicensePlate("ABC123");
        testCar.setMileage(50000);
        testCar.setYear(2020);
        testCar.setEngine("2.0L");
        testCar.setDoors(4);
        testCar.setFuelType("Petrol");
        testCar.setFamily(testFamily);
    }

    @Test
    void findByIdShouldReturnCarWhenExists() {
        // Arrange
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));

        // Act
        Car foundCar = carService.findById(1L);

        // Assert
        assertNotNull(foundCar);
        assertEquals(1L, foundCar.getId());
        assertEquals("Toyota", foundCar.getBrand());
        assertEquals("Corolla", foundCar.getModel());
    }

    @Test
    void findByIdShouldThrowExceptionWhenCarNotFound() {
        // Arrange
        when(carRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> carService.findById(999L));
    }

    @Test
    void createShouldSaveAndReturnCar() {
        // Arrange
        Car carToCreate = new Car();
        carToCreate.setBrand("Honda");
        carToCreate.setModel("Civic");
        carToCreate.setLicensePlate("XYZ789");
        
        when(familyRepository.findById(1L)).thenReturn(Optional.of(testFamily));
        when(carRepository.save(any(Car.class))).thenAnswer(invocation -> {
            Car savedCar = invocation.getArgument(0);
            savedCar.setId(2L);
            return savedCar;
        });

        // Act
        Car createdCar = carService.create(1L, carToCreate);

        // Assert
        assertNotNull(createdCar);
        assertEquals(2L, createdCar.getId());
        assertEquals("Honda", createdCar.getBrand());
        assertEquals("Civic", createdCar.getModel());
        assertEquals(testFamily, createdCar.getFamily());
        verify(carRepository, times(1)).save(any(Car.class));
    }

    @Test
    void createShouldThrowExceptionWhenFamilyNotFound() {
        // Arrange
        when(familyRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> carService.create(999L, new Car()));
        verify(carRepository, never()).save(any(Car.class));
    }

    @Test
    void updateShouldUpdateAndReturnCar() {
        // Arrange
        Car carToUpdate = new Car();
        carToUpdate.setBrand("Updated Brand");
        carToUpdate.setModel("Updated Model");
        carToUpdate.setLicensePlate("UPD123");
        carToUpdate.setMileage(60000);
        carToUpdate.setYear(2021);
        carToUpdate.setEngine("3.0L V6");
        carToUpdate.setDoors(2);
        carToUpdate.setFuelType("Diesel");
        carToUpdate.setImageUrl("updated-image-url");
        
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));
        when(carRepository.save(any(Car.class))).thenReturn(testCar);

        // Act
        Car updatedCar = carService.update(1L, carToUpdate);

        // Assert
        assertNotNull(updatedCar);
        assertEquals("Updated Brand", updatedCar.getBrand());
        assertEquals("Updated Model", updatedCar.getModel());
        assertEquals("UPD123", updatedCar.getLicensePlate());
        assertEquals(60000, updatedCar.getMileage());
        assertEquals(2021, updatedCar.getYear());
        assertEquals("3.0L V6", updatedCar.getEngine());
        assertEquals(2, updatedCar.getDoors());
        assertEquals("Diesel", updatedCar.getFuelType());
        assertEquals("updated-image-url", updatedCar.getImageUrl());
        verify(carRepository, times(1)).save(testCar);
    }

    @Test
    void deleteShouldRemoveCar() {
        // Arrange
        when(carRepository.existsById(1L)).thenReturn(true);
        doNothing().when(carRepository).deleteById(1L);

        // Act
        carService.delete(1L);

        // Assert
        verify(carRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteShouldThrowExceptionWhenCarNotFound() {
        // Arrange
        when(carRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> carService.delete(999L));
        verify(carRepository, never()).deleteById(anyLong());
    }

    @Test
    void findAllByFamilyShouldReturnCarsList() {
        // Arrange
        List<Car> expectedCars = Arrays.asList(testCar);
        when(familyRepository.existsById(1L)).thenReturn(true);
        when(carRepository.findByFamilyId(1L)).thenReturn(expectedCars);

        // Act
        List<Car> actualCars = carService.findAllByFamily(1L);

        // Assert
        assertEquals(expectedCars.size(), actualCars.size());
        assertEquals(expectedCars.get(0).getBrand(), actualCars.get(0).getBrand());
    }

    @Test
    void assignToUserShouldUpdateCarWithUser() {
        // Arrange
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(carRepository.save(any(Car.class))).thenReturn(testCar);

        // Act
        Car updatedCar = carService.assignToUser(1L, 1L);

        // Assert
        assertNotNull(updatedCar);
        assertEquals(testUser, updatedCar.getAssignedUser());
        verify(carRepository, times(1)).save(testCar);
    }

    @Test
    void unassignFromUserShouldRemoveUserFromCar() {
        // Arrange
        testCar.setAssignedUser(testUser);
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));
        when(carRepository.save(any(Car.class))).thenReturn(testCar);

        // Act
        Car updatedCar = carService.unassignFromUser(1L);

        // Assert
        assertNotNull(updatedCar);
        assertNull(updatedCar.getAssignedUser());
        verify(carRepository, times(1)).save(testCar);
    }
} 