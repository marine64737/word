package com.shkim.word.kanji;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface KanjiRepository extends JpaRepository<Kanji, Integer> {

    @Query(value = "select id from kanji", nativeQuery = true)
    List<Integer> findIds();

    List<Kanji> findByKanjiContaining(String kanji);

    boolean existsByKanji(String kanji);

    boolean existsByKanjiContaining(String kanji);

    // 한자와 읽기가 모두 일치하는 데이터가 있는지 확인
    boolean existsByKanjiAndReading(String kanji, String reading);

    // 한자가 없는 경우(null)를 대비한 체크
    boolean existsByKanjiIsNullAndReading(String reading);

    @Query(value = "SELECT * FROM kanji where anki = false ORDER BY random() LIMIT 10", nativeQuery = true)
    List<Kanji> findShuffled();

    @Query(value = "SELECT * FROM kanji where anki = false and loop = true ORDER BY random() LIMIT 10", nativeQuery = true)
    List<Kanji> findLoopShuffled();

    @Query(value = "SELECT count(*) FROM kanji", nativeQuery = true)
    int wordsNum();

    @Query(value = "SELECT count(*) FROM kanji where loop = true", nativeQuery = true)
    int loopWordsNum();

    @Query(value = "SELECT count(*) FROM kanji where anki = true", nativeQuery = true)
    int ankiWordsNum();

    @Transactional
    @Modifying
    @Query(value = "update kanji set anki = false", nativeQuery = true)
    void ankiInit();
}
