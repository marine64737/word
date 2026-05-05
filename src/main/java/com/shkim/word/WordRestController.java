package com.shkim.word;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
public class WordRestController {
    @Autowired
    WordRepository wordRepository;

    @GetMapping("/word/all")
    List<Word> callAll(){
        return wordRepository.findAll();
    }

    @GetMapping("/word/all/shuffled")
    ResponseEntity<?> callShuffledAll(){
//        List<Integer> idList = wordRepository.findIds();
//        Collections.shuffle(idList);
//        List<Integer> targetIds = idList.stream().limit(20).collect(Collectors.toList());
//
//        List<Word> words = wordRepository.findAllById(targetIds);
//
//        Collections.shuffle(words);
//        return ResponseEntity.ok().body(new APIResponse<>(true, "success", words));
        return ResponseEntity.ok().body(new APIResponse<>(true, "success", wordRepository.findShuffled()));
    }
    @PostMapping("/word/check")
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
    @PostMapping("/word/save")
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

    @GetMapping("/word/total")
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
    @PostMapping("/word/search")
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
    @PostMapping("/word/update")
    ResponseEntity<?> update(@RequestBody Word word){
        wordRepository.save(word);
        return ResponseEntity.ok().body(new APIResponse<>(true, "수정 성공", word));
    }
}
