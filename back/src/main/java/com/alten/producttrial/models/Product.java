package com.alten.producttrial.models;

import com.alten.producttrial.models.enums.InventoryStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;
    private String description;
    private String image;
    private String category;
    private double price;
    private int quantity;
    private String internalReference;
    private long shellId;

    @Enumerated(EnumType.STRING)
    private InventoryStatus inventoryStatus;

    private double rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
