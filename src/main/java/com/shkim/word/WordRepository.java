package com.shkim.word;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Integer> {

    @Query(value = "select id from word", nativeQuery = true)
    List<Integer> findIds();

    List<Word> findByKanjiContaining(String kanji);

    boolean existsByKanji(String kanji);

    boolean existsByKanjiContaining(String kanji);

    // 한자와 읽기가 모두 일치하는 데이터가 있는지 확인
    boolean existsByKanjiAndReading(String kanji, String reading);

    // 한자가 없는 경우(null)를 대비한 체크
    boolean existsByKanjiIsNullAndReading(String reading);

    @Query(value = "SELECT * FROM word where state = false and anki = false ORDER BY random() LIMIT 10", nativeQuery = true)
    List<Word> findShuffled();

    @Query(value = "SELECT * FROM word where state = false and anki = false and loop = true ORDER BY random() LIMIT 10", nativeQuery = true)
    List<Word> findLoopShuffled();

    @Query(value = "SELECT count(*) FROM word", nativeQuery = true)
    int wordsNum();

    @Query(value = "SELECT count(*) FROM word where state = true and loop = true", nativeQuery = true)
    int passedWordsNum();

    @Query(value = "SELECT count(*) FROM word where loop = true", nativeQuery = true)
    int loopWordsNum();

    @Query(value = "SELECT count(*) FROM word where anki = true", nativeQuery = true)
    int ankiWordsNum();

    @Transactional
    @Modifying
    @Query(value = "update word set state = false where anki = false and loop = true", nativeQuery = true)
    void init();

    @Transactional
    @Modifying
    @Query(value = "update word set anki = false", nativeQuery = true)
    void ankiInit();
}
