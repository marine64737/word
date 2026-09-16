package com.shkim.word.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(value = "https://kshsvr.com/")
@Slf4j
@RestController
@RequestMapping("/common")
public class CommonRestController {
    @Autowired
    CommonRepository commonRepository;

    @PostMapping("/getstatus")
    ResponseEntity<?> getStatus(@RequestBody int id){
        int status = commonRepository.findStatusById((long) id);
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", status));
    }

    @PostMapping("/setstatus")
    ResponseEntity<?> setStatus(@RequestBody CommonStatusDTO common) {
        commonRepository.updateStatusById(common.getId(), common.getStatus());
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", common));
    }

    @PostMapping("/getjlpt")
    ResponseEntity<?> getJlpt(@RequestBody int id){
        int jlpt = commonRepository.findJlptById((long) id);
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", jlpt));
    }

    @PostMapping("/setjlpt")
    ResponseEntity<?> setJlpt(@RequestBody CommonKanjiDTO common) {
        commonRepository.updateJlptById(common.getId(), common.getJlpt());
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", common));
    }

    @PostMapping("/getgrade")
    ResponseEntity<?> getGrade(@RequestBody int id){
        int grade = commonRepository.findGradeById((long) id);
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", grade));
    }

    @PostMapping("/setgrade")
    ResponseEntity<?> setGrade(@RequestBody CommonGradeDTO common) {
        commonRepository.updateGradeById(common.getId(), common.getGrade());
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", common));
    }
}
