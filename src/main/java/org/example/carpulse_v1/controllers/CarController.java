package org.example.carpulse_v1.controllers;

    import org.example.carpulse_v1.domain.Car;
    import org.example.carpulse_v1.services.CarService;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/admin/cars")

    public class CarController {

        private final CarService carService;

        public CarController(CarService carService) {
            this.carService = carService;
        }

        @GetMapping
        public List<Car> listCars(@RequestParam Long familyId) {
            return carService.findAllByFamily(familyId);
        }

        @GetMapping("/{id}")
        public Car getCar(@PathVariable Long id) {
            return carService.findById(id);
        }

        @PostMapping
        public Car createCar(@RequestParam Long familyId,
                             @RequestBody Car car) {
            return carService.create(familyId, car);
        }

        @PutMapping("/{id}")
        public Car updateCar(@PathVariable Long id,
                             @RequestBody Car car) {
            return carService.update(id, car);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
            carService.delete(id);
            return ResponseEntity.noContent().build();
        }

        // stub for image upload if you add it later
        // @PostMapping("/{id}/image")
        // public ResponseEntity<?> uploadImage(@PathVariable Long id, @RequestParam MultipartFile file) { … }
    }