package com.cts.lwms.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import jakarta.servlet.ServletContext;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private ServletContext servletContext;

    @GetMapping("/static-resources")
    public ResponseEntity<Map<String, Object>> checkStaticResources() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if admin/home.html exists
            Resource adminHomeResource = resourceLoader.getResource("classpath:/static/admin/home.html");
            boolean adminHomeExists = adminHomeResource.exists();
            response.put("admin_home_exists", adminHomeExists);
            
            if (adminHomeExists) {
                response.put("admin_home_path", adminHomeResource.getURI().toString());
                response.put("admin_home_readable", adminHomeResource.isReadable());
            }
            
            // Check static directory
            Resource staticDirResource = resourceLoader.getResource("classpath:/static/");
            response.put("static_dir_exists", staticDirResource.exists());
            response.put("static_dir_path", staticDirResource.getURI().toString());
            
            // Check admin directory
            Resource adminDirResource = resourceLoader.getResource("classpath:/static/admin/");
            response.put("admin_dir_exists", adminDirResource.exists());
            response.put("admin_dir_path", adminDirResource.getURI().toString());
            
            // Check specific files
            String[] filesToCheck = {
                "classpath:/static/index.html",
                "classpath:/static/admin/home.html",
                "classpath:/static/admin/dashboard.html",
                "classpath:/static/css/admin.css",
                "classpath:/static/js/admin.js"
            };
            
            Map<String, Boolean> fileStatus = new HashMap<>();
            for (String filePath : filesToCheck) {
                Resource fileResource = resourceLoader.getResource(filePath);
                fileStatus.put(filePath, fileResource.exists());
            }
            response.put("file_status", fileStatus);
            
            response.put("status", "SUCCESS");
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
            response.put("error_type", e.getClass().getSimpleName());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/servlet-context")
    public ResponseEntity<Map<String, Object>> checkServletContext() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            response.put("servlet_context_path", servletContext.getContextPath());
            response.put("servlet_context_real_path", servletContext.getRealPath("/"));
            response.put("servlet_context_resource_path", servletContext.getRealPath("/static/"));
            
            // Try to get admin/home.html through servlet context
            String adminHomePath = servletContext.getRealPath("/static/admin/home.html");
            if (adminHomePath != null) {
                Path path = Paths.get(adminHomePath);
                response.put("admin_home_file_exists", Files.exists(path));
                response.put("admin_home_file_size", Files.exists(path) ? Files.size(path) : 0);
            } else {
                response.put("admin_home_file_exists", false);
            }
            
            response.put("status", "SUCCESS");
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test-file-access")
    public ResponseEntity<String> testFileAccess() {
        try {
            Resource resource = resourceLoader.getResource("classpath:/static/admin/home.html");
            if (resource.exists()) {
                return ResponseEntity.ok("✅ File exists and is accessible!");
            } else {
                return ResponseEntity.ok("❌ File does not exist!");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("❌ Error accessing file: " + e.getMessage());
        }
    }
} 