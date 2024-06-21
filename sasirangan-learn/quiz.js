// Import fungsi yang diperlukan dari SDK yang diperlukan
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
// TODO: Tambahkan SDK untuk produk Firebase yang ingin Anda gunakan
// https://firebase.google.com/docs/web/setup#available-libraries

// Konfigurasi Firebase aplikasi web Anda
// Untuk Firebase JS SDK v7.20.0 dan lebih baru, measurementId adalah opsional
const firebaseConfig = {
  apiKey: "AIzaSyC-_Ez8XBFyyT9Dmgaom5jiv9Tl24b-5hA",
  authDomain: "quiz-81b4f.firebaseapp.com",
  databaseURL: "https://quiz-81b4f-default-rtdb.firebaseio.com",
  projectId: "quiz-81b4f",
  storageBucket: "quiz-81b4f.appspot.com",
  messagingSenderId: "333709013699",
  appId: "1:333709013699:web:687441454a355cdc79a876",
  measurementId: "G-J38NECDZ21"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

let soal = [];

function getDataFromDatabase() {
    const reference = ref(db, 'soal/');
    onChildAdded(reference, function(data) {
        console.log(data.val());
        soal.push(data.val());
        renderQuestion()
    });
}
getDataFromDatabase();

let soalSekarang = document.getElementById('soalSekarang');
let totalSoal = document.getElementById('totalSoal');
let pertanyaan = document.getElementById('pertanyaan');
let answerParent = document.getElementById('answerParent');

let indexNum = 0;
let skor = 0;

window.cekPertanyaan = function(a, b) {
    if (a == b) {
        skor += 10;
        console.log(skor);
    }

    soalSelanjutnya();
};

window.soalSelanjutnya = function() {
    if (indexNum + 1 === soal.length) {
        alert("Quiz selesai! Skor kamu: " + skor);
    } else {
        indexNum++;
        renderQuestion();
        toggleBtnSebelumnya();
    }
};

function renderQuestion() {
    soalSekarang.innerHTML = indexNum + 1;
    totalSoal.innerHTML = soal.length;

    let obj = soal[indexNum];

    pertanyaan.innerHTML = obj.pertanyaan;

    answerParent.innerHTML = '';
    for (let i = 0; i < obj.pilihan.length; i++) {
        answerParent.innerHTML += `<button onclick="cekPertanyaan('${obj.pilihan[i]}', '${obj.benar}')" class='card bg-dark p-2 m-1 text-white align-items-center'>${obj.pilihan[i]}</button>`;
    }
}




