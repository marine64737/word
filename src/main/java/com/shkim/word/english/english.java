package com.shkim.word.english;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class english {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String english;
    private String meaning;
    private int number = 0;
    private boolean anki = false;
    private int difficulty = 0;
    private boolean loop = false;
}
