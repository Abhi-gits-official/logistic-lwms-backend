package com.cts.lwms.controller;

import com.cts.lwms.model.Space;
import com.cts.lwms.service.SpaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/space")
@CrossOrigin(origins = "*")
public class SpaceController {
    @Autowired
    private SpaceService spaceService;

    @GetMapping("/view")
    public ResponseEntity<List<Space>> viewSpaceUsage() {
        return ResponseEntity.ok(spaceService.viewSpaceUsage());
    }

    @PostMapping("/allocate")
    public ResponseEntity<Space> allocateSpace(@RequestBody Space space) {
        return ResponseEntity.ok(spaceService.allocateSpace(space));
    }

    @DeleteMapping("/free/{spaceId}")
    public ResponseEntity<Void> freeSpace(@PathVariable Integer spaceId) {
        spaceService.freeSpace(spaceId);
        return ResponseEntity.noContent().build();
    }
}
