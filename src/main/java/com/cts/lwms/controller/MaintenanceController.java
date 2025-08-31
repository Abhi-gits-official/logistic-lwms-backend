package com.cts.lwms.controller;

import com.cts.lwms.model.MaintenanceSchedule;
import com.cts.lwms.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/maintenance")
public class MaintenanceController {
    @Autowired
    private MaintenanceService maintenanceService;

    @PostMapping("/schedule")
    public ResponseEntity<MaintenanceSchedule> scheduleMaintenance(@RequestBody MaintenanceSchedule schedule) {
        return ResponseEntity.ok(maintenanceService.scheduleMaintenance(schedule));
    }

    @PutMapping("/update")
    public ResponseEntity<MaintenanceSchedule> updateSchedule(@RequestBody MaintenanceSchedule schedule) {
        return ResponseEntity.ok(maintenanceService.updateSchedule(schedule));
    }

    @GetMapping("/view")
    public ResponseEntity<List<MaintenanceSchedule>> viewSchedule() {
        return ResponseEntity.ok(maintenanceService.viewSchedule());
    }

    @GetMapping("/get/{scheduleId}")
    public ResponseEntity<Optional<MaintenanceSchedule>> getScheduleById(@PathVariable Integer scheduleId) {
        return ResponseEntity.ok(maintenanceService.getScheduleById(scheduleId));
    }
}
