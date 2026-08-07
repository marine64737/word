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
    private String kormeaning;
    private int number;
    private boolean state;
    private boolean anki;
    private boolean loop;

    public Word() {
    }

    public Word(int id, String kanji, String reading, String meaning, String kormeaning, boolean state, boolean anki, boolean loop){
        this.id = id;
        this.kanji = kanji;
        this.reading = reading;
        this.meaning = meaning;
        this.kormeaning = kormeaning;
        this.state = state;
        this.anki = anki;
        this.loop = loop;
    }

    public int getId(){
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getKanji(){
        return kanji;
    }

    public int getNumber() {
        return number;
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

    public void setNumber(int number) {
        this.number = number;
    }

    public boolean isState() {
        return state;
    }

    public void setState(boolean state) {
        this.state = state;
    }

    public String getKormeaning() {
        return kormeaning;
    }

    public void setKormeaning(String kormeaning) {
        this.kormeaning = kormeaning;
    }

    public boolean isAnki() {
        return anki;
    }

    public void setAnki(boolean anki) {
        this.anki = anki;
    }

    public boolean isLoop() {
        return loop;
    }
    public void setLoop(boolean loop) {
        this.loop = loop;
    }
}
