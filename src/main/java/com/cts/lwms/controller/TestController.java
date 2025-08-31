package com.cts.lwms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.HashMap;

@RestController
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/test/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        response.put("application", "LWMS");
        
        try {
            // Test database connection
            String dbVersion = jdbcTemplate.queryForObject("SELECT VERSION()", String.class);
            response.put("database", "CONNECTED");
            response.put("dbVersion", dbVersion);
            
            // Test table access
            Integer categoryCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Category", Integer.class);
            Integer inventoryCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Inventory", Integer.class);
            Integer shipmentCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM Shipment", Integer.class);
            
            response.put("categories", categoryCount);
            response.put("inventory", inventoryCount);
            response.put("shipments", shipmentCount);
            
        } catch (Exception e) {
            response.put("database", "ERROR");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test/db-tables")
    public ResponseEntity<Map<String, Object>> listTables() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String sql = "SHOW TABLES";
            var tables = jdbcTemplate.queryForList(sql);
            response.put("tables", tables);
            response.put("status", "SUCCESS");
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
} 