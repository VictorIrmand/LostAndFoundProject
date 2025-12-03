package org.example.lostandfoundproject.repository;

import org.example.lostandfoundproject.model.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LostItemRepository extends JpaRepository<LostItem, Integer> {

}
