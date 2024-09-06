package com.uas.backend.controller;

import com.uas.backend.model.Comment;
import com.uas.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/add")
    public ResponseEntity<Comment> addComment(@RequestParam Long videoId,
                                              @RequestParam String komentar) {
        Comment comment = commentService.addComment(videoId,komentar);
        if (comment != null) {
            return ResponseEntity.ok(comment);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/by-video/{videoId}")
    public ResponseEntity<List<Comment>> getCommentsByVideoId(@PathVariable Long videoId) {
        List<Comment> comments = commentService.getCommentsByVideoId(videoId);
        if (comments != null && !comments.isEmpty()) {
            return ResponseEntity.ok(comments);
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> updateComment(@PathVariable Long id, @RequestBody Comment updatedComment) {
        try {
            Comment comment = commentService.updateComment(id, updatedComment);
            if (comment != null) {
                return ResponseEntity.ok("Comment updated successfully.");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to edit this comment.");
        }
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok("Comment deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting comment.");
        }
    }

    @DeleteMapping("/delete-by-video/{videoId}")
    public ResponseEntity<String> deleteCommentsByVideo(@PathVariable Long videoId) {
        try {
            commentService.deleteCommentsByVideo(videoId);
            return ResponseEntity.ok("Comments deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting comments.");
        }
    }


    @DeleteMapping("/deleteAll")
    public ResponseEntity<String> deleteAllComments() {
        try {
            commentService.deleteAllComments();
            return ResponseEntity.ok("All Comment deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found.");
        }
    }
}
