// script.js - Gemini AI 연동 (오류 디버깅 버전)
const GEMINI_API_KEY = "AIzaSyCQEBAM9IWwNZAU9A7DZTG7rvTn2jRijJk"; 

async function summarizeText() {
    const transcript = document.getElementById('transcript').value.trim();
    const summaryDiv = document.getElementById('summary');

    if (!transcript) {
        alert('자막을 먼저 붙여넣어주세요!');
        return;
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 30) {
        alert("API Key가 올바르게 입력되지 않았습니다!");
        return;
    }

    summaryDiv.innerHTML = `<p>🤖 Gemini AI 연결 중...</p>`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `다음 YouTube 영상 스크립트를 자연스럽고 읽기 쉽게 한국어로 요약해주세요. 
                                   주요 내용 위주로 300~400자 정도로 정리해 주세요.\n\n${transcript}`
                        }]
                    }]
                })
            }
        );

        console.log("Response Status:", response.status);  // 디버깅용

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Gemini Response:", data);  // 디버깅용

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const summaryText = data.candidates[0].content.parts[0].text;
            
            summaryDiv.innerHTML = `
                <strong>📋 Gemini AI 요약 결과</strong><br><br>
                ${summaryText.replace(/\n/g, '<br>')}<br><br>
                <button onclick="copySummary()" style="background:#007bff; padding:10px 20px;">📋 요약 복사하기</button>
            `;
        } else {
            throw new Error("Gemini 응답에 요약 내용이 없습니다.");
        }

    } catch (error) {
        console.error("전체 오류:", error);
        summaryDiv.innerHTML = `
            <p style="color:red;">
                ❌ 요약 실패<br><br>
                ${error.message}<br><br>
                <small>브라우저 F12 → Console 탭을 열고 오류 메시지를 알려주세요.</small>
            </p>`;
    }
}

function copySummary() {
    const summaryDiv = document.getElementById('summary');
    let text = summaryDiv.innerText.replace('📋 Gemini AI 요약 결과', '').trim();
    navigator.clipboard.writeText(text).then(() => alert('✅ 복사되었습니다!'));
}