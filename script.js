let words = [];
let selectedWords = [];
let currentQuestion = 0;
let score = 0;

const showWordsBtn = document.getElementById("show-words");
const startQuizBtn = document.getElementById("start-quiz");
const wordListDiv = document.getElementById("word-list");
const quizSection = document.getElementById("quiz-section");
const previewTableBody = document.querySelector("#preview-table tbody");
const questionEl = document.getElementById("question");
const optionsDiv = document.getElementById("options");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("next");

async function loadWords() {
  const response = await fetch("words.csv");
  const data = await response.text();
  const lines = data.trim().split("\n");
  words = lines.map(line => {
    const [english, urdu] = line.split(",");
    return { english: english.trim(), urdu: urdu.trim() };
  });
}

function showPreview() {
  selectedWords = [];
  previewTableBody.innerHTML = "";
  const shuffled = words.sort(() => 0.5 - Math.random());
  selectedWords = shuffled.slice(0, 10);

  selectedWords.forEach(w => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${w.english}</td><td>${w.urdu}</td>`;
    previewTableBody.appendChild(row);
  });

  wordListDiv.classList.remove("hidden");
  showWordsBtn.classList.add("hidden");
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  wordListDiv.classList.add("hidden");
  quizSection.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const word = selectedWords[currentQuestion];
  const isEnglishToUrdu = Math.random() > 0.5;

  questionEl.textContent = isEnglishToUrdu
    ? `Translate into Urdu: ${word.english}`
    : `Translate into English: ${word.urdu}`;

  const correctAnswer = isEnglishToUrdu ? word.urdu : word.english;
  const options = [correctAnswer];

  while (options.length < 4) {
    const random = words[Math.floor(Math.random() * words.length)];
    const option = isEnglishToUrdu ? random.urdu : random.english;
    if (!options.includes(option)) options.push(option);
  }

  options.sort(() => 0.5 - Math.random());

  optionsDiv.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt, correctAnswer);
    optionsDiv.appendChild(btn);
  });

  scoreEl.textContent = `Score: ${score}`;
}

function checkAnswer(selected, correct) {
  if (selected === correct) score++;
  nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
  currentQuestion++;
  nextBtn.classList.add("hidden");

  if (currentQuestion < selectedWords.length) {
    showQuestion();
  } else {
    quizSection.innerHTML = `<h2>Quiz Completed!</h2><p>Your final score: ${score} / ${selectedWords.length}</p>`;
  }
};

showWordsBtn.onclick = showPreview;
startQuizBtn.onclick = startQuiz;

loadWords();
