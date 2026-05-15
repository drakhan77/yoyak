// script.js - Gemini AI 연동 버전
const GEMINI_API_KEY = "AIzaSyCQEBAM9IWwNZAU9A7DZTG7rvTn2jRijJk";   // ← 따옴표 꼭 넣기!

async function summarizeText() {
    const transcript = document.getElementById('transcript').value.trim();
    const summaryDiv = document.getElementById('summary');

    if (!transcript) {
        alert('자막을 먼저 붙여넣어주세요!');
        return;
    }

    // API Key 확인
    if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 10) {
        alert("Gemini API Key를 script.js에 올바르게 입력해주세요!");
        return;
    }

    summaryDiv.innerHTML = `<p>🤖 Gemini AI가 열심히 요약하고 있습니다...</p>`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `다음 YouTube 영상 스크립트를 자연스럽고 읽기 쉽게 한국어로 요약해주세요. 
                               주요 내용과 핵심 포인트를 위주로 300~450자 정도로 정리해 주세요.\n\n${transcript}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            const summaryText = data.candidates[0].content.parts[0].text;
            
            summaryDiv.innerHTML = `
                <strong>📋 Gemini AI 요약 결과</strong><br><br>
                ${summaryText.replace(/\n/g, '<br>')}<br><br>
                <button onclick="copySummary()" style="background:#007bff; width:auto; padding:10px 20px; font-size:16px;">
                    📋 요약 복사하기
                </button>
            `;
        } else {
            throw new Error("Gemini 응답 형식 오류");
        }

    } catch (error) {
        console.error(error);
        summaryDiv.innerHTML = `
            <p style="color:red;">
                ❌ 요약 중 오류가 발생했습니다.<br><br>
                ${error.message}<br><br>
                API Key가 올바른지, 사용량 제한이 초과되지 않았는지 확인해주세요.
            </p>`;
    }
}

function copySummary() {
    const summaryDiv = document.getElementById('summary');
    let text = summaryDiv.innerText;
    text = text.replace('📋 Gemini AI 요약 결과', '').trim();
    
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ 요약 내용이 복사되었습니다!');
    });
}