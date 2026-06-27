const GEMINI_MODEL = "Gemini 3.1 Flash Lite";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "POST 요청만 허용됩니다." });
  }

  const { studentAlias, gradeSummary, learningTraits, teacherConcern } = req.body || {};

  if (!studentAlias || !gradeSummary || !learningTraits || !teacherConcern) {
    return res.status(400).json({ success: false, error: "필수 요청 값이 누락되었습니다." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ success: false, error: "GEMINI_API_KEY 환경 변수가 설정되지 않았습니다." });
  }

  const prompt = [
    "너는 교사가 학생을 더 잘 이해하고 대화할 수 있도록 돕는 상담 전략 보조 도구다.",
    "학생을 단정적으로 판단하거나 진단하지 말고, '의지가 부족하다', '주의력 문제가 있다', '심리적 문제가 있다' 같은 표현을 피한다.",
    "상담 전략은 참고용이며 최종 판단과 실제 상담은 교사가 학생의 상황을 종합적으로 고려해 진행한다는 점을 포함한다.",
    "반드시 아래 6개 번호 형식으로 한국어로 답한다.",
    "",
    "1. 현재 상황 요약",
    "2. 학생 데이터 기반 해석",
    "3. 상담 접근 전략",
    "4. 교사가 던질 수 있는 질문 3개",
    "5. 피해야 할 말 또는 주의점",
    "6. 다음 수업에서 해볼 수 있는 작은 지원",
    "",
    "상담 참고 데이터:",
    `studentAlias: ${studentAlias}`,
    `gradeSummary: ${gradeSummary}`,
    `learningTraits: ${learningTraits}`,
    `teacherConcern: ${teacherConcern}`,
  ].join("\n");

  try {
    // .env 파일은 GitHub에 올리지 않는다.
    // Vercel 배포 시에는 Project Settings의 Environment Variables에 GEMINI_API_KEY를 등록해야 한다.
    const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const geminiData = await geminiResponse.json();
    if (!geminiResponse.ok) {
      const message = geminiData?.error?.message || "Gemini API 호출에 실패했습니다.";
      return res.status(geminiResponse.status).json({ success: false, error: message });
    }

    const result = geminiData?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n").trim();
    if (!result) {
      return res.status(502).json({ success: false, error: "Gemini 응답이 비어 있습니다." });
    }

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "서버 오류가 발생했습니다." });
  }
};
