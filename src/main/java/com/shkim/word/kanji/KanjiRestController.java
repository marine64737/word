package com.shkim.word.kanji;

import com.shkim.word.common.APIResponse;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(value = "https://kshsvr.com/")
@Slf4j
@RestController
@RequestMapping("/jpkanji")
public class KanjiRestController {
    @Autowired
    KanjiRepository kanjiRepository;

//    @GetMapping("/all")
//    List<Kanji> callAll(){
//        return kanjiRepository.findAll();
//    }

    @GetMapping("/all/shuffled")
    ResponseEntity<?> callShuffledAll(){
        List<Kanji> wordList;
        if (kanjiRepository.loopWordsNum() >= 90){
            wordList = kanjiRepository.findLoopShuffled();
        }
        else {
            wordList = kanjiRepository.findShuffled();
            wordList.forEach(word -> word.setLoop(true));
        }
        kanjiRepository.saveAll(wordList);
        if (kanjiRepository.wordsNum() == kanjiRepository.ankiWordsNum()) kanjiRepository.ankiInit();
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", wordList));
    }
    @GetMapping("/ankinum")
    ResponseEntity<?> ankiNum(){
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", kanjiRepository.ankiWordsNum()));
    }
    @GetMapping("/total")
    ResponseEntity<?> total(){
        return ResponseEntity.ok().body(new APIResponse<>(true, "조회 성공", kanjiRepository.count()));
    }

    @Transactional
    @PostMapping("/update")
    ResponseEntity<?> update(@RequestBody Kanji word){
        kanjiRepository.save(word);
        return ResponseEntity.ok().body(new APIResponse<>(true, "수정 성공", word));
    }

    @PostMapping("/anki")
    ResponseEntity<?> anki(@RequestBody int id){
        Kanji word = kanjiRepository.findById(id).orElseThrow();
        word.setAnki(true);
        word.setLoop(false);
        kanjiRepository.save(word);
        return ResponseEntity.ok().body(new APIResponse<>(true, "암기 성공", word));
    }
    @Transactional
    @PostMapping("/init")
    ResponseEntity<?> ankiInit(){
        kanjiRepository.ankiInit();
        return ResponseEntity.ok().body(new APIResponse<>(true, "암기 초기화 완료", true));
    }
    @Transactional
    @PostMapping("/difficult")
    ResponseEntity<?> difficult(@RequestBody int id){
        Kanji word = kanjiRepository.findById(id).orElseThrow();
        word.setDifficulty(word.getDifficulty()+1);
        word.setLoop(false);
        kanjiRepository.save(word);
        return ResponseEntity.ok().body(new APIResponse<>(true, "어려움", word));
    }
}
