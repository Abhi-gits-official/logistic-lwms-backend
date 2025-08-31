package com.cts.lwms.service;

import com.cts.lwms.model.Category;
import com.cts.lwms.repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    public Category addCategory(Category category) {
        if (categoryRepo.existsByCategoryName(category.getCategoryName())) {
            throw new RuntimeException("Category with name '" + category.getCategoryName() + "' already exists");
        }
        return categoryRepo.save(category);
    }

    public Category updateCategory(Integer categoryId, Category category) {
        Optional<Category> existingCategory = categoryRepo.findById(categoryId);
        if (existingCategory.isPresent()) {
            Category updatedCategory = existingCategory.get();
            updatedCategory.setCategoryName(category.getCategoryName());
            updatedCategory.setDescription(category.getDescription());
            return categoryRepo.save(updatedCategory);
        }
        throw new RuntimeException("Category not found with id: " + categoryId);
    }

    public void deleteCategory(Integer categoryId) {
        if (categoryRepo.existsById(categoryId)) {
            categoryRepo.deleteById(categoryId);
        } else {
            throw new RuntimeException("Category not found with id: " + categoryId);
        }
    }

    public Category getCategoryById(Integer categoryId) {
        return categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
    }

    public Category getCategoryByName(String categoryName) {
        return categoryRepo.findByCategoryName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + categoryName));
    }
} 