package com.cts.lwms.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cts.lwms.model.Report;

@Repository
public interface ReportRepo extends JpaRepository<Report, Integer> {
    // ...existing code...
}
