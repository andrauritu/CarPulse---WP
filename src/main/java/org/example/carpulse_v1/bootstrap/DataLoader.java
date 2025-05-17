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
        dad.setUsername("dad@example.com");
        dad.setEmail("dad@example.com");
        dad.setPassword(passwordEncoder.encode("dad123"));
        dad.setRoles(List.of(Role.ROLE_ADMIN));
        dad.setFamily(smiths);
        userRepo.save(dad);

        // 3) Seed a regular USER
        User kid = new User();
        kid.setUsername("kid@example.com");
        kid.setEmail("kid@example.com");
        kid.setPassword(passwordEncoder.encode("password"));
        kid.setRoles(List.of(Role.ROLE_USER));
        kid.setFamily(smiths);
        userRepo.save(kid);

        // 4) Seed a sample Car
        Car c = new Car();
        c.setFamily(smiths);
        c.setLicensePlate("ABC-123");
        c.setBrand("Toyota");
        c.setModel("Corolla");
        c.setYear(2015);
        c.setMileage(50000);
        c.setImageUrl("https://example.com/corolla.jpg");
        carRepo.save(c);
    }
}
