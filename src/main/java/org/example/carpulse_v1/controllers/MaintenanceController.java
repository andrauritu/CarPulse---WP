package org.example.carpulse_v1.controllers;


//import lombok.RequiredArgsConstructor;
import org.example.carpulse_v1.domain.MaintenanceRecord;
import org.example.carpulse_v1.services.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(final MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/admin/cars/{carId}/maintenance")
    public List<MaintenanceRecord> list(@PathVariable Long carId) {
        return maintenanceService.findAllByCar(carId);
    }

    @PostMapping("/admin/cars/{carId}/maintenance")
    public MaintenanceRecord create(@PathVariable Long carId,
                                    @RequestBody MaintenanceRecord rec) {
        return maintenanceService.create(carId, rec);
    }

    @PutMapping("/admin/maintenance/{id}")
    public MaintenanceRecord update(@PathVariable Long id,
                                    @RequestBody MaintenanceRecord rec) {
        return maintenanceService.update(id, rec);
    }

    @DeleteMapping("/admin/maintenance/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        maintenanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}