package org.example.lostandfoundproject.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "lost_items")

public class LostItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(nullable = false)
    private String description;


    @Setter
    @Column(nullable = false)
    private boolean isReturned;

    @Column(nullable = false)
    private String placeFound;


    @Column(nullable = false)
    private LocalDateTime dateFound;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime registeredAt;

    @Setter
    @Column(nullable = false)
    private Category category;

    public LostItem(String name, String description, boolean isReturned, String placeFound, Category category, LocalDateTime dateFound) {
        this.name = name;
        this.description = description;
        this.isReturned = isReturned;
        this.placeFound = placeFound;
        this.category = category;
        this.dateFound = dateFound;
    }


    public void setUser(User user) {
        this.user = user;
    }
}
