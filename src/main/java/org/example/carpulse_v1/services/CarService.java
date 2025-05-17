package org.example.carpulse_v1.services;

        import lombok.RequiredArgsConstructor;
        import org.example.carpulse_v1.domain.Car;
        import org.example.carpulse_v1.domain.Family;
        import org.example.carpulse_v1.exception.ResourceNotFoundException;
        import org.example.carpulse_v1.repositories.CarRepository;
        import org.example.carpulse_v1.repositories.FamilyRepository;
        import org.springframework.stereotype.Service;
        import org.springframework.transaction.annotation.Transactional;

        import java.util.List;

        @Service
        @Transactional
        public class CarService {
            private final CarRepository carRepository;
            private final FamilyRepository familyRepository;

            public CarService(CarRepository carRepository, FamilyRepository familyRepository) {
                this.carRepository = carRepository;
                this.familyRepository = familyRepository;
            }

            public List<Car> findAllByFamily(Long familyId) {
                familyRepository.findById(familyId)
                        .orElseThrow(() -> new ResourceNotFoundException("Family not found: " + familyId));
                return carRepository.findByFamilyId(familyId);
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

            public Car update(Long id, Car details) {
                Car car = findById(id);
                car.setLicensePlate(details.getLicensePlate());
                car.setBrand(details.getBrand());
                car.setModel(details.getModel());
                car.setYear(details.getYear());
                car.setMileage(details.getMileage());
                car.setImageUrl(details.getImageUrl());
                return carRepository.save(car);
            }

            public void delete(Long id) {
                if (!carRepository.existsById(id)) {
                    throw new ResourceNotFoundException("Car not found: " + id);
                }
                carRepository.deleteById(id);
            }
        }