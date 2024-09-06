package com.uas.backend.repository;

import com.uas.backend.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video,Long> {
    List<Video> findByUserEmail(String email);
    long countByUserId(Long userId);
    List<Video> findByUserId(Long userId);
}
