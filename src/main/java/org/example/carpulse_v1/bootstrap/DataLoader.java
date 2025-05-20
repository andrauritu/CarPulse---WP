package org.example.carpulse_v1.bootstrap;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.example.carpulse_v1.domain.*;
import org.example.carpulse_v1.repositories.*;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final FamilyRepository familyRepo;
    private final UserRepository userRepo;
    private final CarRepository carRepo;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(FamilyRepository familyRepo,
                      UserRepository userRepo,
                      CarRepository carRepo,
                      PasswordEncoder passwordEncoder) {
        this.familyRepo      = familyRepo;
        this.userRepo        = userRepo;
        this.carRepo         = carRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1) Create a Family
        Family smiths = new Family();
        smiths.setFamilyName("The Smiths");
        smiths = familyRepo.save(smiths);

        // 2) Seed an ADMIN user
        User dad = new User();
        dad.setUsername("dad");
        dad.setEmail("dad@example.com");
        dad.setPassword(passwordEncoder.encode("123"));
        dad.setRoles(List.of(Role.ROLE_ADMIN));
        dad.setFamily(smiths);
        dad = userRepo.save(dad);

        // 3) Seed a regular USER
        User kid = new User();
        kid.setUsername("kid");
        kid.setEmail("kid@example.com");
        kid.setPassword(passwordEncoder.encode("123"));
        kid.setRoles(List.of(Role.ROLE_USER));
        kid.setFamily(smiths);
        kid = userRepo.save(kid);

        // 4) Seed sample Cars
        Car car1 = new Car();
        car1.setFamily(smiths);
        car1.setLicensePlate("ABC-123");
        car1.setBrand("Volkswagen");
        car1.setModel("Golf");
        car1.setYear(2020);
        car1.setMileage(30000);
        car1.setImageUrl("/assets/car1_vols.png");
        car1.setAssignedUser(dad);
        carRepo.save(car1);
        
        Car car2 = new Car();
        car2.setFamily(smiths);
        car2.setLicensePlate("XYZ-789");
        car2.setBrand("Honda");
        car2.setModel("Civic");
        car2.setYear(2018);
        car2.setMileage(45000);
        car2.setImageUrl("/assets/car2_honda.png");
        car2.setAssignedUser(kid);
        carRepo.save(car2);
        
        Car car3 = new Car();
        car3.setFamily(smiths);
        car3.setLicensePlate("DEF-456");
        car3.setBrand("Toyota");
        car3.setModel("Corolla");
        car3.setYear(2019);
        car3.setMileage(25000);
        car3.setImageUrl("/assets/car1_vols.png");
        carRepo.save(car3);
    }
}
