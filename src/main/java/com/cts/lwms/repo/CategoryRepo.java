package com.cts.lwms.repo;

import com.cts.lwms.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Integer> {
    
    Optional<Category> findByCategoryName(String categoryName);
    
    boolean existsByCategoryName(String categoryName);
} 