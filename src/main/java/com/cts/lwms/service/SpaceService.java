package com.cts.lwms.service;

import com.cts.lwms.model.Space;
import com.cts.lwms.model.Inventory;
import com.cts.lwms.repo.SpaceRepo;
import com.cts.lwms.repo.InventoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class SpaceService {
    @Autowired
    private SpaceRepo spaceRepo;
    
    @Autowired
    private InventoryRepo inventoryRepo;

    public List<Space> viewSpaceUsage() {
        // Get all spaces
        List<Space> spaces = spaceRepo.findAll();
        
        // If no spaces exist, create default zones based on inventory locations
        if (spaces.isEmpty()) {
            spaces = createDefaultZones();
        }
        
        // Calculate actual space utilization based on inventory data
        calculateSpaceUtilization(spaces);
        
        return spaces;
    }
    
    private List<Space> createDefaultZones() {
        List<Space> defaultZones = new ArrayList<>();
        
        // Create zones A, B, C, D with default capacities
        String[] zones = {"A", "B", "C", "D"};
//        String[] descriptions = {"Clothing", "Electronics", "Footwear", "Others"};
        
        for (int i = 0; i < zones.length; i++) {
            Space space = new Space();
            space.setZone(zones[i]);
            space.setTotalCapacity(1000); // Default capacity
            space.setUsedCapacity(0);
            space.setAvailableCapacity(1000);
            defaultZones.add(space);
        }
        
        // Save default zones
        return spaceRepo.saveAll(defaultZones);
    }
    
    private void calculateSpaceUtilization(List<Space> spaces) {
        // Get all inventory items
        List<Inventory> inventoryItems = inventoryRepo.findAll();
        
        // Create a map to track total quantity per zone
        Map<String, Integer> zoneQuantities = new HashMap<>();
        
        // Calculate total quantity for each zone based on inventory locations
        for (Inventory item : inventoryItems) {
            String zone = item.getLocation();
            int quantity = item.getQuantity();
            
            if (zone != null && !zone.trim().isEmpty()) {
                zoneQuantities.put(zone, zoneQuantities.getOrDefault(zone, 0) + quantity);
            }
        }
        
        // Update space utilization for each zone
        for (Space space : spaces) {
            String zone = space.getZone();
            int usedCapacity = zoneQuantities.getOrDefault(zone, 0);
            
            space.setUsedCapacity(usedCapacity);
            space.setAvailableCapacity(Math.max(0, space.getTotalCapacity() - usedCapacity));
        }
        
        // Save updated spaces
        spaceRepo.saveAll(spaces);
    }
    
    /**
     * Update space utilization when inventory changes
     * This method should be called after inventory operations
     */
    public void updateSpaceUtilization() {
        List<Space> spaces = spaceRepo.findAll();
        if (!spaces.isEmpty()) {
            calculateSpaceUtilization(spaces);
        }
    }

    public Space allocateSpace(Space space) {
        // Validate zone
        if (space.getZone() == null || space.getZone().trim().isEmpty()) {
            throw new IllegalArgumentException("Zone is required");
        }
        
        // Check if zone already exists
        List<Space> existingSpaces = spaceRepo.findAll();
        for (Space existing : existingSpaces) {
            if (existing.getZone().equalsIgnoreCase(space.getZone())) {
                // Update existing zone capacity
                existing.setTotalCapacity(space.getTotalCapacity());
                existing.setUsedCapacity(space.getUsedCapacity());
                existing.setAvailableCapacity(space.getAvailableCapacity());
                return spaceRepo.save(existing);
            }
        }
        
        // Create new zone
        return spaceRepo.save(space);
    }

    public void freeSpace(Integer spaceId) {
        spaceRepo.deleteById(spaceId);
    }

    public Optional<Space> getSpaceById(Integer spaceId) {
        return spaceRepo.findById(spaceId);
    }

    public boolean allocateProductToSpace(String zone, int productQuantity) {
        List<Space> spaces = spaceRepo.findAll();
        for (Space space : spaces) {
            if (space.getZone().equalsIgnoreCase(zone)) {
                if (space.getAvailableCapacity() >= productQuantity) {
                    space.setUsedCapacity(space.getUsedCapacity() + productQuantity);
                    space.setAvailableCapacity(space.getAvailableCapacity() - productQuantity);
                    spaceRepo.save(space);
                    return true;
                } else {
                    return false; // Not enough capacity
                }
            }
        }
        return false; // Zone not found
    }

    public boolean allocateInventoryToSpace(String location, int quantity) {
        // Use location as zone reference
        List<Space> spaces = spaceRepo.findAll();
        for (Space space : spaces) {
            if (space.getZone().equalsIgnoreCase(location)) {
                if (space.getAvailableCapacity() >= quantity) {
                    space.setUsedCapacity(space.getUsedCapacity() + quantity);
                    space.setAvailableCapacity(space.getAvailableCapacity() - quantity);
                    spaceRepo.save(space);
                    return true;
                } else {
                    return false; // Not enough capacity
                }
            }
        }
        return false; // Zone not found
    }
}
