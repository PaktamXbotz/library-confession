/*
    File: script.js
    Deskripsi: Logik interaktif untuk Perpustakaan Confession dengan petunjuk glowing kecil dan kalendar comel.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Pemilihan Elemen DOM
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
    const calendarContainer = document.getElementById('calendarContainer');

    // Data Teka-teki dan Confession
    const puzzles = [
        {
            id: "puzzle1",
            question: "Bila tarikh lahir saya? (Klik pada tarikh dalam kalendar comel di bawah!)",
            answer: "2000-01-01", // Format YYYY-MM-DD
            inputType: "calendar",
            clue: {
                targetBookId: "book-s2-05",
                message: "Bagus! Sekarang cari buku <b>kuning</b> di <b>rak kedua</b>, buku ke-5 dari kiri. Itu buku yang memegang rahsia seterusnya!"
            }
        },
        {
            id: "puzzle2",
            question: "Apakah makanan kegemaran saya? (hint: makanan Malaysia yang popular waktu pagi)",
            answer: "nasi lemak",
            inputType: "text",
            clue: {
                targetBookId: "book-s3-01",
                message: "Hebat! Sekarang cari buku <b>merah</b> pertama di <b>rak ketiga</b>. Ia mengandungi teka-teki terakhir!"
            }
        },
        {
            id: "puzzle3",
            question: "Apakah warna kegemaran saya? (hint: warna yang menenangkan, sering dikaitkan dengan daun dan alam)",
            answer: "hijau",
            inputType: "text",
            clue: {
                targetBookId: null,
                message: "Tahniah! Anda telah berjaya. Klik pada butang rahsia untuk mengetahui confession saya!"
            }
        }
    ];

    const confession = "Saya sangat menghargai setiap usaha awak untuk memahami saya. Sebenarnya, rahsia saya adalah... saya sayangkan awak sangat-sangat! <3";

    // State permainan
    let currentPuzzleIndex = null;
    let currentClueTargetBookId = null;
    let calendarInstance = null;

    // Utiliti untuk glowing di atas buku
    function addGlowToBook(bookId) {
        books.forEach(b => {
            // Remove all glow
            const existingGlow = b.querySelector('.book-glow');
            if (existingGlow) existingGlow.remove();
        });
        if (bookId) {
            const book = document.getElementById(bookId);
            if (book) {
                // Tambah glow kecil di atas
                let glow = book.querySelector('.book-glow');
                if (!glow) {
                    glow = document.createElement('div');
                    glow.className = 'book-glow';
                    glow.innerHTML = '<div class="book-glow-cute"></div>';
                    book.appendChild(glow);
                }
            }
        }
    }

    // Cute Calendar Component
    class CuteCalendar {
        constructor(container, onSelect, defaultDate) {
            this.container = container;
            this.onSelect = onSelect;
            this.selectedDate = defaultDate ? new Date(defaultDate) : null;
            this.currentDate = this.selectedDate ? new Date(this.selectedDate) : new Date();
            this.render();
        }
        render() {
            this.container.innerHTML = '';
            this.container.className = 'cute-calendar';

            // Header: prev, month+year, next
            const header = document.createElement('div');
            header.className = 'calendar-header';
            const prevBtn = document.createElement('button');
            prevBtn.className = 'calendar-arrow';
            prevBtn.innerHTML = '‹';
            const nextBtn = document.createElement('button');
            nextBtn.className = 'calendar-arrow';
            nextBtn.innerHTML = '›';
            const monthSpan = document.createElement('span');
            const monthNames = [
                "Januari", "Februari", "Mac", "April", "Mei", "Jun",
                "Julai", "Ogos", "September", "Oktober", "November", "Disember"
            ];
            monthSpan.textContent = monthNames[this.currentDate.getMonth()] + " " + this.currentDate.getFullYear();
            header.appendChild(prevBtn); header.appendChild(monthSpan); header.appendChild(nextBtn);
            this.container.appendChild(header);

            // Weekdays
            const weekdays = document.createElement('div');
            weekdays.className = 'calendar-weekdays';
            ["Ahad", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"].forEach(d => {
                const wd = document.createElement('div');
                wd.textContent = d;
                weekdays.appendChild(wd);
            });
            this.container.appendChild(weekdays);

            // Days
            const daysGrid = document.createElement('div');
            daysGrid.className = 'calendar-days';
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            const today = new Date();
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Empty slots before first day
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                daysGrid.appendChild(empty);
            }
            // Dates
            for (let d = 1; d <= daysInMonth; d++) {
                const dayBtn = document.createElement('div');
                dayBtn.className = 'calendar-day';
                dayBtn.textContent = d.toString();
                const dateValue = new Date(year, month, d);
                if (this.selectedDate &&
                    dateValue.toDateString() === this.selectedDate.toDateString()
                ) {
                    dayBtn.classList.add('selected');
                }
                if (
                    dateValue.getDate() === today.getDate() &&
                    dateValue.getMonth() === today.getMonth() &&
                    dateValue.getFullYear() === today.getFullYear()
                ) {
                    dayBtn.classList.add('today');
                }
                dayBtn.addEventListener('click', () => {
                    this.selectedDate = new Date(year, month, d);
                    this.onSelect(this.selectedDate);
                    this.render();
                });
                daysGrid.appendChild(dayBtn);
            }
            this.container.appendChild(daysGrid);

            // Navigasi bulan
            prevBtn.onclick = () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            };
            nextBtn.onclick = () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            };
        }
    }

    // Modal
    function showQuestionModal(puzzleIndex) {
        currentPuzzleIndex = puzzleIndex;
        const puzzle = puzzles[puzzleIndex];
        questionTitle.textContent = "Soalan untuk Anda!";
        questionText.innerHTML = puzzle.question;
        feedbackText.textContent = '';
        feedbackText.className = 'feedback-text';
        answerInput.style.display = (puzzle.inputType === "text") ? '' : 'none';
        calendarContainer.style.display = (puzzle.inputType === "calendar") ? '' : 'none';
        if (puzzle.inputType === "calendar") {
            // Calendar comel, default tarikh = hari ini
            calendarInstance = new CuteCalendar(calendarContainer, (date) => {
                // Format YYYY-MM-DD
                answerInput.value = date.toISOString().slice(0, 10);
            });
            answerInput.value = '';
        } else {
            if (calendarInstance) calendarContainer.innerHTML = '';
            answerInput.value = '';
        }
        questionModal.style.display = 'flex';
    }

    function hideQuestionModal() {
        questionModal.style.display = 'none';
    }

    function showConfessionModal() {
        confessionText.innerHTML = confession;
        confessionModal.style.display = 'flex';
    }
    function hideConfessionModal() { confessionModal.style.display = 'none'; }

    // Validasi Jawapan
    function handleSubmitAnswer() {
        const puzzle = puzzles[currentPuzzleIndex];
        let userAnswer = answerInput.value.trim().toLowerCase();
        let correctAnswer = puzzle.answer.toLowerCase();
        // Untuk tipe calendar, ubah format ke YYYY-MM-DD
        if (puzzle.inputType === "calendar") {
            userAnswer = userAnswer;
            correctAnswer = correctAnswer;
        }
        if (userAnswer === correctAnswer) {
            feedbackText.innerHTML = puzzle.clue.message;
            feedbackText.classList.remove('wrong');
            feedbackText.classList.add('correct');
            // Petunjuk glowing ke buku sasaran, kecuali puzzle terakhir (clue.targetBookId === null)
            addGlowToBook(puzzle.clue.targetBookId);
            currentClueTargetBookId = puzzle.clue.targetBookId;
            setTimeout(() => {
                hideQuestionModal();
                if (puzzleIndexIsLast(puzzleIndexOf(currentClueTargetBookId))) {
                    // Puzzle terakhir, show confession
                    setTimeout(showConfessionModal, 700);
                }
            }, 2200);
        } else {
            feedbackText.textContent = "Jawapan salah. Cuba lagi!";
            feedbackText.classList.remove('correct');
            feedbackText.classList.add('wrong');
        }
    }

    function puzzleIndexOf(bookId) {
        return puzzles.findIndex(p => p.clue.targetBookId === bookId);
    }
    function puzzleIndexIsLast(idx) {
        // idx adalah index teka-teki terakhir
        if (idx === puzzles.length - 1 || puzzles[idx]?.clue?.targetBookId === null) return true;
        return false;
    }

    // Event Listeners
    submitAnswerBtn.addEventListener('click', handleSubmitAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSubmitAnswer();
    });
    closeButtons.forEach(btn => btn.onclick = () => {
        hideQuestionModal();
        hideConfessionModal();
    });
    closeConfessionBtn.addEventListener('click', hideConfessionModal);
    window.addEventListener('click', (e) => {
        if (e.target === questionModal) hideQuestionModal();
        if (e.target === confessionModal) hideConfessionModal();
    });

    // Buku diklik
    books.forEach(book => {
        book.addEventListener('click', () => {
            // Puzzle pertama, mula di book-s1-01
            if (currentClueTargetBookId === null && book.id === "book-s1-01") {
                // Mula permainan
                showQuestionModal(0);
                addGlowToBook(null);
            } else if (currentClueTargetBookId && book.id === currentClueTargetBookId) {
                // Puzzle berikutnya
                const nextIdx = puzzleIndexOf(book.id) + 1;
                if (nextIdx < puzzles.length) {
                    showQuestionModal(nextIdx);
                } else {
                    // Puzzle terakhir sudah selesai
                    addGlowToBook(null);
                    setTimeout(showConfessionModal, 450);
                }
            } else {
                // Buku salah
                // Alert comel
                if (questionModal.style.display === 'none' || !questionModal.style.display) {
                    alert("Bukan buku ini! Cari buku yang mempunyai petunjuk glowing di atasnya.");
                }
            }
        });
    });

    // Pada scroll, sentiasa pastikan glow tetap kelihatan
    document.addEventListener('scroll', () => {
        addGlowToBook(currentClueTargetBookId);
    });

    // Permulaan: highlight buku permulaan
    addGlowToBook('book-s1-01');
});
