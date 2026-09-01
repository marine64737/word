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

    @PostMapping("/api/getstatus")
    ResponseEntity<?> getStatus(@RequestBody int id){
        int status = commonRepository.findStatusById((long) id);
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", status));
    }

    @PostMapping("/api/setstatus")
    ResponseEntity<?> setStatus(@RequestBody Common common) {
        commonRepository.updateStatusById(common.getId(), common.getStatus());
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", common));
    }
}
