package com.shkim.word.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class APIResponse<T> {
    private boolean success;
    private String message;
    private T data;
}