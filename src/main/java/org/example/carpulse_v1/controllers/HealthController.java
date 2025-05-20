package org.example.carpulse_v1.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for health checks and system status.
 * Used for Docker health checks and monitoring.
 */
@RestController
public class HealthController {

    /**
     * Simple health check endpoint that returns 200 OK when the application is up.
     * Can be used by Docker health checks and monitoring tools.
     *
     * @return A simple status response
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "CarPulse Backend");
        
        return ResponseEntity.ok(status);
    }
} 