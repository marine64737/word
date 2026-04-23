package com.shkim.word;

import jakarta.persistence.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"kanji", "reading"})
})
@Entity
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String kanji;
    private String reading;
    private String meaning;

    public Word() {
    }

    public Word(String kanji, String reading, String meaning){
        this.kanji = kanji;
        this.reading = reading;
        this.meaning = meaning;
    }

    public int getId(){
        return id;
    }

    public String getKanji(){
        return kanji;
    }

    public void setKanji(String kanji){
        this.kanji = kanji;
    }

    public String getReading(){
        return reading;
    }

    public void setReading(String reading) {
        this.reading = reading;
    }

    public String getMeaning() {
        return meaning;
    }

    public void setMeaning(String meaning) {
        this.meaning = meaning;
    }
}
