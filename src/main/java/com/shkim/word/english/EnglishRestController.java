package com.shkim.word.english;

import com.shkim.word.common.APIResponse;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value = "https://kshsvr.com/")
@Slf4j
@RestController
@RequestMapping("/english")
public class EnglishRestController {
    @Autowired
    EnglishRepository englishRepository;

    @GetMapping("/api/all")
    List<english> callAll(){
        return englishRepository.findAll();
    }

    @GetMapping("/api/all/shuffled")
    ResponseEntity<?> callShuffledAll(){
        List<english> englishList;
        if (englishRepository.loopWordsNum() >= 90){
            englishList = englishRepository.findLoopShuffled();
        }
        else {
            englishList = englishRepository.findShuffled();
            englishList.forEach(english -> english.setLoop(true));
        }
        englishRepository.saveAll(englishList);
        if (englishRepository.wordsNum() == englishRepository.ankiWordsNum()) englishRepository.ankiInit();
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", englishList));
    }
    @GetMapping("/api/ankinum")
    ResponseEntity<?> ankiNum(){
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", englishRepository.ankiWordsNum()));
    }

    @GetMapping("/api/total")
    ResponseEntity<?> total(){
        return ResponseEntity.ok().body(new APIResponse<>(true, "조회 성공", englishRepository.count()));
    }

    @Transactional
    @PostMapping("/api/update")
    ResponseEntity<?> update(@RequestBody english english){
        englishRepository.save(english);
        return ResponseEntity.ok().body(new APIResponse<>(true, "수정 성공", english));
    }

    @PostMapping("/api/anki")
    ResponseEntity<?> anki(@RequestBody int id){
        english english = englishRepository.findById(id).orElseThrow();
        english.setAnki(true);
        english.setLoop(false);
        englishRepository.save(english);
        return ResponseEntity.ok().body(new APIResponse<>(true, "암기 성공", english));
    }
    @Transactional
    @PostMapping("/api/init")
    ResponseEntity<?> ankiInit(){
        englishRepository.ankiInit();
        return ResponseEntity.ok().body(new APIResponse<>(true, "암기 초기화 완료", true));
    }
    @Transactional
    @PostMapping("/api/difficult")
    ResponseEntity<?> difficult(@RequestBody int id){
        english english = englishRepository.findById(id).orElseThrow();
        english.setDifficulty(english.getDifficulty()+1);
        english.setLoop(false);
        englishRepository.save(english);
        return ResponseEntity.ok().body(new APIResponse<>(true, "어려움", english));
    }
}
