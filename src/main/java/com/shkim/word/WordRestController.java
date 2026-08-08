package com.shkim.word;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(value = "https://kshsvr.com/")
@Slf4j
@RestController
public class WordRestController {
    @Autowired
    WordRepository wordRepository;

    @GetMapping("/api/all")
    List<Word> callAll(){
        return wordRepository.findAll();
    }

    @GetMapping("/api/all/shuffled")
    ResponseEntity<?> callShuffledAll(){
        List<Word> wordList;
        if (wordRepository.loopWordsNum() >= 90){
            wordList = wordRepository.findLoopShuffled();
        }
        else {
            wordList = wordRepository.findShuffled();
            wordList.forEach(word -> word.setLoop(true));
        }
        wordRepository.saveAll(wordList);
        if (wordRepository.wordsNum() == wordRepository.ankiWordsNum()) wordRepository.ankiInit();
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", wordList));
    }
//    @GetMapping("/api/passnum")
//    ResponseEntity<?> passNum(){
//        return ResponseEntity.ok().body(new APIResponse<>(true, "success", wordRepository.passedWordsNum()));
//    }
    @GetMapping("/api/ankinum")
    ResponseEntity<?> ankiNum(){
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", wordRepository.ankiWordsNum()));
    }
    @PostMapping("/api/check")
    ResponseEntity<?> checkWord(@RequestBody Word word){
        boolean isDuplicate;

        if (word.getKanji() != null) {
            isDuplicate = wordRepository.existsByKanjiContaining(word.getKanji());
        }
        else if (word.getKanji() == null || word.getKanji().isEmpty()) {
            // 한자가 없는 경우 읽기만 체크
            isDuplicate = wordRepository.existsByKanjiIsNullAndReading(word.getReading());
        } else {
            // 한자와 읽기 세트가 있는지 체크
            isDuplicate = wordRepository.existsByKanjiAndReading(word.getKanji(), word.getReading());
        }

        if (isDuplicate) {
            return ResponseEntity.badRequest().body(new APIResponse<>(false, "이미 등록된 단어입니다.", null));
        }

        return ResponseEntity.ok().body(new APIResponse<>(false, "등록되지 않은 단어입니다.", null));
    }

    @Transactional
    @PostMapping("/api/save")
    ResponseEntity<?> saveWord(@RequestBody Word word){

        boolean isDuplicate;

        if (word.getKanji() == null || word.getKanji().isEmpty()) {
            // 한자가 없는 경우 읽기만 체크
            isDuplicate = wordRepository.existsByKanjiIsNullAndReading(word.getReading());
        } else {
            // 한자와 읽기 세트가 있는지 체크
            isDuplicate = wordRepository.existsByKanjiAndReading(word.getKanji(), word.getReading());
        }

        if (isDuplicate) {
            return ResponseEntity.badRequest().body(new APIResponse<>(false, "이미 존재하는 단어입니다.", null));
        }

        wordRepository.save(word);
        return ResponseEntity.ok().body(new APIResponse<>(true, "저장 성공", word));
    }

    @GetMapping("/api/total")
    ResponseEntity<?> total(){
        return ResponseEntity.ok().body(new APIResponse<>(true, "조회 성공", wordRepository.count()));
    }

//    @PostMapping("/word/search")
//    ResponseEntity<?> search(@RequestBody String kanji){
//        List<Word> words = wordRepository.findByKanjiContaining(kanji);
//        for (Word word: words) System.out.print(words);
//        return (words == null)? ResponseEntity.badRequest().body("해당하는 단어가 없습니다.") :
//                ResponseEntity.ok(words);
//    }
    @PostMapping("/api/search")
    public ResponseEntity<?> search(@RequestBody Map<String, String> payload) {
        String kanji = payload.get("kanji"); // JSON에서 "kanji" 키의 값만 추출
        List<Word> words = wordRepository.findByKanjiContaining(kanji);

        // 리스트가 null이거나 비어있는지 확인
        if (words == null || words.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new APIResponse<>(false, "해당하는 단어가 없습니다.", null));
        }
        return ResponseEntity.ok().body(new APIResponse<>(true, "조회 성공", words));
    }

    @Transactional
    @PostMapping("/api/update")
    ResponseEntity<?> update(@RequestBody Word word){
        wordRepository.save(word);
        return ResponseEntity.ok().body(new APIResponse<>(true, "수정 성공", word));
    }

    @PostMapping("/api/anki")
    ResponseEntity<?> anki(@RequestBody int id){
        Word word = wordRepository.findById(id).orElseThrow();
        word.setAnki(true);
        word.setLoop(false);
        wordRepository.save(word);
        return ResponseEntity.ok().body(new APIResponse<>(true, "암기 성공", word));
    }
    @Transactional
    @PostMapping("/word/init")
    ResponseEntity<?> ankiInit(){
        wordRepository.ankiInit();
        return ResponseEntity.ok().body(new APIResponse<>(true, "암기 초기화 완료", true));
    }
}
