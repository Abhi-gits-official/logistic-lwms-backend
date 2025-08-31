package com.cts.lwms.repo;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cts.lwms.model.Inventory;

@Repository
public interface InventoryRepo extends JpaRepository<Inventory, Integer> {
    
    // Custom query to fetch inventory items with categories
    @Query("SELECT i FROM Inventory i LEFT JOIN FETCH i.category")
    List<Inventory> findAllWithCategories();
    
    // Custom query to fetch a single inventory item with category
    @Query("SELECT i FROM Inventory i LEFT JOIN FETCH i.category WHERE i.itemId = :itemId")
    Optional<Inventory> findByIdWithCategory(Integer itemId);
}
