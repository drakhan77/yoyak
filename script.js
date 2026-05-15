function summarizeText() {
    const transcript = document.getElementById('transcript').value.trim();
    const summaryDiv = document.getElementById('summary');
    const statusDiv = document.createElement('div');
    
    if (!transcript) {
        alert('자막을 먼저 붙여넣어주세요!');
        return;
    }

    summaryDiv.innerHTML = '<p>요약 중입니다... 잠시만 기다려주세요.</p>';

    // 간단한 규칙 기반 요약 (나중에 Grok, Gemini, GPT 등으로 교체 가능)
    const sentences = transcript.split(/[.!?]/).filter(s => s.length > 10);
    const summary = sentences.slice(0, 15).join('. ') + '...';

    setTimeout(() => {
        summaryDiv.innerHTML = `
            <strong>요약 결과</strong><br><br>
            ${summary}<br><br>
            <small>※ 현재는 간단 규칙 기반 요약입니다.<br>
            나중에 AI API(Grok, Gemini 등)를 연결하면 훨씬 자연스럽게 요약됩니다.</small>
        `;
    }, 800);
}