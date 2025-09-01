package com.cts.lwms.controller;

import com.cts.lwms.model.Report;
import com.cts.lwms.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/report")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @PostMapping("/generate")
    public ResponseEntity<Report> generateReport(@RequestBody Report report) {
        return ResponseEntity.ok(reportService.generateReport(report));
    }

    @GetMapping("/get/{reportId}")
    public ResponseEntity<Optional<Report>> getReportById(@PathVariable Integer reportId) {
        return ResponseEntity.ok(reportService.getReportById(reportId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/test")
    public ResponseEntity<String> testReportAPI() {
        return ResponseEntity.ok("Report API is working correctly!");
    }
}
