package com.cts.lwms.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cts.lwms.model.MaintenanceSchedule;

@Repository
public interface MaintenanceScheduleRepo extends JpaRepository<MaintenanceSchedule, Integer> {
    // ...existing code...
}
