// Soalan utama dan jawapan
const mainQuestion = {
    text: "Apakah tarikh lahir saya (DDMMYY)?",
    answer: "310595", // Contoh jawapan, ubah ikut keperluan
    clue: "Lihat buku ID #BukuBiru, muka surat 17, baris ke-3"
};

// Confession data
const confessions = {
    BukuBiru: "Ini adalah confession rahsia dalam Buku Biru: 'Saya suka belajar JavaScript pada waktu malam.'",
    BukuMerah: "Confession Buku Merah: 'Rahsia saya ialah saya pernah tertidur dalam perpustakaan.'",
    BukuHijau: "Confession Buku Hijau: 'Saya ingin menjadi penulis satu hari nanti.'"
};

// State
let unlockedClue = false; // true jika soalan utama telah dijawab dengan betul

// Elemen DOM
const mainBook = document.getElementById('mainBook');
const books = document.querySelectorAll('.book:not(.main-book)');
const questionModal = document.getElementById('questionModal');
const confessionModal = document.getElementById('confessionModal');
const closeModal = document.getElementById('closeModal');
const closeConfession = document.getElementById('closeConfession');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const submitAnswer = document.getElementById('submitAnswer');
const errorMsg = document.getElementById('errorMsg');
const confessionText = document.getElementById('confessionText');

// Simpan state dalam localStorage
function saveState() {
    localStorage.setItem('unlockedClue', unlockedClue ? '1' : '0');
}
function loadState() {
    unlockedClue = localStorage.getItem('unlockedClue') === '1';
}
loadState();

// Buka modal soalan
mainBook.addEventListener('click', () => {
    questionModal.style.display = 'flex';
    errorMsg.textContent = '';
    answerInput.value = '';
    answerInput.focus();
});

closeModal.addEventListener('click', () => {
    questionModal.style.display = 'none';
});

// Jawab soalan utama
submitAnswer.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
    const userAns = answerInput.value.trim();
    if (userAns === mainQuestion.answer) {
        unlockedClue = true;
        saveState();
        errorMsg.style.color = "#4682b4";
        errorMsg.textContent = "Betul! " + mainQuestion.clue;
        setTimeout(() => {
            questionModal.style.display = 'none';
            errorMsg.textContent = '';
        }, 2000);
    } else {
        errorMsg.textContent = "Jawapan salah. Sila cuba lagi.";
    }
}

// Klik buku confession
books.forEach(book => {
    book.addEventListener('click', () => {
        const id = book.id;
        if (!unlockedClue && id === 'BukuBiru') {
            // Buku Biru hanya boleh dibuka jika soalan utama telah dijawab
            showConfession("Sila jawab soalan pada Buku Utama dahulu untuk membuka confession ini.");
        } else if (confessions[id]) {
            showConfession(confessions[id]);
        } else {
            showConfession("Tiada confession untuk buku ini.");
        }
    });
});

// Modal confession
function showConfession(text) {
    confessionText.textContent = text;
    confessionModal.style.display = 'flex';
}
closeConfession.addEventListener('click', () => {
    confessionModal.style.display = 'none';
});

// Tutup modal dengan klik di luar kandungan modal
window.addEventListener('click', (e) => {
    if (e.target === questionModal) questionModal.style.display = 'none';
    if (e.target === confessionModal) confessionModal.style.display = 'none';
});

// Paparkan petunjuk jika sudah unlock
if (unlockedClue) {
    setTimeout(() => {
        questionModal.style.display = 'flex';
        errorMsg.style.color = "#4682b4";
        errorMsg.textContent = "Petunjuk: " + mainQuestion.clue;
    }, 500);
}
