const USERS = [
  { id: "admin", password: "2026", role: "admin", name: "관리자" },
  { id: "10101", password: "1234", role: "student", studentId: "10101" },
  { id: "10102", password: "1234", role: "student", studentId: "10102" },
  { id: "10103", password: "1234", role: "student", studentId: "10103" },
];

const STUDENTS = [
  {
    id: "10101",
    alias: "학생 A",
    name: "김코딩",
    photo: "assets/10101_김코딩.jpg",
    grades: {
      "정보 수행평가": "A",
      "팀 프로젝트": "92점",
      "알고리즘 퀴즈": "88점",
      "수업 참여도": "상",
    },
    gradeSummary: "평가 결과는 전반적으로 우수하며 팀 프로젝트와 알고리즘 퀴즈에서 안정적인 성취를 보임",
    traits: [
      "문제 해결 과정을 차분하게 설명합니다.",
      "새 도구를 시도하고 기록을 꼼꼼하게 남깁니다.",
      "제출 전 확인 습관을 연습하면 좋습니다.",
    ],
    learningTraits: "문제 해결 과정 설명이 차분하고 새 도구 탐색에 적극적이나 제출 전 확인 습관은 더 연습이 필요함",
    teacherMemo: "프로젝트 구조 이해가 빠르며 더 깊은 질문을 통해 확장하려는 시도가 좋습니다.",
  },
  {
    id: "10102",
    alias: "학생 B",
    name: "박개발",
    photo: "assets/10102_박개발.jpg",
    grades: {
      "정보 수행평가": "B+",
      "팀 프로젝트": "86점",
      "알고리즘 퀴즈": "91점",
      "수업 참여도": "중상",
    },
    gradeSummary: "평가 결과는 중상 수준이며 퀴즈 성취가 좋고 프로젝트 완성도는 보완 여지가 있음",
    traits: [
      "작업 중 역할 부담감을 느낄 때가 있습니다.",
      "UI 수정 아이디어를 자주 제안합니다.",
      "프로젝트 범위를 작게 나누는 연습이 필요합니다.",
    ],
    learningTraits: "아이디어 제안은 활발하지만 작업 범위를 나누고 역할 부담을 조절하는 데 도움이 필요함",
    teacherMemo: "기능 구현 의욕이 높고 오류가 날 때 원인을 따라가려는 시도가 좋습니다.",
  },
  {
    id: "10103",
    alias: "학생 C",
    name: "이교사",
    photo: "assets/10103_이교사.jpg",
    grades: {
      "정보 수행평가": "A-",
      "팀 프로젝트": "89점",
      "알고리즘 퀴즈": "95점",
      "수업 참여도": "상",
    },
    gradeSummary: "평가 결과는 우수하며 알고리즘 이해가 강점이고 프로젝트 결과물도 안정적임",
    traits: [
      "학습 내용을 자기 언어로 정리합니다.",
      "개선할 지점을 발견하면 근거를 함께 제시합니다.",
      "코드 주석을 더 구체적으로 쓰면 좋습니다.",
    ],
    learningTraits: "학습 내용을 자기 언어로 정리하고 개선 근거를 제시하는 강점이 있으며 코드 설명을 더 구체화하면 좋음",
    teacherMemo: "질문의 초점이 좋고 개선 방향을 논의하는 태도가 긍정적입니다.",
  },
];

const loginForm = document.querySelector("#loginForm");
const userIdInput = document.querySelector("#userId");
const passwordInput = document.querySelector("#password");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const loginView = document.querySelector("#loginView");
const studentView = document.querySelector("#studentView");
const adminView = document.querySelector("#adminView");

let currentUser = null;
let selectedCounselingStudent = null;

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = userIdInput.value.trim();
  const password = passwordInput.value;
  const user = USERS.find((item) => item.id === id && item.password === password);

  if (!user) {
    loginMessage.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  currentUser = user;
  loginMessage.textContent = "";
  loginForm.reset();

  if (user.role === "admin") {
    renderAdminDashboard();
  } else {
    const student = STUDENTS.find((item) => item.id === user.studentId);
    renderStudentPage(student);
  }
});

logoutButton.addEventListener("click", () => {
  currentUser = null;
  selectedCounselingStudent = null;
  showOnly(loginView);
  logoutButton.classList.add("hidden");
  userIdInput.focus();
});

adminView.addEventListener("click", (event) => {
  const selectButton = event.target.closest(".counseling-select-button");
  if (selectButton) {
    selectedCounselingStudent = STUDENTS.find((student) => student.id === selectButton.dataset.studentId);
    updateCounselingPanel();
    document.querySelector("#counselingPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (event.target.closest("#requestCounselingButton")) {
    requestCounselingStrategy();
  }
});

adminView.addEventListener("input", (event) => {
  if (event.target.matches("#teacherConcern")) {
    updateCounselingPreview();
  }
});

function showOnly(targetView) {
  [loginView, studentView, adminView].forEach((view) => view.classList.add("hidden"));
  targetView.classList.remove("hidden");
}

function renderStudentPage(student) {
  if (!student) {
    loginMessage.textContent = "학생 정보를 찾을 수 없습니다.";
    showOnly(loginView);
    return;
  }

  studentView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Student</p>
        <h2>${student.name} 학생 페이지</h2>
        <p>로그인한 학생의 학습 현황을 확인합니다.</p>
      </div>
    </div>

    <div class="student-layout">
      <article class="student-profile">
        <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
        <div class="profile-body">
          <h3>${student.name}</h3>
          <p class="student-number">학번 ${student.id}</p>
          <div class="tag-row" aria-label="학습 키워드">
            <span class="tag">정보</span>
            <span class="tag">프로젝트</span>
          </div>
        </div>
      </article>

      <div class="content-stack">
        ${renderGrades(student.grades, false, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
      </div>
    </div>
  `;

  showOnly(studentView);
  logoutButton.classList.remove("hidden");
}

function renderAdminDashboard() {
  selectedCounselingStudent = null;
  adminView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Admin</p>
        <h2>관리자 대시보드</h2>
        <p>학생 3명의 학습 현황을 한 화면에서 비교합니다.</p>
      </div>
    </div>

    ${renderCounselingPanel()}

    <section class="admin-grid" aria-label="전체 학생 정보">
      ${STUDENTS.map(renderStudentCard).join("")}
    </section>
  `;

  showOnly(adminView);
  logoutButton.classList.remove("hidden");
}

function renderStudentCard(student) {
  return `
    <article class="student-card">
      <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
      <div class="student-card-body">
        <h3>${student.name}</h3>
        <p class="student-number">학번 ${student.id}</p>
        <button class="text-button counseling-select-button" type="button" data-student-id="${student.id}">
          상담 전략 요청
        </button>
        ${renderGrades(student.grades, true, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
      </div>
    </article>
  `;
}

function renderCounselingPanel() {
  return `
    <section id="counselingPanel" class="counseling-panel" aria-labelledby="counselingTitle">
      <div class="section-title">
        <div>
          <p class="eyebrow">Gemini Assistant</p>
          <h3 id="counselingTitle">AI 학생 상담 전략 도우미</h3>
        </div>
      </div>

      <div class="counseling-selected" id="counselingSelected">
        <strong>선택된 학생</strong>
        <p>학생 카드의 상담 전략 요청 버튼을 눌러주세요.</p>
      </div>

      <label class="counseling-label" for="teacherConcern">교사 고민</label>
      <textarea
        id="teacherConcern"
        class="counseling-textarea"
        rows="5"
        placeholder="수업 참여는 좋은데 평가 결과가 낮습니다. 어떻게 상담하면 좋을까요?\n과제 제출이 자주 늦습니다. 혼내기보다는 원인을 파악하고 싶은데 어떻게 접근하면 좋을까요?\n친구들과 협업할 때 소극적인 편입니다. 어떤 질문으로 대화를 시작하면 좋을까요?"
      ></textarea>

      <div class="preview-block">
        <strong>전송 데이터 미리보기</strong>
        <pre id="counselingPreview">{}</pre>
      </div>

      <button id="requestCounselingButton" class="primary-button" type="button">AI 상담 전략 받기</button>
      <p id="counselingError" class="form-message" role="alert" aria-live="polite"></p>
      <div id="counselingResult" class="counseling-result" aria-live="polite"></div>

      <p class="counseling-note">
        AI 상담 전략은 참고용입니다. 최종 판단과 실제 상담은 교사가 학생의 상황을 종합적으로 고려하여 진행해야 합니다.
      </p>
    </section>
  `;
}

function updateCounselingPanel() {
  const selectedArea = document.querySelector("#counselingSelected");
  const resultArea = document.querySelector("#counselingResult");
  const errorArea = document.querySelector("#counselingError");

  if (!selectedArea) return;

  if (!selectedCounselingStudent) {
    selectedArea.innerHTML = `
      <strong>선택된 학생</strong>
      <p>학생 카드의 상담 전략 요청 버튼을 눌러주세요.</p>
    `;
    updateCounselingPreview();
    return;
  }

  selectedArea.innerHTML = `
    <strong>선택된 학생</strong>
    <div class="selected-grid">
      <p><span>화면용 정보</span>${selectedCounselingStudent.name} / 학번 ${selectedCounselingStudent.id}</p>
      <p><span>Gemini 전송용 익명화 정보</span>${selectedCounselingStudent.alias}</p>
    </div>
  `;
  resultArea.textContent = "";
  errorArea.textContent = "";
  updateCounselingPreview();
}

function getCounselingPayload() {
  const teacherConcern = document.querySelector("#teacherConcern")?.value.trim() || "";

  if (!selectedCounselingStudent) {
    return null;
  }

  // Gemini로 전송하는 데이터는 이름, 학번, 사진 경로를 제외한 최소 정보로 제한한다.
  return {
    studentAlias: selectedCounselingStudent.alias,
    gradeSummary: selectedCounselingStudent.gradeSummary,
    learningTraits: selectedCounselingStudent.learningTraits,
    teacherConcern,
  };
}

function updateCounselingPreview() {
  const preview = document.querySelector("#counselingPreview");
  if (!preview) return;

  const payload = getCounselingPayload();
  preview.textContent = payload ? JSON.stringify(payload, null, 2) : "{}";
}

async function requestCounselingStrategy() {
  const errorArea = document.querySelector("#counselingError");
  const resultArea = document.querySelector("#counselingResult");
  const payload = getCounselingPayload();

  errorArea.textContent = "";
  resultArea.textContent = "";

  if (!payload) {
    errorArea.textContent = "상담 전략을 요청할 학생을 먼저 선택해주세요.";
    return;
  }

  if (!payload.teacherConcern) {
    errorArea.textContent = "상담 고민을 먼저 입력해주세요.";
    return;
  }

  resultArea.textContent = "AI가 상담 전략을 생성하는 중입니다.";

  try {
    // 프론트엔드에 API 키를 넣으면 개발자 도구에서 노출될 수 있다.
    // Gemini API 호출은 Vercel Serverless Function에서 처리한다.
    const response = await fetch("/api/gemini-counseling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Gemini request failed");
    }

    resultArea.textContent = data.result;
  } catch (error) {
    console.error(error);
    resultArea.textContent = "";
    errorArea.textContent =
      "AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요.";
  }
}

function renderGrades(grades, compact = false, headingId = "gradesTitle") {
  const rows = Object.entries(grades)
    .map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`)
    .join("");

  return `
    <section aria-labelledby="${headingId}">
      <div class="section-title">
        <h3 id="${headingId}">성적 정보</h3>
      </div>
      <table class="grade-table ${compact ? "compact-table" : ""}">
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function renderTraits(student) {
  return `
    <section aria-labelledby="traitsTitle-${student.id}">
      <div class="section-title">
        <h3 id="traitsTitle-${student.id}">학습 특성 및 교사 메모</h3>
      </div>
      <ul class="memo-list">
        ${student.traits.map((trait) => `<li>${trait}</li>`).join("")}
        <li>${student.teacherMemo}</li>
      </ul>
    </section>
  `;
}

showOnly(loginView);
