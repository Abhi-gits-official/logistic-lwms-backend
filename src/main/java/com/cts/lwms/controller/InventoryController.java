package com.cts.lwms.controller;

import com.cts.lwms.dto.InventoryDTO;
import com.cts.lwms.model.Inventory;
import com.cts.lwms.model.Category;
import com.cts.lwms.service.InventoryService;
import com.cts.lwms.service.CategoryService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private CategoryService categoryService;

    @PostMapping("/add")
    public ResponseEntity<Inventory> addItem(@Valid @RequestBody InventoryDTO itemDto) {
        System.out.println("Received InventoryDTO: " + itemDto);
        System.out.println("Category ID: " + itemDto.getCategoryId());
        
        Inventory item = new Inventory();
        item.setItemName(itemDto.getItemName());
        
        // Set category by ID
        if (itemDto.getCategoryId() != null) {
            Category category = categoryService.getCategoryById(itemDto.getCategoryId());
            System.out.println("Found category: " + category);
            item.setCategory(category);
        } else {
            System.out.println("No category ID provided, setting category to null");
        }
        
        item.setQuantity(itemDto.getQuantity());
        item.setLocation(itemDto.getLocation());
        
        System.out.println("Final Inventory item: " + item);
        return ResponseEntity.ok(inventoryService.addItem(item));
    }

    @PutMapping("/update")
    public ResponseEntity<Inventory> updateItem(@Valid @RequestBody InventoryDTO itemDto) {
        System.out.println("Updating InventoryDTO: " + itemDto);
        System.out.println("Category ID: " + itemDto.getCategoryId());
        
        Inventory item = new Inventory();
        item.setItemId(itemDto.getItemId());
        item.setItemName(itemDto.getItemName());
        
        // Set category by ID
        if (itemDto.getCategoryId() != null) {
            Category category = categoryService.getCategoryById(itemDto.getCategoryId());
            System.out.println("Found category for update: " + category);
            item.setCategory(category);
        } else {
            System.out.println("No category ID provided for update, setting category to null");
        }
        
        item.setQuantity(itemDto.getQuantity());
        item.setLocation(itemDto.getLocation());
        
        System.out.println("Final Inventory item for update: " + item);
        return ResponseEntity.ok(inventoryService.updateItem(item));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Integer itemId) {
        inventoryService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/view")
    public ResponseEntity<List<Inventory>> viewInventory() {
        return ResponseEntity.ok(inventoryService.viewInventory());
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}

