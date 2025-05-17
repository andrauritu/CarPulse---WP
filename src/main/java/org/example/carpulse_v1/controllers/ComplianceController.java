package org.example.carpulse_v1.controllers;


import org.example.carpulse_v1.domain.ComplianceRecord;
import org.example.carpulse_v1.services.ComplianceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ComplianceController {

    private final ComplianceService complianceService;

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }
    @GetMapping("/admin/cars/{carId}/compliance")
    public List<ComplianceRecord> list(@PathVariable Long carId) {
        return complianceService.findAllByCar(carId);
    }

    @PostMapping("/admin/cars/{carId}/compliance")
    public ComplianceRecord create(@PathVariable Long carId,
                                   @RequestBody ComplianceRecord rec) {
        return complianceService.create(carId, rec);
    }

    @PutMapping("/admin/compliance/{id}")
    public ComplianceRecord update(@PathVariable Long id,
                                   @RequestBody ComplianceRecord rec) {
        return complianceService.update(id, rec);
    }

    @DeleteMapping("/admin/compliance/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        complianceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}