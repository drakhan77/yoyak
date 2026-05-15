// script.js
function summarizeText() {
    const transcript = document.getElementById('transcript').value.trim();
    const summaryDiv = document.getElementById('summary');
    const url = document.getElementById('url').value.trim();

    if (!transcript) {
        alert('자막을 먼저 붙여넣어주세요!');
        return;
    }

    summaryDiv.innerHTML = `
        <div class="loading">
            <p>🤖 AI가 요약하고 있습니다...</p>
        </div>
    `;

    // 더 자연스럽게 요약하는 로직
    setTimeout(() => {
        let summary = '';

        if (transcript.length < 300) {
            summary = transcript;
        } else {
            // 간단하지만 좀 더 똑똑한 요약 시도
            const sentences = transcript.split(/[.!?。！？]/).filter(s => s.length > 15);
            const mainPoints = sentences.slice(0, 12);
            summary = mainPoints.join('. ') + '.';
        }

        summaryDiv.innerHTML = `
            <strong>📋 요약 결과</strong><br><br>
            ${summary}<br><br>
            <button onclick="copySummary()" style="background:#007bff; width:auto; padding:10px 20px;">
                📋 요약 복사하기
            </button>
        `;
    }, 900);
}

function copySummary() {
    const summaryDiv = document.getElementById('summary');
    const text = summaryDiv.innerText.replace('📋 요약 결과', '').trim();
    
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ 요약이 복사되었습니다!');
    });
}