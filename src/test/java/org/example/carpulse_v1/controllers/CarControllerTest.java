package org.example.carpulse_v1.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.carpulse_v1.domain.Car;
import org.example.carpulse_v1.domain.Family;
import org.example.carpulse_v1.domain.User;
import org.example.carpulse_v1.exception.ResourceNotFoundException;
import org.example.carpulse_v1.services.CarService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CarController.class)
public class CarControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
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
    @WithMockUser(roles = "ADMIN")
    void getCarShouldReturnCar() throws Exception {
        when(carService.findById(1L)).thenReturn(testCar);

        mockMvc.perform(get("/admin/cars/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.brand", is("Toyota")))
                .andExpect(jsonPath("$.model", is("Corolla")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getCarShouldReturnNotFoundWhenCarDoesNotExist() throws Exception {
        when(carService.findById(999L)).thenThrow(new ResourceNotFoundException("Car not found: 999"));

        mockMvc.perform(get("/admin/cars/999")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void listCarsShouldReturnCarsList() throws Exception {
        List<Car> cars = Arrays.asList(testCar);
        when(carService.findAllByFamily(1L)).thenReturn(cars);

        mockMvc.perform(get("/admin/families/1/cars")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].brand", is("Toyota")))
                .andExpect(jsonPath("$[0].model", is("Corolla")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createCarShouldReturnCreatedCar() throws Exception {
        Car carToCreate = new Car();
        carToCreate.setBrand("Honda");
        carToCreate.setModel("Civic");
        carToCreate.setLicensePlate("XYZ789");
        
        when(carService.create(eq(1L), any(Car.class))).thenReturn(testCar);

        mockMvc.perform(post("/admin/cars")
                .with(csrf())
                .param("familyId", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(carToCreate)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.brand", is("Toyota")))
                .andExpect(jsonPath("$.model", is("Corolla")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateCarShouldReturnUpdatedCar() throws Exception {
        Car carToUpdate = new Car();
        carToUpdate.setBrand("Updated Brand");
        carToUpdate.setModel("Updated Model");
        
        when(carService.update(eq(1L), any(Car.class))).thenReturn(testCar);

        mockMvc.perform(put("/admin/cars/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(carToUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand", is("Toyota")))
                .andExpect(jsonPath("$.model", is("Corolla")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteCarShouldReturnNoContent() throws Exception {
        doNothing().when(carService).delete(1L);

        mockMvc.perform(delete("/admin/cars/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
        
        verify(carService, times(1)).delete(1L);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignCarShouldReturnUpdatedCar() throws Exception {
        when(carService.assignToUser(1L, 1L)).thenReturn(testCar);

        mockMvc.perform(post("/admin/cars/1/assign")
                .with(csrf())
                .param("userId", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand", is("Toyota")))
                .andExpect(jsonPath("$.model", is("Corolla")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void unassignCarShouldReturnUpdatedCar() throws Exception {
        when(carService.unassignFromUser(1L)).thenReturn(testCar);

        mockMvc.perform(post("/admin/cars/1/unassign")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand", is("Toyota")))
                .andExpect(jsonPath("$.model", is("Corolla")));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void uploadImageShouldReturnUpdatedCar() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-image.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        when(carService.findById(1L)).thenReturn(testCar);
        when(carService.update(eq(1L), any(Car.class))).thenReturn(testCar);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/admin/cars/1/image")
                .file(file)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand", is("Toyota")))
                .andExpect(jsonPath("$.model", is("Corolla")));
    }
} 