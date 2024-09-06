package com.uas.backend.service;

import com.uas.backend.model.Comment;
import com.uas.backend.model.Video;
import com.uas.backend.repository.CommentRepository;
import com.uas.backend.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final VideoRepository videoRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, VideoRepository videoRepository) {
        this.commentRepository = commentRepository;
        this.videoRepository = videoRepository;
    }

    public Comment addComment(Long videoId,String komentar) {
        Video video = videoRepository.findById(videoId).orElse(null);
        if (video != null) {
            Comment comment = new Comment();
            comment.setVideo(video);
            comment.setNamaPengguna(getLoggedInUsername());
            comment.setTanggalKomentar(LocalDateTime.now());
            comment.setKomentar(komentar);
            return commentRepository.save(comment);
        }
        return null;
    }

    @Transactional
    public Comment updateComment(Long id, Comment updatedComment) {
        Optional<Comment> existingComment = commentRepository.findById(id);
        if (existingComment.isPresent()) {
            Comment comment = existingComment.get();
            String loggedInUsername = getLoggedInUsername();

            // Verifikasi pengguna yang sedang login dengan pengguna yang membuat komentar
            if (comment.getNamaPengguna().equals(loggedInUsername)) {
                comment.setKomentar(updatedComment.getKomentar());
                comment.setTanggalKomentar(LocalDateTime.now());
                return commentRepository.save(comment);
            } else {
                // Jika pengguna yang sedang login tidak cocok, Anda bisa lempar exception atau return null
                throw new IllegalStateException("You can only edit your own comments.");
            }
        }
        return null;
    }
    @Transactional
    public void deleteCommentById(Long id) {
        commentRepository.deleteById(id);
    }

    @Transactional
    public void deleteCommentsByVideoId(Long videoId) {
        List<Comment> comments = commentRepository.findByVideoId(videoId);
        if (comments != null && !comments.isEmpty()) {
            commentRepository.deleteAll(comments);
        }
    }

    @Transactional
    public void deleteAllComments() {
        commentRepository.deleteAll();
    }

    private String getLoggedInUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    public void deleteCommentsByVideo(Long videoId) {
        commentRepository.deleteByVideoId(videoId);
    }

    public List<Comment> getCommentsByVideoId(Long videoId) {
        return commentRepository.findByVideoId(videoId);
    }
}
