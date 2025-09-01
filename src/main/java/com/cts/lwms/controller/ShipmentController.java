package com.cts.lwms.controller;

import com.cts.lwms.dto.ShipmentDTO;
import com.cts.lwms.dto.ShipmentTrackingDTO;
import com.cts.lwms.dto.ShipmentListDTO;
import com.cts.lwms.model.Inventory;
import com.cts.lwms.model.Shipment;
import com.cts.lwms.repo.InventoryRepo;
import com.cts.lwms.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/shipment")
public class ShipmentController {
    @Autowired
    private ShipmentService shipmentService;

    @Autowired
    private InventoryRepo inventoryRepo;

    @PostMapping("/receive")
    public ResponseEntity<?> receiveShipment(@RequestBody ShipmentDTO shipmentDto) {
        try {
            System.out.println("=== SHIPMENT RECEIVE REQUEST ===");
            System.out.println("Received DTO: " + shipmentDto);
            
            // Validate input
            if (shipmentDto.getItemId() == null) {
                System.out.println("ERROR: Item ID is null");
                return ResponseEntity.badRequest().body("Error: Item ID is required");
            }
            
            System.out.println("Looking for inventory item with ID: " + shipmentDto.getItemId());
            Inventory inventory = inventoryRepo.findById(shipmentDto.getItemId())
                .orElseThrow(() -> new RuntimeException("Inventory item not found with ID: " + shipmentDto.getItemId()));
            System.out.println("Found inventory item: " + inventory);
            
            List<Shipment> existingShipments = shipmentService.getAllShipments();
            System.out.println("Existing shipments count: " + existingShipments.size());
            
            boolean duplicate = existingShipments.stream()
                .anyMatch(s -> s.getInventory().getItemId().equals(shipmentDto.getItemId()) && "Received".equalsIgnoreCase(s.getStatus()));
            if (duplicate) {
                System.out.println("ERROR: Duplicate shipment detected");
                return ResponseEntity.badRequest().body("Error: This item already has a received shipment. Only one active received shipment per item is allowed.");
            }
            
            Shipment shipment = new Shipment();
            shipment.setInventory(inventory);
            shipment.setOrigin(shipmentDto.getOrigin());
            shipment.setDestination(shipmentDto.getDestination());
            shipment.setStatus(shipmentDto.getStatus());
            
            System.out.println("Created shipment object: " + shipment);
            
            try {
                if (shipmentDto.getExpectedDeliveryDate() != null && !shipmentDto.getExpectedDeliveryDate().isEmpty()) {
                    shipment.setExpectedDeliveryDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(shipmentDto.getExpectedDeliveryDate()));
                } else {
                    // Set default date if none provided
                    shipment.setExpectedDeliveryDate(new java.util.Date());
                }
                System.out.println("Set expected delivery date: " + shipment.getExpectedDeliveryDate());
            } catch (Exception e) {
                // Set default date if parsing fails
                shipment.setExpectedDeliveryDate(new java.util.Date());
                System.out.println("Used default date due to parsing error: " + e.getMessage());
            }
            
            System.out.println("About to save shipment...");
            Shipment savedShipment = shipmentService.receiveShipment(shipment);
            System.out.println("Successfully saved shipment with ID: " + savedShipment.getShipmentId());
            
            return ResponseEntity.ok(savedShipment);
            
        } catch (Exception e) {
            System.out.println("ERROR in receiveShipment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating shipment: " + e.getMessage());
        }
    }

    @PutMapping("/dispatch/{shipmentId}")
    public ResponseEntity<?> dispatchShipment(@PathVariable Integer shipmentId, @RequestBody ShipmentDTO shipmentDto) {
        try {
            System.out.println("=== SHIPMENT DISPATCH REQUEST ===");
            System.out.println("Updating shipment with ID: " + shipmentId);
            System.out.println("Received DTO: " + shipmentDto);
            
            // Find the existing shipment
            Optional<Shipment> existingShipmentOpt = shipmentService.getShipmentById(shipmentId);
            if (!existingShipmentOpt.isPresent()) {
                System.out.println("ERROR: Shipment not found with ID: " + shipmentId);
                return ResponseEntity.notFound().build();
            }
            
            Shipment existingShipment = existingShipmentOpt.get();
            System.out.println("Found existing shipment: " + existingShipment);
            
            // Update the shipment details
            existingShipment.setOrigin(shipmentDto.getOrigin());
            existingShipment.setDestination(shipmentDto.getDestination());
            existingShipment.setStatus(shipmentDto.getStatus());
            
            // Update expected delivery date if provided
            if (shipmentDto.getExpectedDeliveryDate() != null && !shipmentDto.getExpectedDeliveryDate().isEmpty()) {
                try {
                    existingShipment.setExpectedDeliveryDate(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(shipmentDto.getExpectedDeliveryDate()));
                } catch (Exception e) {
                    System.out.println("Warning: Invalid date format, keeping existing date: " + e.getMessage());
                }
            }
            
            // Save the updated shipment
            Shipment updatedShipment = shipmentService.updateShipment(existingShipment);
            System.out.println("Successfully updated shipment with ID: " + updatedShipment.getShipmentId());
            
            return ResponseEntity.ok(updatedShipment);
            
        } catch (Exception e) {
            System.out.println("ERROR in dispatchShipment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error updating shipment: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{shipmentId}")
    public ResponseEntity<Void> deleteShipment(@PathVariable Integer shipmentId) {
        Optional<Shipment> shipmentOpt = shipmentService.getShipmentById(shipmentId);
        if (!shipmentOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        shipmentService.deleteShipment(shipmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/track/{shipmentId}")
    public ResponseEntity<Optional<ShipmentTrackingDTO>> trackShipment(@PathVariable Integer shipmentId) {
        System.out.println("=== SHIPMENT TRACK REQUEST ===");
        System.out.println("Tracking shipment with ID: " + shipmentId);
        
        Optional<ShipmentTrackingDTO> shipment = shipmentService.trackShipment(shipmentId);
        
        if (shipment.isPresent()) {
            ShipmentTrackingDTO s = shipment.get();
            if (s.getItemId() != null) {
                System.out.println("Successfully tracked shipment " + shipmentId + " with ItemId: " + s.getItemId());
            } else {
                System.out.println("Warning: Shipment " + shipmentId + " has no inventory associated");
            }
        } else {
            System.out.println("Shipment not found with ID: " + shipmentId);
        }
        
        return ResponseEntity.ok(shipment);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ShipmentListDTO>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipmentsWithItemIds());
    }
}
