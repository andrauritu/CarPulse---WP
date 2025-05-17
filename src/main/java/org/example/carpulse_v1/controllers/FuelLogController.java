package org.example.carpulse_v1.controllers;


//import lombok.RequiredArgsConstructor;
import org.example.carpulse_v1.domain.FuelLog;
import org.example.carpulse_v1.services.FuelLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class FuelLogController {

    private final FuelLogService fuelLogService;

    public FuelLogController(FuelLogService fuelLogService) {
        this.fuelLogService = fuelLogService;
    }
    @GetMapping("/admin/cars/{carId}/fuel-logs")
    public List<FuelLog> list(@PathVariable Long carId) {
        return fuelLogService.findAllByCar(carId);
    }

    @PostMapping("/admin/cars/{carId}/fuel-logs")
    public FuelLog create(@PathVariable Long carId,
                          @RequestBody FuelLog log) {
        return fuelLogService.create(carId, log);
    }

    @PutMapping("/admin/fuel-logs/{id}")
    public FuelLog update(@PathVariable Long id,
                          @RequestBody FuelLog log) {
        return fuelLogService.update(id, log);
    }

    @DeleteMapping("/admin/fuel-logs/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        fuelLogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}