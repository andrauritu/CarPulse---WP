package org.example.carpulse_v1.domain;


import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "cars")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;
    
    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @Column(nullable = false, unique = true)
    private String licensePlate;

    private String brand;
    private String model;
    private Integer year;
    private Integer mileage;
    private String imageUrl;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<MaintenanceRecord> maintenanceRecords;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<FuelLog> fuelLogs;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<ComplianceRecord> complianceRecords;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Family getFamily() {
        return family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }
    
    public User getAssignedUser() {
        return assignedUser;
    }

    public void setAssignedUser(User assignedUser) {
        this.assignedUser = assignedUser;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMileage() {
        return mileage;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<MaintenanceRecord> getMaintenanceRecords() {
        return maintenanceRecords;
    }

    public void setMaintenanceRecords(List<MaintenanceRecord> maintenanceRecords) {
        this.maintenanceRecords = maintenanceRecords;
    }

    public List<FuelLog> getFuelLogs() {
        return fuelLogs;
    }

    public void setFuelLogs(List<FuelLog> fuelLogs) {
        this.fuelLogs = fuelLogs;
    }

    public List<ComplianceRecord> getComplianceRecords() {
        return complianceRecords;
    }

    public void setComplianceRecords(List<ComplianceRecord> complianceRecords) {
        this.complianceRecords = complianceRecords;
    }
}