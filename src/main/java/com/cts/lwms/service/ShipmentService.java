package com.cts.lwms.service;

import com.cts.lwms.model.Shipment;
import com.cts.lwms.repo.ShipmentRepo;
import com.cts.lwms.dto.ShipmentTrackingDTO;
import com.cts.lwms.dto.ShipmentListDTO;
// import com.cts.lwms.repo.InventoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShipmentService {
    @Autowired
    private ShipmentRepo shipmentRepo;

    // Removed unused InventoryRepo field

    public Shipment receiveShipment(Shipment shipment) {
        System.out.println("Saving shipment: " + shipment);
        Shipment saved = shipmentRepo.save(shipment);
        System.out.println("Saved shipment with ID: " + saved.getShipmentId());
        return saved;
    }

    public Shipment dispatchShipment(Shipment shipment) {
        // Ensure inventory is set from itemId
        if (shipment.getInventory() == null && shipment.getInventory() == null) {
            throw new RuntimeException("Inventory must be set for shipment");
        }
        return shipmentRepo.save(shipment);
    }

    public Optional<ShipmentTrackingDTO> trackShipment(Integer shipmentId) {
        // Fetch shipment with inventory details to ensure ItemId is available
        Optional<Shipment> shipment = shipmentRepo.findByIdWithInventory(shipmentId);
        if (shipment.isPresent()) {
            // Convert to DTO with ItemId
            Shipment s = shipment.get();
            ShipmentTrackingDTO dto = new ShipmentTrackingDTO();
            dto.setShipmentId(s.getShipmentId());
            dto.setOrigin(s.getOrigin());
            dto.setDestination(s.getDestination());
            dto.setStatus(s.getStatus());
            dto.setExpectedDeliveryDate(s.getExpectedDeliveryDate());
            
            if (s.getInventory() != null) {
                dto.setItemId(s.getInventory().getItemId());
                System.out.println("Tracked shipment " + shipmentId + " with ItemId: " + s.getInventory().getItemId());
            } else {
                dto.setItemId(null);
                System.out.println("Warning: Shipment " + shipmentId + " has no inventory associated");
            }
            
            return Optional.of(dto);
        } else {
            System.out.println("Shipment not found with ID: " + shipmentId);
            return Optional.empty();
        }
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepo.findAll();
    }

    public List<ShipmentListDTO> getAllShipmentsWithItemIds() {
        // Fetch all shipments with inventory details to ensure ItemId is available
        List<Shipment> shipments = shipmentRepo.findAllWithInventory();
        
        return shipments.stream().map(shipment -> {
            ShipmentListDTO dto = new ShipmentListDTO();
            dto.setShipmentId(shipment.getShipmentId());
            dto.setOrigin(shipment.getOrigin());
            dto.setDestination(shipment.getDestination());
            dto.setStatus(shipment.getStatus());
            dto.setExpectedDeliveryDate(shipment.getExpectedDeliveryDate());
            
            if (shipment.getInventory() != null) {
                dto.setItemId(shipment.getInventory().getItemId());
            } else {
                dto.setItemId(null);
            }
            
            return dto;
        }).collect(Collectors.toList());
    }

    public Optional<Shipment> getShipmentById(Integer shipmentId) {
        return shipmentRepo.findById(shipmentId);
    }

    public Shipment updateShipment(Shipment shipment) {
        System.out.println("Updating shipment: " + shipment);
        Shipment updated = shipmentRepo.save(shipment);
        System.out.println("Updated shipment with ID: " + updated.getShipmentId());
        return updated;
    }

    public void deleteShipment(Integer shipmentId) {
        shipmentRepo.deleteById(shipmentId);
    }
}
