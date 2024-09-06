package com.uas.backend.repository;

import com.uas.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByVideoId(Long videoId);
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.video.id = :videoId")
    void deleteByVideoId(@Param("videoId") Long videoId);
}
