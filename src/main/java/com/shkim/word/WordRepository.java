package com.shkim.word;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

    @Query(value = "SELECT * FROM word ORDER BY random() LIMIT 20", nativeQuery = true)
    List<Word> findShuffled();
}
