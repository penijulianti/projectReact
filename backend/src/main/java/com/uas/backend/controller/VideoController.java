package com.uas.backend.controller;

import com.uas.backend.model.Video;
import com.uas.backend.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/videos")
public class VideoController{

    private final VideoService videoService;
    private final ResourceLoader resourceLoader;

    @Autowired
    public VideoController(VideoService videoService, ResourceLoader resourceLoader) {
        this.videoService = videoService;
        this.resourceLoader = resourceLoader;
    }
    @PostMapping("/upload")
    public String uploadVideo(@RequestParam("file") MultipartFile file,
                              @RequestParam("judul") String judul,
                              @RequestParam("description") String description) throws IOException {
        // Get the currently authenticated user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Save the video using the service
        Video video = videoService.saveVideo(email, file, judul, description);

        if (video != null) {
            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/videos/")
                    .path(video.getId().toString())
                    .toUriString();
        }

        return "Upload failed";
    }

    @GetMapping("/my-videos")
    public ResponseEntity<List<Video>> getMyVideos() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Video> videos = videoService.getVideosByUserEmail(email);
        if (videos != null && !videos.isEmpty()) {
            return ResponseEntity.ok(videos);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/video/{filename:.+}")
    public ResponseEntity<Resource> getVideo(@PathVariable String filename) {
        try {
            Path videoPath = Paths.get("src/main/resources/static/videos/").resolve(filename);
            Resource resource = resourceLoader.getResource("file:" + videoPath.toString());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, "video/mp4")
                        .body(resource);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping
    public ResponseEntity<List<Video>> getAllVideos() {
        List<Video> videos = videoService.getAllVideos();
        if (videos != null && !videos.isEmpty()) {
            return ResponseEntity.ok(videos);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by/{userId}")
    public ResponseEntity<List<Video>> getVideosByUserId(@PathVariable Long userId) {
        List<Video> videos = videoService.getVideosByUserId(userId);
        return ResponseEntity.ok(videos);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> updateVideo(@PathVariable Long id, @RequestBody Video updatedVideo) {
        try {
            Video video = videoService.updateVideo(id, updatedVideo);
            if (video != null) {
                return ResponseEntity.ok("Video updated successfully.");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to edit this comment.");
        }
    }

    @DeleteMapping("/delete-by/{id}")
    public ResponseEntity<String> deleteVideoById(@PathVariable Long id) {
        try {
            videoService.deleteVideoById(id);
            return ResponseEntity.ok("Video deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found.");
        }
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<String> deleteAllVideos() {
        try {
            videoService.deleteAllVideos();
            return ResponseEntity.ok("Video deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found.");
        }
    }
}
