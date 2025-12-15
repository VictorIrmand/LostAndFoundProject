package org.example.lostandfoundproject.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "handout_events")
@Getter
@RequiredArgsConstructor
public class HandoutEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(optional = false)
    private LostItem lostItem;


    @ManyToOne(optional = false)
    @JoinColumn(name = "handed_out_by_id")
    private User handedOutBy;

    @CreationTimestamp
    private LocalDateTime handedOutDate;


    public HandoutEvent(LostItem lostItem, User handedOutBy) {
        this.lostItem = lostItem;
        this.handedOutBy = handedOutBy;
    }
}
