package com.cts.lwms.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cts.lwms.model.Space;

@Repository
public interface SpaceRepo extends JpaRepository<Space, Integer> {
    // ...existing code...
}
