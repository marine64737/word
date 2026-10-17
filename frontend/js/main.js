import { word } from "./word.js";
import { kanji } from "./kanji.js";
import { english } from "./english.js";

// 🗺️ 1. 숫자 모드값을 Key로 가지는 언어 지도 딕셔너리 생성
const vocaMap = {
  0: word,
  1: kanji,
  2: english,
};

const textMap = {
  0: {
    title: "일본어 단어장",
    url: "source: https://github.com/elzup/jlpt-word-list/blob/master/out/all.csv#L1",
  },
  1: {
    title: "일본어 한자 단어장",
    url: "source: https://kanjiapi.dev/#!/documentation",
  },
  2: {
    title: "영어 단어장",
    url: "source: https://github.com/dwyl/english-words -> https://github.com/tgmgroup/Word-List-from-Oxford-Longman-5000",
  },
};

// 현재 활성화된 단어장 전략 객체를 담을 포인터 변수
let currentVoca = null;

// 🎯 [기능 A] 페이지 최초 로드 시: DB에서 마지막 상태를 읽어와 복원 및 보존
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/word/api/common/getstatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: 1,
    });
    const res = await response.json();
    const lastSavedMode = res.data;

    const currentText = textMap[lastSavedMode];
    document.getElementById("title-text").innerText = currentText.title;
    document.getElementById("word-url").innerText = currentText.url;

    currentVoca = vocaMap[lastSavedMode]; // 마지막 상태로 주머니 강제 동기화
    currentVoca.init();
    currentVoca.findAll();
    currentVoca.count();
  } catch (error) {
    console.error("Fail:", error);
  }
});

// 🎯 [기능 B] 상단 토글 버튼 클릭 시: DB 상태 갱신 + 전략 통째로 스위칭
document.querySelectorAll(".word-mode").forEach((button) => {
  button.addEventListener("click", async (e) => {
    const targetMode = parseInt(e.target.getAttribute("data-mode"));
    try {
      // 스프링 부트 status 테이블 업데이트 요청 (영구 보존 트래킹)
      await fetch("/word/api/common/setstatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 1,
          status: targetMode,
        }),
      });

      const mode = parseInt(targetMode);

      const currentText = textMap[mode];
      document.getElementById("title-text").innerText = currentText.title;
      document.getElementById("word-url").innerText = currentText.url;

      currentVoca = vocaMap[mode]; // 딕셔너리 매핑으로 주머니 실시간 교체
      currentVoca.init();
      currentVoca.findAll(); // 바뀐 언어 화면 렌더링
      currentVoca.count();
    } catch (error) {
      console.error("상태 변경 실패: ", error);
    }
  });
});

// 🎯 [기능 C] 온갖 기능 버튼 클릭 시: 버튼 ID를 추출해 0.1초 만에 동적 함수 호출
// document.querySelectorAll(".voca-action").forEach((button) => {
document.addEventListener("click", (e) => {
  // const functionName = e.currentTarget.id; // 버튼의 id 추출 (예: "findAll", "anki")
  const button = e.target.closest(".voca-action");
  if (!button) return;
  const functionName = button.id;

  // 현재 활성화된 주머니 객체에 해당 이름의 함수가 있다면 조건문 없이 즉시 실행
  if (typeof currentVoca[functionName] === "function") {
    currentVoca[functionName](button); // 인자로 버튼 자신을 넘겨줌 (anki(btn) 대응)
  }
});
// });
