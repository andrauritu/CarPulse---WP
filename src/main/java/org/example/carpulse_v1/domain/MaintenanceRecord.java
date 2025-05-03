package org.example.carpulse_v1.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public enum Type { ENGINE, TIRES, BRAKES, OIL_CHANGE, OTHER }

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    @JsonIgnore            // ← don’t serialize the back-pointer to Car
    private Car car;

    @Enumerated(EnumType.STRING)
    private Type type;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public LocalDate getDatePerformed() {
        return datePerformed;
    }

    public void setDatePerformed(LocalDate datePerformed) {
        this.datePerformed = datePerformed;
    }

    public LocalDate getNextDueDate() {
        return nextDueDate;
    }

    public void setNextDueDate(LocalDate nextDueDate) {
        this.nextDueDate = nextDueDate;
    }

    public Integer getMileageAtService() {
        return mileageAtService;
    }

    public void setMileageAtService(Integer mileageAtService) {
        this.mileageAtService = mileageAtService;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(BigDecimal estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate datePerformed;
    private LocalDate nextDueDate;
    private Integer mileageAtService;
    private BigDecimal estimatedCost;
}