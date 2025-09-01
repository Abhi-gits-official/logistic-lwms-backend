package com.cts.lwms.service;

import com.cts.lwms.model.Report;
import com.cts.lwms.repo.ReportRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {
    @Autowired
    private ReportRepo reportRepo;

    public Report generateReport(Report report) {
        // Set the generation timestamp
        report.setGeneratedOn(new java.util.Date());
        
        // Generate report content based on report type
        if (report.getDetails() == null || report.getDetails().isEmpty()) {
            String details = generateReportDetails(report.getReportType());
            report.setDetails(details);
        }
        
        return reportRepo.save(report);
    }
    
    private String generateReportDetails(String reportType) {
        StringBuilder details = new StringBuilder();
        details.append("Report Type: ").append(reportType).append("\n");
        details.append("Generated on: ").append(new java.util.Date()).append("\n");
        details.append("Status: Generated successfully\n");
        
        switch (reportType.toLowerCase()) {
            case "inventory":
                details.append("Inventory Report: Contains current stock levels and item details.\n");
                break;
            case "shipment":
                details.append("Shipment Report: Contains tracking and delivery information.\n");
                break;
            case "space":
                details.append("Space Report: Contains warehouse space utilization data.\n");
                break;
            case "maintenance":
                details.append("Maintenance Report: Contains equipment maintenance schedules.\n");
                break;
            default:
                details.append("General Report: Contains system overview data.\n");
        }
        
        return details.toString();
    }

    public Optional<Report> getReportById(Integer reportId) {
        return reportRepo.findById(reportId);
    }

    public List<Report> getAllReports() {
        return reportRepo.findAll();
    }
}
