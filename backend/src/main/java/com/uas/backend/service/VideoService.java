package com.uas.backend.service;

import com.uas.backend.model.User;
import com.uas.backend.model.Video;
import com.uas.backend.repository.UserRepository;
import com.uas.backend.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

//...

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    // Directory where the videos are stored
    private final String uploadDirectory = "D:\\Peatihan React 2\\Peni_UAS - Copy\\videos\\";

    @Autowired
    public VideoService(VideoRepository videoRepository, UserRepository userRepository) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
    }

    public Video saveVideo(String email, MultipartFile file, String judul, String description) throws IOException {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            // Generate a unique filename
            String fileName = file.getOriginalFilename();

            Path filePath = Paths.get(uploadDirectory, fileName);

            Files.createDirectories(filePath.getParent());

            file.transferTo(filePath.toFile());

            Video video = new Video();
            video.setUser(user);
            video.setJudul(judul);
            video.setDescription(description);
            video.setVideo(fileName);
            return videoRepository.save(video);
        }
        return null;
    }


    @Transactional
    public Video updateVideo(Long id, Video updatedVideo) {
        Optional<Video> existingVideo = videoRepository.findById(id);
        if (existingVideo.isPresent()) {
            Video video = existingVideo.get();
            video.setJudul(updatedVideo.getJudul());
            video.setVideo(updatedVideo.getVideo());
            video.setDescription(updatedVideo.getDescription());
            video.setTanggalVideo(LocalDateTime.now());
            return videoRepository.save(video);
        }
        return null;
    }
    @Transactional
    public void deleteVideoById(Long id) {
        videoRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllVideos() {
        videoRepository.deleteAll();
    }
    public List<Video> getVideosByUserEmail(String email) {
        return videoRepository.findByUserEmail(email);
    }
    public List<Video> getVideosByUserId(Long userId) {
        return videoRepository.findByUserId(userId);
    }
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }
    public Optional<Video> getVideoWithComments(Long videoId) {
        return videoRepository.findById(videoId);
    }
}



