package com.shkim.word.kanji;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Kanji {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String kanji;
    private String reading;
    private String meaning;
    private String kormeaning;
    private int number = 0;
    private boolean anki = false;
    private int difficulty = 0;
    private boolean loop = false;
}
