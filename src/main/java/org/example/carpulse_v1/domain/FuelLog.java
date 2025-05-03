package org.example.carpulse_v1.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fuel_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuelLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getLitersFilled() {
        return litersFilled;
    }

    public void setLitersFilled(BigDecimal litersFilled) {
        this.litersFilled = litersFilled;
    }

    public BigDecimal getPricePerLiter() {
        return pricePerLiter;
    }

    public void setPricePerLiter(BigDecimal pricePerLiter) {
        this.pricePerLiter = pricePerLiter;
    }

    public Integer getOdometer() {
        return odometer;
    }

    public void setOdometer(Integer odometer) {
        this.odometer = odometer;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    @JsonIgnore            // ← don’t serialize the back-pointer to Car
    private Car car;

    private LocalDate date;
    private BigDecimal litersFilled;
    private BigDecimal pricePerLiter;
    private Integer odometer;
    private BigDecimal totalCost;
}