package com.shkim.word.common;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface CommonRepository extends JpaRepository<Common, Long> {
    @Query("SELECT c.status FROM Common c WHERE c.id = :id")
    int findStatusById(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query("UPDATE Common c SET c.status = :status WHERE c.id = :id")
    void updateStatusById(@Param("id") Long id, @Param("status") int status);
}
