package org.example.lostandfoundproject.repository;

import org.example.lostandfoundproject.model.HandoutEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HandoutEventRepository extends JpaRepository<HandoutEvent, Integer> {
    Optional<HandoutEvent> findByLostItemId(int id);
}
