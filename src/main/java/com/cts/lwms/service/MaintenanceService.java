package com.cts.lwms.service;

import com.cts.lwms.model.MaintenanceSchedule;
import com.cts.lwms.repo.MaintenanceScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceService {
    @Autowired
    private MaintenanceScheduleRepo maintenanceScheduleRepo;

    public MaintenanceSchedule scheduleMaintenance(MaintenanceSchedule schedule) {
        return maintenanceScheduleRepo.save(schedule);
    }

    public MaintenanceSchedule updateSchedule(MaintenanceSchedule schedule) {
        return maintenanceScheduleRepo.save(schedule);
    }

    public List<MaintenanceSchedule> viewSchedule() {
        return maintenanceScheduleRepo.findAll();
    }

    public Optional<MaintenanceSchedule> getScheduleById(Integer scheduleId) {
        return maintenanceScheduleRepo.findById(scheduleId);
    }
}
