/*
    File: script.js
    Deskripsi: Logik JavaScript untuk Perpustakaan Confession Interaktif.
    Fungsi: Menguruskan teka-teki, validasi jawapan, petunjuk buku, dan pendedahan confession.
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemilihan Elemen DOM
    const libraryContainer = document.querySelector('.library-container');
    const books = document.querySelectorAll('.book');
    const questionModal = document.getElementById('questionModal');
    const confessionModal = document.getElementById('confessionModal');
    const questionTitle = document.getElementById('questionTitle');
    const questionText = document.getElementById('questionText');
    const answerInput = document.getElementById('answerInput');
    const submitAnswerBtn = document.getElementById('submitAnswerBtn');
    const feedbackText = document.getElementById('feedbackText');
    const confessionText = document.getElementById('confessionText');
    const closeButtons = document.querySelectorAll('.close-button');
    const closeConfessionBtn = document.getElementById('closeConfessionBtn');

    // 2. Data Permainan (Teka-teki dan Confession)
    const puzzles = {
        "puzzle1": {
            question: "Apakah tarikh ulang tahun saya (DDMMYY)?",
            answer: "010190", // Gantikan dengan tarikh lahir sebenar anda (DDMMYY)
            clue: {
                targetBookId: "book-s2-05", // Rak 2, buku ke-5
                message: "Bagus! Sekarang cari buku <b>kuning</b> di <b>rak kedua</b>, buku ke-5 dari kiri. Itu buku yang memegang rahsia seterusnya!"
            },
            nextPuzzleId: "puzzle2"
        },
        "puzzle2": {
            question: "Apakah makanan kegemaran saya yang saya selalu pesan bila kita keluar makan?",
            answer: "Nasi Lemak",
            clue: {
                targetBookId: "book-s3-01",
                message: "Hebat! Sekarang cari buku <b>merah</b> pertama di <b>rak ketiga</b>. Ia mengandungi petunjuk terakhir!"
            },
            nextPuzzleId: "finalConfession"
        }
        // Anda boleh tambah puzzle lain di sini
    };

    const confessions = {
        "finalConfession":
            "Sayangku, setiap langkah yang awak ambil untuk mencari rahsia ini, menunjukkan betapa awak sanggup berusaha untuk memahami saya. Confession saya adalah: saya sangat bersyukur memiliki awak dalam hidup saya, dan setiap detik bersama awak adalah harta yang tak ternilai. Saya cintakan awak lebih dari segalanya! - [Nama Anda]"
    };

    // 3. State Permainan
    let currentActivePuzzleId = "puzzle1";
    let currentClueTargetBookId = null;

    // 4. Fungsi Utama

    // Papar modal soalan
    function showQuestionModal(puzzleId) {
        const puzzle = puzzles[puzzleId];
        if (!puzzle) {
            console.error("Puzzle tidak ditemui:", puzzleId);
            return;
        }
        questionTitle.textContent = `Soalan untuk Anda!`;
        questionText.textContent = puzzle.question;
        answerInput.value = '';
        feedbackText.textContent = '';
        feedbackText.classList.remove('correct', 'wrong');
        questionModal.style.display = 'flex';
    }

    // Sembunyi modal soalan
    function hideQuestionModal() {
        questionModal.style.display = 'none';
        if (currentClueTargetBookId) {
            const prevBook = document.getElementById(currentClueTargetBookId);
            if (prevBook) prevBook.classList.remove('active-clue');
        }
    }

    // Semak jawapan
    function handleSubmitAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctPuzzle = puzzles[currentActivePuzzleId];
        if (!correctPuzzle) return;

        const correctAnswer = correctPuzzle.answer.toLowerCase();

        if (userAnswer === correctAnswer) {
            feedbackText.innerHTML = correctPuzzle.clue.message;
            feedbackText.classList.remove('wrong');
            feedbackText.classList.add('correct');

            currentClueTargetBookId = correctPuzzle.clue.targetBookId;

            // Highlight buku sasaran
            if (currentClueTargetBookId) {
                books.forEach(book => book.classList.remove('active-clue'));
                const targetBook = document.getElementById(currentClueTargetBookId);
                if (targetBook) targetBook.classList.add('active-clue');
            }

            // Selepas beberapa saat, tutup modal dan sedia untuk langkah seterusnya
            setTimeout(() => {
                hideQuestionModal();
                if (correctPuzzle.nextPuzzleId) {
                    currentActivePuzzleId = correctPuzzle.nextPuzzleId;
                } else {
                    currentActivePuzzleId = "readyForFinalConfession";
                }
            }, 3000);
        } else {
            feedbackText.textContent = "Jawapan salah. Cuba lagi!";
            feedbackText.classList.remove('correct');
            feedbackText.classList.add('wrong');
        }
    }

    // Papar modal confession
    function showConfessionModal(text) {
        confessionText.textContent = text;
        confessionModal.style.display = 'flex';
    }

    // Sembunyi modal confession
    function hideConfessionModal() {
        confessionModal.style.display = 'none';
    }

    // 5. Event Listeners

    submitAnswerBtn.addEventListener('click', handleSubmitAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSubmitAnswer();
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideQuestionModal();
            hideConfessionModal();
        });
    });
    closeConfessionBtn.addEventListener('click', hideConfessionModal);

    window.addEventListener('click', (e) => {
        if (e.target === questionModal) hideQuestionModal();
        if (e.target === confessionModal) hideConfessionModal();
    });

    // Klik pada buku
    books.forEach(book => {
        book.addEventListener('click', () => {
            if (book.id === currentClueTargetBookId) {
                if (currentActivePuzzleId === "readyForFinalConfession") {
                    showConfessionModal(confessions.finalConfession);
                    currentClueTargetBookId = null;
                } else {
                    showQuestionModal(currentActivePuzzleId);
                }
            } else {
                // Elak alert jika modal soalan sedang dibuka
                if (!questionModal.style.display || questionModal.style.display === 'none') {
                    alert("Bukan buku ini! Anda perlu menyelesaikan teka-teki untuk mendapatkan petunjuk buku yang betul.");
                }
            }
        });
    });

    // 6. Permulaan Permainan: highlight buku permulaan
    const startBook = document.getElementById('book-s1-01');
    if (startBook) {
        startBook.addEventListener('click', () => {
            if (
                currentActivePuzzleId === "puzzle1" &&
                (!questionModal.style.display || questionModal.style.display === 'none')
            ) {
                showQuestionModal("puzzle1");
            }
        });
        startBook.classList.add('active-clue');
    }
});
