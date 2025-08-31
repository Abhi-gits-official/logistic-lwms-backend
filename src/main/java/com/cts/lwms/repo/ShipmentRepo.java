package com.cts.lwms.repo;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cts.lwms.model.Shipment;

@Repository
public interface ShipmentRepo extends JpaRepository<Shipment, Integer> {
    
    /**
     * Find shipment by ID with inventory details loaded
     * This ensures the ItemId is available in the response
     */
    @Query("SELECT s FROM Shipment s LEFT JOIN FETCH s.inventory WHERE s.shipmentId = :shipmentId")
    Optional<Shipment> findByIdWithInventory(@Param("shipmentId") Integer shipmentId);
    
    /**
     * Find all shipments with inventory details loaded
     * This ensures the ItemId is available in the response for all shipments
     */
    @Query("SELECT s FROM Shipment s LEFT JOIN FETCH s.inventory")
    List<Shipment> findAllWithInventory();
}
