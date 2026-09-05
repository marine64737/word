package com.shkim.word.english;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface EnglishRepository extends JpaRepository<english, Integer> {

    @Query(value = "select id from english", nativeQuery = true)
    List<Integer> findIds();

    @Query(value = "SELECT * FROM english where anki = false ORDER BY random() LIMIT 20", nativeQuery = true)
    List<english> findShuffled();

    @Query(value = "SELECT * FROM english where anki = false and loop = true ORDER BY random() LIMIT 20", nativeQuery = true)
    List<english> findLoopShuffled();

    @Query(value = "SELECT count(*) FROM english", nativeQuery = true)
    int wordsNum();

//    @Query(value = "SELECT count(*) FROM english where loop = true", nativeQuery = true)
//    int passedWordsNum();

    @Query(value = "SELECT count(*) FROM english where loop = true", nativeQuery = true)
    int loopWordsNum();

    @Query(value = "SELECT count(*) FROM english where anki = true", nativeQuery = true)
    int ankiWordsNum();

    @Transactional
    @Modifying
    @Query(value = "update english set anki = false", nativeQuery = true)
    void ankiInit();
}
