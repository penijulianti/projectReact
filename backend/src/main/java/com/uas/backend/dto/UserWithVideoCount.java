package com.uas.backend.dto;

public class UserWithVideoCount {
    private Long id;
    private String name;
    private String email;
    private long videoCount;

    // Constructor
    public UserWithVideoCount(Long id, String name, String email, long videoCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.videoCount = videoCount;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getVideoCount() {
        return videoCount;
    }

    public void setVideoCount(long videoCount) {
        this.videoCount = videoCount;
    }
}

