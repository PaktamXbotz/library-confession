// =============================
// Perpustakaan Confession JS
// =============================

// -----------------------------
// DATA
// -----------------------------

// Puzzle bank (soalan, jawapan, petunjuk buku seterusnya)
const puzzles = {
  "puzzle1": {
    question: "Apakah tarikh lahir saya (DDMMYY)?",
    answer: "010190",
    clue: { shelf: "shelf2", color: "blue", position: 3, bookId: "book-s2-03" }
  },
  "puzzle2": {
    question: "Apakah makanan kegemaran saya?",
    answer: "Nasi Lemak",
    clue: { shelf: "shelf3", color: "red", position: 2, bookId: "book-s3-02" }
  },
  "puzzle3": {
    question: "Di mana saya membesar?",
    answer: "Kuantan",
    clue: { shelf: "shelf1", color: "yellow", position: 4, bookId: "book-s1-04" }
  }
  // ...tambah puzzle jika mahu
};

// Confession bank, dipadankan dengan ID buku
const confessions = {
  "book-s2-03": "Confession #1: Saya suka membaca buku fiksyen sains pada waktu malam.",
  "book-s3-02": "Confession #2: Saya pernah menangis kerana menonton drama Korea.",
  "book-s1-04": "Confession #3: Impian saya adalah melancong ke Iceland."
};

// -----------------------------
// STATE
// -----------------------------
let currentPuzzleId = "puzzle1";
let unlockedBooks = []; // Simpan bookId yang telah dibuka
let progress = {}; // Untuk simpan kemajuan (boleh guna localStorage)

// -----------------------------
// PEMILIHAN ELEMEN DOM
// -----------------------------

const books = document.querySelectorAll('.book');
const startBook = document.querySelector('.start-book');
const questionModal = document.getElementById('question-modal');
const questionTitle = document.getElementById('question-title');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitAnswerBtn = document.getElementById('submit-answer');
const questionFeedback = document.getElementById('question-feedback');
const closeQuestion = document.getElementById('close-question');

const confessionModal = document.getElementById('confession-modal');
const closeConfession = document.getElementById('close-confession');
const confessionText = document.getElementById('confession-text');

// -----------------------------
// UTILITI
// -----------------------------

function saveProgress() {
  localStorage.setItem('perpustakaan_confession_progress', JSON.stringify({
    currentPuzzleId,
    unlockedBooks
  }));
}

function loadProgress() {
  const data = localStorage.getItem('perpustakaan_confession_progress');
  if (data) {
    const obj = JSON.parse(data);
    currentPuzzleId = obj.currentPuzzleId || "puzzle1";
    unlockedBooks = obj.unlockedBooks || [];
  }
}

// -----------------------------
// MODAL FUNGSI
// -----------------------------

function showModal(modal) {
  modal.classList.add('active');
}

function hideModal(modal) {
  modal.classList.remove('active');
}

// -----------------------------
// SOALAN / PUZZLE LOGIK
// -----------------------------

function showQuestionModal(puzzleId) {
  const puzzle = puzzles[puzzleId];
  if (!puzzle) return;
  questionTitle.textContent = "Soalan";
  questionText.textContent = puzzle.question;
  answerInput.value = "";
  questionFeedback.textContent = "";
  showModal(questionModal);
  answerInput.focus();
}

function submitAnswer() {
  const puzzle = puzzles[currentPuzzleId];
  if (!puzzle) return;
  const userAnswer = answerInput.value.trim();
  // Bandingkan case-insensitive & tanpa whitespace
  if (
    userAnswer.replace(/\s+/g, '').toLowerCase() ===
    puzzle.answer.replace(/\s+/g, '').toLowerCase()
  ) {
    // Jawapan betul
    questionFeedback.style.color = "#37884c";
    questionFeedback.textContent = "Betul! Petunjuk seterusnya: ";
    // Paparkan petunjuk
    let clueMsg = `Pergi ke ${puzzle.clue.shelf.toUpperCase()}, cari buku warna ${puzzle.clue.color}, buku ke-${puzzle.clue.position} dari kiri.`;
    questionFeedback.innerHTML = `<span style="color:#37884c;font-weight:bold;">Betul!</span> <br>Petunjuk: <b>${clueMsg}</b>`;
    // Unlock buku
    unlockBook(puzzle.clue.bookId);
    // Simpan progress
    saveProgress();
    // Tukar ke puzzle seterusnya
    let nextPuzzleNum = parseInt(currentPuzzleId.replace('puzzle','')) + 1;
    let nextPuzzleId = "puzzle" + nextPuzzleNum;
    if (puzzles[nextPuzzleId]) {
      currentPuzzleId = nextPuzzleId;
      setTimeout(() => { hideModal(questionModal); }, 1700);
    } else {
      // Tiada lagi puzzle, tamat permainan
      setTimeout(() => { hideModal(questionModal); }, 1700);
    }
  } else {
    // Salah
    questionFeedback.style.color = "#b43d2f";
    questionFeedback.textContent = "Jawapan salah, cuba lagi!";
  }
}

// -----------------------------
// BUKU LOGIK
// -----------------------------

function unlockBook(bookId) {
  if (!unlockedBooks.includes(bookId)) {
    unlockedBooks.push(bookId);
    // Highlight buku yang aktif
    const bookElem = document.getElementById(bookId);
    if (bookElem) {
      bookElem.classList.add('active-book');
      bookElem.setAttribute('tabindex', "0");
      // Optional: animasi blink, dsb
    }
  }
  saveProgress();
}

function handleBookClick(bookId) {
  // Buku permulaan
  if (bookId === "book-s1-01") {
    showQuestionModal("puzzle1");
    return;
  }
  // Jika buku sudah unlock, paparkan confession
  if (unlockedBooks.includes(bookId) && confessions[bookId]) {
    showConfessionModal(confessions[bookId]);
    return;
  }
  // Jika buku sepatutnya unlock (mengikut puzzle semasa)
  const puzzle = puzzles[currentPuzzleId];
  if (puzzle && puzzle.clue.bookId === bookId) {
    // Paparkan confession dan unlock buku
    unlockBook(bookId);
    showConfessionModal(confessions[bookId] || "Tiada confession pada buku ini.");
    return;
  }
  // Jika bukan buku yang betul
  showConfessionModal("Bukan buku ini, cari petunjuk yang betul dulu!");
}

// -----------------------------
// CONFESSION MODAL
// -----------------------------

function showConfessionModal(text) {
  confessionText.textContent = text;
  showModal(confessionModal);
}

// -----------------------------
// EVENT LISTENERS
// -----------------------------

// Klik semua buku
books.forEach(book => {
  book.addEventListener('click', function() {
    handleBookClick(this.id);
  });
});
// Enter key untuk buku
books.forEach(book => {
  book.addEventListener('keydown', function(e) {
    if (e.key === "Enter" || e.key === " ") {
      handleBookClick(this.id);
    }
  });
});

// Tutup modal soalan
closeQuestion.addEventListener('click', () => hideModal(questionModal));
// Tutup modal confession
closeConfession.addEventListener('click', () => hideModal(confessionModal));

// Hantar jawapan (klik/hantar)
submitAnswerBtn.addEventListener('click', submitAnswer);
answerInput.addEventListener('keydown', function(e) {
  if (e.key === "Enter") submitAnswer();
});

// Tutup modal jika klik di luar kotak
window.addEventListener('click', function(e) {
  if (e.target === questionModal) hideModal(questionModal);
  if (e.target === confessionModal) hideModal(confessionModal);
});

// -----------------------------
// INIT
// -----------------------------

function initBooks() {
  // Highlight semula buku yang telah unlock (jika reload)
  unlockedBooks.forEach(bookId => {
    const bookElem = document.getElementById(bookId);
    if (bookElem) bookElem.classList.add('active-book');
  });
}

// -----------------------------
// LOAD
// -----------------------------
(function(){
  loadProgress();
  initBooks();
})();
