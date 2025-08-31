package com.cts.lwms.service;

import com.cts.lwms.model.Inventory;
import com.cts.lwms.repo.InventoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    @Autowired
    private InventoryRepo inventoryRepo;
    
    @Autowired
    private SpaceService spaceService;

    public Inventory addItem(Inventory item) {
        System.out.println("Adding inventory item: " + item);
        item.setLastUpdated(new java.util.Date());
        Inventory saved = inventoryRepo.save(item);
        System.out.println("Saved inventory item with ID: " + saved.getItemId());
        
        // Update space utilization
        spaceService.updateSpaceUtilization();
        
        return saved;
    }

    public Inventory updateItem(Inventory item) {
        Optional<Inventory> existing = inventoryRepo.findById(item.getItemId());
        if (existing.isPresent()) {
            Inventory inv = existing.get();
            inv.setItemName(item.getItemName());
            inv.setCategory(item.getCategory());
            inv.setQuantity(item.getQuantity());
            inv.setLocation(item.getLocation());
            inv.setLastUpdated(new java.util.Date());
            
            // Update space utilization
            spaceService.updateSpaceUtilization();
            
            return inventoryRepo.save(inv);
        } else {
            throw new RuntimeException("Inventory item not found for update");
        }
    }

    public void removeItem(Integer itemId) {
        inventoryRepo.deleteById(itemId);
        
        // Update space utilization
        spaceService.updateSpaceUtilization();
    }

    public List<Inventory> viewInventory() {
        return inventoryRepo.findAllWithCategories();
    }

    public Optional<Inventory> getItemById(Integer itemId) {
        return inventoryRepo.findByIdWithCategory(itemId);
    }
}
