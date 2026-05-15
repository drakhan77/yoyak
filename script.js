// script.js - Gemini AI 연동 버전
const GEMINI_API_KEY = "AIzaSyCQEBAM9IWwNZAU9A7DZTG7rvTn2jRijJk";   // ← 반드시 변경!

async function summarizeText() {
    const transcript = document.getElementById('transcript').value.trim();
    const summaryDiv = document.getElementById('summary');

    if (!transcript) {
        alert('자막을 먼저 붙여넣어주세요!');
        return;
    }

    if (GEMINI_API_KEY.includes("여기에")) {
        alert("Gemini API Key를 script.js에 먼저 넣어주세요!");
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
                        text: `다음 YouTube 영상 스크립트를 자연스럽고 읽기 쉽게 한국어로 요약해주세요. 주요 내용 위주로 300~400자 정도로 정리해 주세요.\n\n${transcript}`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const summaryText = data.candidates[0].content.parts[0].text;
            
            summaryDiv.innerHTML = `
                <strong>📋 Gemini AI 요약 결과</strong><br><br>
                ${summaryText.replace(/\n/g, '<br>')}<br><br>
                <button onclick="copySummary()" style="background:#007bff; width:auto; padding:10px 20px; font-size:16px;">
                    📋 요약 복사하기
                </button>
            `;
        } else {
            throw new Error("응답 처리 실패");
        }

    } catch (error) {
        console.error(error);
        summaryDiv.innerHTML = `<p style="color:red;">❌ 요약 중 오류가 발생했습니다.<br>API Key를 확인하거나 잠시 후 다시 시도해주세요.</p>`;
    }
}

function copySummary() {
    const summaryDiv = document.getElementById('summary');
    const text = summaryDiv.innerText.replace('📋 Gemini AI 요약 결과', '').trim();
    
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ 요약 내용이 복사되었습니다!');
    });
}