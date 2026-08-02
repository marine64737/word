async function findAll() {
    // 1. API 주소 설정 (절대 경로 또는 상대 경로)
    const uri = "/word/api/all/shuffled";
    const listContainer = document.getElementById('word-list');

    try {
        const response = await fetch(uri,{
  headers: {
    'ngrok-skip-browser-warning': 'any'
  }
});
        if (!response.ok) {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
        }

        const res = await response.json(); // 데이터가 배열 형태라고 가정
        console.log("전체 응답:", res);
        const words = res.data;

        // 기존 내용 비우기
        listContainer.innerHTML = '';

        // 2. 데이터 반복문 돌리기
        words.forEach(word => {
            const row = document.createElement('tr');
            
            // API 구조: { kanji: "...", reading: "...", meaning: "..." }
            row.innerHTML = `
                <input type="hidden" class="row-id" value=${word.id}>
                <td style="font-size: 48px;">${word.kanji}</td>
                <td><span style="font-size: 20px;">${word.reading}</span>
                <td style="text-align: left;">${word.kormeaning}</td>
                <td style="text-align: left;">${word.meaning}</td>
                <td><button onclick="anki(this)" id="anki">암기</td>
            `;

/*             row.innerHTML = `
                <td style="font-size: 48px;">${word.kanji}</td>
                <td><span style="font-size: 20px;" class="hidden">${word.reading}</span>
                <button onclick="revealCell(this)">보기</button></td>
                <td style="text-align: left;"><span class="hidden">${word.meaning}</span>
                <button onclick="revealCell(this)">보기</button></td>
            `; */
            
            listContainer.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
        listContainer.innerHTML = '<tr><td colspan="3">불러오기 실패</td></tr>';
    }
}

async function updateWordCount() {
    const response = await fetch("/word/api/total", {
        headers: { 'ngrok-skip-browser-warning': 'any' }
    });
    const res = await response.json();
    const count = await res.data;
    document.getElementById('total-count').innerText = `총 ${count}개의 단어 등록.`;
}
/*async function passWordCount() {
    const response = await fetch("/word/passnum", {
        headers: { 'ngrok-skip-browser-warning': 'any' }
    });
    const res = await response.json();
    const count = await res.data;
    document.getElementById('pass-count').innerText = `총 ${count}개 확인.`;
}*/
async function saveWord() {
    //const uri =  "https://arguably-harmonics-swab.ngrok-free.dev/word/save";
    const uri =  "/word/api/save";
    const kanji = document.getElementById('kanji').value;
    const reading = document.getElementById('reading').value;
    const meaning = document.getElementById('meaning').value;

    if(!kanji || !reading || !meaning) {
        const msgArea = document.getElementById('message-area');
        msgArea.innerText = "모든 칸을 채워주세요!";
        msgArea.style.color = "red"; // 성공은 초록색
        
        // 3초 뒤에 메시지 사라지게 하기
        setTimeout(() => { msgArea.innerText = ""; }, 3000);
        return;
    }

    const newWord = { kanji, reading, meaning };

    try {
        const response = await fetch(uri, { // API 저장 경로에 맞게 수정
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
            body: JSON.stringify(newWord)
        });

        if (response.status === 400) {
            const errorMsg = await response.json().message;
            const msgArea = document.getElementById('message-area');
            msgArea.innerText = errorMsg;
            msgArea.style.color = "red"; // 성공은 초록색
            
            // 3초 뒤에 메시지 사라지게 하기
            setTimeout(() => { msgArea.innerText = ""; }, 3000); // "이미 등록된 단어입니다." 출력
            document.getElementById('kanji').value = '';
            document.getElementById('reading').value = '';
            document.getElementById('meaning').value = '';
            return;
        }
        
        if (response.ok) {
            //alert("저장 성공!");
            // 입력칸 비우기
            const msgArea = document.getElementById('message-area');
            msgArea.innerText = "저장 성공!";
            msgArea.style.color = "green";
            setTimeout(() => { msgArea.innerText = ""; }, 3000);
            document.getElementById('kanji').value = '';
            document.getElementById('reading').value = '';
            document.getElementById('meaning').value = '';
            updateWordCount();
        } else {
            alert("저장 실패 (서버 오류)");
        }
    } catch (e) {
        console.error("저장 중 에러:", e);
        alert("서버와 통신할 수 없습니다.");
    }
}
async function checkWord() {
    //const uri =  "/word/check";
    const kanji = document.getElementById('kanji').value;
    const reading = document.getElementById('reading').value;
    const meaning = document.getElementById('meaning').value;

    if(!kanji && !reading) {
        const msgArea = document.getElementById('message-area');
        msgArea.innerText = "단어를 입력해주세요!";
        msgArea.style.color = "red";
        setTimeout(() => { msgArea.innerText = ""; }, 3000);
        return;
    }

    const newWord = { kanji, reading, meaning };

    try {
        const response = await fetch(uri, { // API 저장 경로에 맞게 수정
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
            body: JSON.stringify(newWord)
        });
        
        if (response.ok) {
            //alert("저장 성공!");
            // 입력칸 비우기
            const res = await response.json()
            const msg = res.message;
            const msgArea = document.getElementById('message-area');
            msgArea.innerText = msg;
            msgArea.style.color = "green";
            setTimeout(() => { msgArea.innerText = ""; }, 3000);
        } else if (response.status === 400) {
            const res = await response.json();
            const errorMsg = res.message;
            const msgArea = document.getElementById('message-area');
            msgArea.innerText = errorMsg;
            msgArea.style.color = "red"; // "이미 등록된 단어입니다." 출력
            setTimeout(() => { msgArea.innerText = ""; }, 3000);
            document.getElementById('kanji').value = '';
            document.getElementById('reading').value = '';
            document.getElementById('meaning').value = '';
            return;
        }
        else {
            alert("확인 실패 (서버 오류)");
        }
    } catch (e) {
        console.error("확인 중 에러:", e);
        alert("서버와 통신할 수 없습니다.");
    }
}

async function searchWord() {
    //const uri = "https://arguably-harmonics-swab.ngrok-free.dev/word/search";
    const uri = "/word/api/search";
    const kanji = document.getElementById('search-kanji').value;
    const searchContainer = document.getElementById('search-result');
    if (!kanji) {
        const msgArea = document.getElementById('search-message');
        msgArea.innerText= "단어를 입력해주세요!";
        msgArea.stle.color = "red";
        setTimeout(() => { msgArea.innerText = ""; }, 3000);
        searchContainer.innerHTML = ``;
        return;
    }
    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
            body: JSON.stringify({ kanji: kanji })
        });
        if (response.ok) {
            const clear = document.getElementById('clear');
            const cancel = document.getElementById('cancel');
            cancel.classList.remove('hidden');
            clear.classList.remove('hidden');
            const res = await response.json();
            const words = res.data; // 데이터가 배열 형태라고 가정
            // 기존 내용 비우기
            searchContainer.innerHTML = ``;
    
            // 2. 데이터 반복문 돌리기
            words.forEach(word => {
            
            // API 구조: { kanji: "...", reading: "...", meaning: "..." }
            searchContainer.innerHTML += `
            <div class="word-edit-row">
                <input type="hidden" value="${word.id}" id="id-search">
                <input type="text" id="kanji-search" value="${word.kanji}" placeholder="한자 (Kanji)">
                <input type="text" id="reading-search" value="${word.reading}" placeholder="읽기 (Reading)">
                <input type="text" id="meaning-search" value="${word.kormeaning}" placeholder="의미 (Meaning, Kor)">
                <input type="text" id="kormeaning-search" value="${word.meaning}" placeholder="의미 (Meaning, Eng)">
                <input type="hidden" id="state-search" value="${word.state}">
                <button onclick="updateWord(this)">수정</button>
            </div>
            `;
            });
        }
        else if (response.status === 404) {
            const res = await response.json()
            const msg = res.message;
            const msgArea = document.getElementById('search-message');
            msgArea.innerText = msg;
            msgArea.style.color = "red";
            setTimeout(() => { msgArea.innerText = ""; }, 3000);
            searchContainer.innerHTML = ``;
            cancel.classList.add('hidden');
        }
        else {
            alert("확인 실패 (서버 오류)");
        }
    }
    catch (e) {
        console.error("확인 중 에러:", e);
        alert("서버와 통신할 수 없습니다.");
    }
}

async function updateWord(btn){
    //const uri = "https://arguably-harmonics-swab.ngrok-free.dev/word/update";
    const uri = "/word/api/update";
    const row = btn.parentElement; // 버튼이 속한 div를 찾음
    const inputs = row.querySelectorAll('input'); // 그 안의 모든 input 찾기
    const cancel = document.getElementById('cancel');

    const updateData = {
        id: inputs[0].value,      // hidden input
        kanji: inputs[1].value,   // 첫 번째 text
        reading: inputs[2].value, // 두 번째 text
        kormeaning: inputs[3].value,  // 세 번째 text
        meaning: inputs[4].value,
        state: inputs[5].value
    };
    const searchContainer = document.getElementById('search-result');
    const wordContainer = btn.parentElement;

    if (!updateData) {
        const msgArea = document.getElementById('search-message');
        msgArea.innerText = "다시 입력해주세요!";
        msgArea.style.color = "red";
        setTimeout(() => { msgArea.innerText = ""; }, 3000);
    }
    try{
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
            body: JSON.stringify(updateData)
        });
        if (response.ok) {
            const msgArea = document.getElementById('search-message');
            msgArea.innerText = "수정되었습니다!";
            msgArea.style.color = "green";
            setTimeout(() => { msgArea.innerText = ""; }, 3000);
            wordContainer.remove();
            if (searchContainer.querySelector('div') === null) {
                searchContainer.innerHTML = '';
                cancel.classList.add('hidden');
            }
        }
         else if (response.status === 400) {
            const res = await response.json()
            const msg = res.message;
            const msgArea = document.getElementById('search-message');
            msgArea.innerText = msg;
            msgArea.style.color = "red";
            setTimeout(() => { msgArea.innerText = ""; }, 3000);
        }
        else {
            alert("확인 실패 (서버 오류)");
        }
    }
    catch (e) {
        console.error("확인 중 에러:", e);
        alert("서버와 통신할 수 없습니다.");
    }
}
async function anki(btn){
    const uri = "/word/api/anki";
    const row = btn.closest('tr');
    const input_id = row.querySelector('.row-id');

    try{
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'any'
            },
            body: input_id.value
        });
        if (response.ok) {
            btn.classList.add('hidden');
            const msgArea = document.getElementById('search-message');
            msgArea.innerText = "암기 완료!";
            msgArea.style.color = "green";
            setTimeout(() => { msgArea.innerText = ""; }, 3000);
        }
        else {
            alert("확인 실패 (서버 오류)");
        }
    }
    catch (e) {
        console.error("확인 중 에러:", e);
        alert("서버와 통신할 수 없습니다.");
    }
}
function cancel(btn){
    const target = document.getElementById('search-result');
    target.innerHTML = ``;
    btn.classList.add('hidden');
}
function clearInput(btn){
    const target = document.getElementById('search-kanji');
    target.value = '';
    btn.classList.add('hidden');
}
function revealCell(btn) {
    // 1. 버튼 바로 앞에 있는 요소(span)를 찾음
    const target = btn.previousElementSibling;
    
    // 2. 숨김 클래스 제거
    target.classList.remove('hidden');
    
    // 3. 누른 버튼만 삭제
    btn.remove();
}
async function refresh(){
    findAll();
    window.scrollTo(0, 0);
    window.history.scrollRestoration = "manual";
}
// 실행
findAll();

//updateWordCount();
//passWordCount();
