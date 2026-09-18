package com.shkim.word.common;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CommonRepository extends JpaRepository<Common, Long> {
    @Query("SELECT c.status FROM Common c WHERE c.id = :id")
    int findStatusById(@Param("id") Long id);

    @Query("SELECT c.jlpt FROM Common c WHERE c.id = :id")
    int findJlptById(@Param("id") Long id);

    @Query("SELECT c.word FROM Common c WHERE c.id = :id")
    int findWordById(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query("UPDATE Common c SET c.status = :status WHERE c.id = :id")
    void updateStatusById(@Param("id") Long id, @Param("status") int status);

    @Transactional
    @Modifying
    @Query("UPDATE Common c SET c.jlpt = :jlpt WHERE c.id = :id")
    void updateJlptById(@Param("id") Long id, @Param("jlpt") int jlpt);

    @Transactional
    @Modifying
    @Query("UPDATE Common c SET c.word = :word WHERE c.id = :id")
    void updateWordById(@Param("id") Long id, @Param("word") int word);
}
