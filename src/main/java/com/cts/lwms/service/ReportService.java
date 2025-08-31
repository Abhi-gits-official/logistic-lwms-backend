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
        return reportRepo.save(report);
    }

    public Optional<Report> getReportById(Integer reportId) {
        return reportRepo.findById(reportId);
    }

    public List<Report> getAllReports() {
        return reportRepo.findAll();
    }
}
