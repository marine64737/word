export const english = {
  urls: {
    base_url: "/word/api/english",
    findAll_url: "/all/shuffled",
    count_url_1: "/total",
    count_url_2: "/ankinum",
    saveWord_url: "/save",
    searchWord_url: "/search",
    updateWord_url: "/update",
    anki_url: "/anki",
    difficult_url: "/difficult",
    ankiInit_url: "/init",
  },
  init() {
    const listContainer = document.getElementById("init");
    listContainer.innerHTML = "";
    listContainer.innerHTML = `
      <table border="1" style="width: 100%; border-collapse: collapse;">
          <colgroup>
              <col style="width: 300px;">
              <col style="width: auto;">
              <col style="width: 80px;">
              <col style="width: 100px;">
          </colgroup>
      <thead>
          <tr>
              <th>영어</th>
              <th>의미</th>
              <th>암기</th>
              <th>어려움</th>
          </tr>
      </thead>
      <tbody id="word-list">
      </tbody>
    `;
  },
  async findAll() {
    // 1. API 주소 설정 (절대 경로 또는 상대 경로)
    const uri = this.urls.base_url + this.urls.findAll_url;
    const listContainer = document.getElementById("word-list");

    try {
      const response = await fetch(uri, {
        headers: {
          "ngrok-skip-browser-warning": "any",
        },
      });
      if (!response.ok) {
        throw new Error("데이터를 불러오는 데 실패했습니다.");
      }

      const res = await response.json(); // 데이터가 배열 형태라고 가정
      console.log("전체 응답:", res);
      const words = res.data;

      // 기존 내용 비우기
      listContainer.innerHTML = "";

      // 2. 데이터 반복문 돌리기
      words.forEach((english) => {
        const row = document.createElement("tr");

        // API 구조: { kanji: "...", reading: "...", meaning: "..." }
        /*             row.innerHTML = `
                  <input type="hidden" class="row-id" value=${word.id}>
                  <td style="font-size: 48px;">${word.kanji}</td>
                  <td><span style="font-size: 30px;">${word.reading}</span>
                  <td style="text-align: left; font-size: 30px;">${word.kormeaning}</td>
              <!--    <td style="text-align: left;">${word.meaning}</td> -->
                  <td><button onclick="anki(this)" id="anki">암기</td>
                  <td><button onclick="difficult(this)" id="difficult">어려움</td>
              `;
  */
        row.innerHTML = `
                  <input type="hidden" class="row-id" value=${english.id}>
                  <td style="font-size: 24px;">${english.english}</td>
                  <td><span style="font-size: 24px; text-align: center;" class="hidden">${english.meaning}</span>
                  <button id = "revealCell" class="voca-action">보기</button></td>
                  <td><button id = "anki" class="voca-action">암기</td>
                  <td><button id = "difficult" class="voca-action">어려움</td>
              `;

        listContainer.appendChild(row);
      });
    } catch (error) {
      console.error("Error:", error);
      listContainer.innerHTML = '<tr><td colspan="3">불러오기 실패</td></tr>';
    }
  },

  async count() {
    const total_response = await fetch(
      this.urls.base_url + this.urls.count_url_1,
      {
        method: "GET",
      },
    );
    const anki_response = await fetch(
      this.urls.base_url + this.urls.count_url_2,
      {
        method: "GET",
      },
    );
    const tot_res = await total_response.json();
    const anki_res = await anki_response.json();
    const tot_count = await tot_res.data;
    const anki_count = await anki_res.data;
    const anki_count_floor = Math.floor((await anki_res.data) / 100) * 100;

    const percentage = Math.min(
      Math.max((anki_count / tot_count) * 100, 0),
      100,
    );

    const progressBar = document.getElementById("progress-bar");
    document.getElementById("total-count").innerText =
      `총 ${tot_count}개의 단어 등록.`;
    const currentText = document.getElementById("pass");
    // const totalText = document.getElementById('total');
    // const percentText = document.getElementById('percentage');

    // document.getElementById('total').innerText = "총 ${tot_count}개의 단어 등록.";
    // document.getElementById('pass').innerText = "총 ${anki_count}개 확인.";

    progressBar.style.width = percentage + "%"; // 바 길이 조절
    // currentText.innerText = anki_count;             // 현재 수치 텍스트
    // totalText.innerText = tot_count;                 // 전체 수치 텍스트
    // percentText.innerText = Math.round(percentage) + '%'; // 퍼센트 텍스트
    // currentText.innerText = `${anki_count_floor}개 암기 완료`;
  },
  async saveWord() {
    //const uri =  "https://arguably-harmonics-swab.ngrok-free.dev/word/save";
    const uri = this.urls.base_url + this.urls.saveWord_url;
    const kanji = document.getElementById("english").value;
    const meaning = document.getElementById("meaning").value;

    if (!english || !meaning) {
      const msgArea = document.getElementById("message-area");
      msgArea.innerText = "모든 칸을 채워주세요!";
      msgArea.style.color = "red"; // 성공은 초록색

      // 3초 뒤에 메시지 사라지게 하기
      setTimeout(() => {
        msgArea.innerText = "";
      }, 3000);
      return;
    }

    const newWord = { english, meaning };

    try {
      const response = await fetch(uri, {
        // API 저장 경로에 맞게 수정
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "any",
        },
        body: JSON.stringify(newWord),
      });

      if (response.status === 400) {
        const errorMsg = await response.json().message;
        const msgArea = document.getElementById("message-area");
        msgArea.innerText = errorMsg;
        msgArea.style.color = "red"; // 성공은 초록색

        // 3초 뒤에 메시지 사라지게 하기
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000); // "이미 등록된 단어입니다." 출력
        document.getElementById("english").value = "";
        document.getElementById("meaning").value = "";
        return;
      }

      if (response.ok) {
        //alert("저장 성공!");
        // 입력칸 비우기
        const msgArea = document.getElementById("message-area");
        msgArea.innerText = "저장 성공!";
        msgArea.style.color = "green";
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000);
        document.getElementById("kanji").value = "";
        document.getElementById("reading").value = "";
        document.getElementById("meaning").value = "";
        updateWordCount();
      } else {
        alert("저장 실패 (서버 오류)");
      }
    } catch (e) {
      console.error("저장 중 에러:", e);
      alert("서버와 통신할 수 없습니다.");
    }
  },
  async checkWord() {
    //const uri =  "/word/check";
    const kanji = document.getElementById("english").value;
    const meaning = document.getElementById("meaning").value;

    if (!kanji && !reading) {
      const msgArea = document.getElementById("message-area");
      msgArea.innerText = "단어를 입력해주세요!";
      msgArea.style.color = "red";
      setTimeout(() => {
        msgArea.innerText = "";
      }, 3000);
      return;
    }

    const newWord = { english, meaning };

    try {
      const response = await fetch(uri, {
        // API 저장 경로에 맞게 수정
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "any",
        },
        body: JSON.stringify(newWord),
      });

      if (response.ok) {
        //alert("저장 성공!");
        // 입력칸 비우기
        const res = await response.json();
        const msg = res.message;
        const msgArea = document.getElementById("message-area");
        msgArea.innerText = msg;
        msgArea.style.color = "green";
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000);
      } else if (response.status === 400) {
        const res = await response.json();
        const errorMsg = res.message;
        const msgArea = document.getElementById("message-area");
        msgArea.innerText = errorMsg;
        msgArea.style.color = "red"; // "이미 등록된 단어입니다." 출력
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000);
        document.getElementById("kanji").value = "";
        document.getElementById("reading").value = "";
        document.getElementById("meaning").value = "";
        return;
      } else {
        alert("확인 실패 (서버 오류)");
      }
    } catch (e) {
      console.error("확인 중 에러:", e);
      alert("서버와 통신할 수 없습니다.");
    }
  },

  async searchWord() {
    //const uri = "https://arguably-harmonics-swab.ngrok-free.dev/word/search";
    const uri = this.urls.base_url + this.urls.searchWord_url;
    const kanji = document.getElementById("search-english").value;
    const searchContainer = document.getElementById("search-result");
    const cancel = document.getElementById("cancel");
    if (!kanji) {
      const msgArea = document.getElementById("search-message");
      msgArea.innerText = "단어를 입력해주세요!";
      msgArea.stle.color = "red";
      setTimeout(() => {
        msgArea.innerText = "";
      }, 3000);
      searchContainer.innerHTML = ``;
      return;
    }
    try {
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "any",
        },
        body: JSON.stringify({ kanji: kanji }),
      });
      if (response.ok) {
        const clear = document.getElementById("clear");
        cancel.classList.remove("hidden");
        clear.classList.remove("hidden");
        const res = await response.json();
        const words = res.data; // 데이터가 배열 형태라고 가정
        // 기존 내용 비우기
        searchContainer.innerHTML = ``;

        // 2. 데이터 반복문 돌리기
        words.forEach((english) => {
          // API 구조: { kanji: "...", reading: "...", meaning: "..." }
          searchContainer.innerHTML += `
              <div class="word-edit-row">
                  <input type="hidden" value="${english.id}" id="id-search">
                  <input type="text" id="kanji-search" value="${english.english}" placeholder="한자 (Kanji)">
                  <input type="text" id="reading-search" value="${english.reading}" placeholder="읽기 (Reading)">
                  <input type="text" id="kormeaning-search" value="${english.meaning}" placeholder="의미 (Meaning, Eng)">
                  <input type="hidden" id="anki-search" value="${english.anki}">
                  <input type="hidden" id="loop" value="${english.loop}">
                  <input type="hidden" id="dificulty" value="${english.difficulty}">
                  <button onclick="updateWord(this)">수정</button>
              </div>
              `;
        });
      } else if (response.status === 404) {
        const res = await response.json();
        const msg = res.message;
        const msgArea = document.getElementById("search-message");
        msgArea.innerText = msg;
        msgArea.style.color = "red";
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000);
        searchContainer.innerHTML = ``;
        if (!cancel.classList.contains("hidden"))
          cancel.classList.add("hidden");
      } else {
        alert("확인 실패 (서버 오류)");
      }
    } catch (e) {
      console.error("확인 중 에러:", e);
      alert("서버와 통신할 수 없습니다.");
    }
  },

  async updateWord(btn) {
    //const uri = "https://arguably-harmonics-swab.ngrok-free.dev/word/update";
    const uri = this.urls.base_url + this.urls.updateWord_url;
    const row = btn.parentElement; // 버튼이 속한 div를 찾음
    const inputs = row.querySelectorAll("input"); // 그 안의 모든 input 찾기
    const cancel = document.getElementById("cancel");

    const updateData = {
      id: inputs[0].value, // hidden input
      english: inputs[1].value, // 첫 번째 text
      meaning: inputs[2].value,
      anki: inputs[3].value,
      loop: inputs[4].value,
      difficulty: inputs[5].value,
    };
    const searchContainer = document.getElementById("search-result");
    const wordContainer = btn.parentElement;

    if (!updateData) {
      const msgArea = document.getElementById("search-message");
      msgArea.innerText = "다시 입력해주세요!";
      msgArea.style.color = "red";
      setTimeout(() => {
        msgArea.innerText = "";
      }, 3000);
    }
    try {
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "any",
        },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        const msgArea = document.getElementById("search-message");
        msgArea.innerText = "수정되었습니다!";
        msgArea.style.color = "green";
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000);
        wordContainer.remove();
        if (searchContainer.querySelector("div") === null) {
          searchContainer.innerHTML = "";
          cancel.classList.add("hidden");
        }
      } else if (response.status === 400) {
        const res = await response.json();
        const msg = res.message;
        const msgArea = document.getElementById("search-message");
        msgArea.innerText = msg;
        msgArea.style.color = "red";
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000);
      } else {
        alert("확인 실패 (서버 오류)");
      }
    } catch (e) {
      console.error("확인 중 에러:", e);
      alert("서버와 통신할 수 없습니다.");
    }
  },
  async anki(btn) {
    const uri = this.urls.base_url + this.urls.anki_url;
    const row = btn.closest("tr");
    const input_id = row.querySelector(".row-id");

    try {
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "any",
        },
        body: input_id.value,
      });
      if (response.ok) {
        // btn.classList.add('hidden');
        const parent = btn.closest("tr");
        const buttons = parent.querySelectorAll("button");
        buttons.forEach((button) => button.classList.add("hidden"));
        const msgArea = document.getElementById("search-message");
        msgArea.innerText = "암기 완료!";
        msgArea.style.color = "green";
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000);
        this.count();
      } else {
        alert("확인 실패 (서버 오류)");
      }
    } catch (e) {
      console.error("확인 중 에러:", e);
      alert("서버와 통신할 수 없습니다.");
    }
  },
  // anki(btn) {
  //   const uri = this.urls.base_url + this.urls.anki_url;
  //   const row = btn.closest("tr");
  //   const input_id = row.querySelector(".row-id");

  //   try {
  //     if (true) {
  //       // btn.classList.add('hidden');
  //       const parent = btn.closest("tr");
  //       const buttons = parent.querySelectorAll("button");
  //       buttons.forEach((button) => button.classList.add("hidden"));
  //       const msgArea = document.getElementById("search-message");
  //       msgArea.innerText = "암기 완료!";
  //       msgArea.style.color = "green";
  //       setTimeout(() => {
  //         msgArea.innerText = "";
  //       }, 3000);
  //       this.count();
  //     } else {
  //       alert("확인 실패 (서버 오류)");
  //     }
  //   } catch (e) {
  //     console.error("확인 중 에러:", e);
  //     alert("서버와 통신할 수 없습니다.");
  //   }
  // },
  async difficult(btn) {
    const uri = this.urls.base_url + this.urls.difficult_url;
    const row = btn.closest("tr");
    const input_id = row.querySelector(".row-id");

    try {
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "any",
        },
        body: input_id.value,
      });
      if (response.ok) {
        // btn.classList.add('hidden');
        const parent = btn.closest("tr");
        const buttons = parent.querySelectorAll("button");
        buttons.forEach((button) => button.classList.add("hidden"));
        const msgArea = document.getElementById("search-message");
        msgArea.innerText = "어려우니까 나중에!";
        msgArea.style.color = "red";
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000);
        this.count();
      } else {
        alert("확인 실패 (서버 오류)");
      }
    } catch (e) {
      console.error("확인 중 에러:", e);
      alert("서버와 통신할 수 없습니다.");
    }
  },
  // async difficult(btn) {
  //   const uri = this.urls.base_url + this.urls.difficult_url;
  //   const row = btn.closest("tr");
  //   const input_id = row.querySelector(".row-id");

  //   try {
  //     if (true) {
  //       // btn.classList.add('hidden');
  //       const parent = btn.closest("tr");
  //       const buttons = parent.querySelectorAll("button");
  //       buttons.forEach((button) => button.classList.add("hidden"));
  //       const msgArea = document.getElementById("search-message");
  //       msgArea.innerText = "어려우니까 나중에!";
  //       msgArea.style.color = "red";
  //       setTimeout(() => {
  //         msgArea.innerText = "";
  //       }, 3000);
  //       this.count();
  //     } else {
  //       alert("확인 실패 (서버 오류)");
  //     }
  //   } catch (e) {
  //     console.error("확인 중 에러:", e);
  //     alert("서버와 통신할 수 없습니다.");
  //   }
  // },
  async ankiInit(btn) {
    if (!confirm("암기 상태를 초기화하시겠습니까?")) return;
    const uri = this.urls.base_url + this.urls.ankiInit_url;

    try {
      const response = await fetch(uri, {
        method: "POST",
      });
      if (response.ok) {
        // btn.classList.add('hidden');
        const msgArea = document.getElementById("search-message");
        msgArea.innerText = "초기화 완료!";
        msgArea.style.color = "green";
        alert("초기화되었습니다.");
        setTimeout(() => {
          msgArea.innerText = "";
        }, 3000);
        this.count();
      } else {
        alert("확인 실패 (서버 오류)");
      }
    } catch (e) {
      console.error("확인 중 에러:", e);
      alert("서버와 통신할 수 없습니다.");
    }
  },
  cancel(btn) {
    const target = document.getElementById("search-result");
    target.innerHTML = ``;
    btn.classList.add("hidden");
  },
  clearInput(btn) {
    const target = document.getElementById("search-kanji");
    target.value = "";
  },
  revealCell(btn) {
    // 1. 버튼 바로 앞에 있는 요소(span)를 찾음
    const target = btn.previousElementSibling;

    // 2. 숨김 클래스 제거
    target?.classList.remove("hidden");

    // 3. 누른 버튼만 삭제
    btn.remove();
  },
  async refresh() {
    this.init();
    await this.findAll();
    window.scrollTo(0, 0);
    window.history.scrollRestoration = "manual";
    this.count();
  },
  async refresh() {
    this.init();
    await this.findAll();
    window.scrollTo(0, 0);
    window.history.scrollRestoration = "manual";
    this.count();
    const revealAllBtn = document.getElementById("revealAll");
    if (revealAllBtn) {
      revealAllBtn.classList.remove("hidden");
    }
  },
  revealAll(btn_self) {
    // 1. 아직 숨겨져 있는 모든 span 태그의 hidden 클래스 제거
    const hiddenSpans = document.querySelectorAll("span.hidden");
    hiddenSpans.forEach((span) => span.classList.remove("hidden"));

    // 2. id가 revealCell인 모든 보기 버튼을 찾아 한 번에 삭제
    const revealButtons = document.querySelectorAll(".btn-reveal");
    revealButtons.forEach((btn) => btn.classList.add("hidden"));

    btn_self.classList.add("hidden");
  },
};
