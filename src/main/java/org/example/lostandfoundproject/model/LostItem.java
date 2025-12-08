package org.example.lostandfoundproject.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

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
    private boolean isFound;

    @Column(nullable = false)
    private String placeFound;

    @Setter
    @Column(nullable = false)
    private Category category;

    public LostItem(String name, String description, boolean isFound, String placeFound, Category category) {
        this.name = name;
        this.description = description;
        this.isFound = isFound;
        this.placeFound = placeFound;
        this.category = category;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
