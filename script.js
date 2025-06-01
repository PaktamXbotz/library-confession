/*
    File: script.js
    Deskripsi: Logik JavaScript untuk Perpustakaan Confession Interaktif.
    Fungsi: Menguruskan teka-teki, validasi jawapan, petunjuk buku, dan pendedahan confession.
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pemilihan Elemen DOM
    const libraryContainer = document.querySelector('.library-container');
    const books = document.querySelectorAll('.book'); // Semua buku
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
    // Gunakan struktur yang lebih terperinci untuk teka-teki
    const puzzles = {
        "puzzle1": {
            question: "Apakah tarikh ulang tahun saya (DDMMYY)?",
            answer: "010190", // Gantikan dengan tarikh lahir sebenar anda (DDMMYY)
            clue: {
                targetBookId: "book-s2-05", // ID buku sasaran di rak 2, buku ke-5
                message: "Bagus! Sekarang cari buku **kuning** di **rak kedua**, buku ke-5 dari kiri. Itu buku yang memegang rahsia seterusnya!"
            },
            nextPuzzleId: "puzzle2" // Puzzle seterusnya yang akan diaktifkan
        },
        "puzzle2": {
            question: "Apakah makanan kegemaran saya yang saya selalu pesan bila kita keluar makan?",
            answer: "Nasi Lemak", // Gantikan dengan makanan kegemaran anda
            clue: {
                targetBookId: "book-s3-01", // ID buku sasaran di rak 3, buku ke-1
                message: "Hebat! Sekarang cari buku **merah** pertama di **rak ketiga**. Ia mengandungi petunjuk terakhir!"
            },
            nextPuzzleId: "finalConfession" // Ini adalah langkah terakhir sebelum confession penuh
        }
        // Tambah lagi teka-teki jika anda mahu lebih banyak langkah
    };

    // Data Confession (boleh dipisahkan atau disimpan dalam puzzle)
    const confessions = {
        "finalConfession": "Sayangku, setiap langkah yang awak ambil untuk mencari rahsia ini, menunjukkan betapa awak sanggup berusaha untuk memahami saya. Confession saya adalah: saya sangat bersyukur memiliki awak dalam hidup saya, dan setiap detik bersama awak adalah harta yang tak ternilai. Saya cintakan awak lebih dari segalanya! - [Nama Anda]" // Gantikan dengan confession sebenar anda
    };

    // 3. Pembolehubah State Permainan
    let currentActivePuzzleId = "puzzle1"; // Mula dengan puzzle pertama
    let currentClueTargetBookId = null; // ID buku yang perlu dicari sekarang

    // 4. Fungsi-fungsi Utama

    // Fungsi untuk memaparkan modal soalan
    const showQuestionModal = (puzzleId) => {
        const puzzle = puzzles[puzzleId];
        if (!puzzle) {
            console.error("Puzzle tidak ditemui:", puzzleId);
            return;
        }
        questionTitle.textContent = `Soalan untuk ${puzzle.question}`;
        questionText.textContent = puzzle.question;
        answerInput.value = ''; // Kosongkan input
        feedbackText.textContent = ''; // Kosongkan maklum balas
        questionModal.style.display = 'flex'; // Paparkan modal
    };

    // Fungsi untuk menyembunyikan modal soalan
    const hideQuestionModal = () => {
        questionModal.style.display = 'none';
        // Buang highlight dari buku yang mungkin aktif sebelumnya
        if (currentClueTargetBookId) {
            const prevBook = document.getElementById(currentClueTargetBookId);
            if (prevBook) prevBook.classList.remove('active-clue');
        }
    };

    // Fungsi untuk menyemak jawapan
    const handleSubmitAnswer = () => {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctPuzzle = puzzles[currentActivePuzzleId];

        if (!correctPuzzle) return; // Tiada puzzle aktif

        const correctAnswer = correctPuzzle.answer.toLowerCase();

        if (userAnswer === correctAnswer) {
            feedbackText.textContent = correctPuzzle.clue.message;
            feedbackText.classList.remove('wrong');
            feedbackText.classList.add('correct');

            currentClueTargetBookId = correctPuzzle.clue.targetBookId;

            // Highlight buku sasaran (jika ada)
            if (currentClueTargetBookId) {
                const targetBook = document.getElementById(currentClueTargetBookId);
                if (targetBook) {
                    books.forEach(book => book.classList.remove('active-clue')); // Buang highlight lama
                    targetBook.classList.add('active-clue');
                }
            }

            // Selepas beberapa saat, sembunyikan modal dan sedia untuk puzzle seterusnya
            setTimeout(() => {
                hideQuestionModal();
                if (correctPuzzle.nextPuzzleId) {
                    currentActivePuzzleId = correctPuzzle.nextPuzzleId;
                } else {
                    // Jika tiada nextPuzzleId, bermakna semua puzzle selesai, sedia untuk confession akhir
                    currentActivePuzzleId = "readyForFinalConfession"; // State untuk confession penuh
                }
            }, 3000); // Tunjuk petunjuk selama 3 saat
        } else {
            feedbackText.textContent = "Jawapan salah. Cuba lagi!";
            feedbackText.classList.remove('correct');
            feedbackText.classList.add('wrong');
            // Boleh tambah logik untuk had cubaan atau petunjuk tambahan
        }
    };

    // Fungsi untuk memaparkan modal confession
    const showConfessionModal = (text) => {
        confessionText.textContent = text;
        confessionModal.style.display = 'flex';
    };

    // Fungsi untuk menyembunyikan modal confession
    const hideConfessionModal = () => {
        confessionModal.style.display = 'none';
    };

    // 5. Pengendali Event (Event Listeners)

    // Event listener untuk butang hantar jawapan
    submitAnswerBtn.addEventListener('click', handleSubmitAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmitAnswer();
        }
    });

    // Event listeners untuk butang tutup modal
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideQuestionModal();
            hideConfessionModal();
        });
    });
    closeConfessionBtn.addEventListener('click', hideConfessionModal);

    // Event listener untuk klik di luar modal (untuk menutup)
    window.addEventListener('click', (e) => {
        if (e.target === questionModal) {
            hideQuestionModal();
        }
        if (e.target === confessionModal) {
            hideConfessionModal();
        }
    });

    // Event listener untuk klik pada buku
    books.forEach(book => {
        book.addEventListener('click', () => {
            // Jika ia adalah buku sasaran untuk puzzle semasa
            if (book.id === currentClueTargetBookId) {
                if (currentActivePuzzleId === "readyForFinalConfession") {
                    showConfessionModal(confessions.finalConfession);
                    // Reset permainan atau sediakan untuk tamat di sini
                    currentClueTargetBookId = null; // Reset
                } else {
                    // Jika buku sasaran telah diklik, dan ada puzzle seterusnya, paparkan soalan seterusnya
                    showQuestionModal(currentActivePuzzleId);
                }
            } else {
                // Buku yang salah diklik
                if (!questionModal.style.display || questionModal.style.display === 'none') { // Elakkan mesej jika modal soalan sudah terbuka
                     alert("Bukan buku ini! Anda perlu menyelesaikan teka-teki untuk mendapatkan petunjuk buku yang betul.");
                }
            }
        });
    });

    // 6. Logik Permulaan Permainan
    // Contoh: Buku pertama di rak 1 adalah buku permulaan
    const startBook = document.getElementById('book-s1-01');
    if (startBook) {
        startBook.addEventListener('click', () => {
            if (currentActivePuzzleId === "puzzle1" && !questionModal.style.display || questionModal.style.display === 'none') {
                showQuestionModal("puzzle1");
            }
        });
        startBook.classList.add('active-clue'); // Sorot buku permulaan
    }
});
