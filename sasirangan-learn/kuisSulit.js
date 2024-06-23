import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Konfigurasi Firebase aplikasi web Anda
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
let soalDitampilkan = [];

function getDataFromDatabase() {
    const reference = ref(db, 'soalSulit/');
    onChildAdded(reference, function(data) {
        console.log(data.val());
        soal.push(data.val());
    });
}
getDataFromDatabase();

let soalSekarang = document.getElementById('soalSekarang');
let totalSoal = document.getElementById('totalSoal');
let pertanyaan = document.getElementById('pertanyaan');
let answerParent = document.getElementById('answerParent');
let sisaWaktu = document.querySelector(".sisa-Waktu");

let indexNum = 0;
let nilai = 0;
let hitung = 15;
let hitungMundur;

window.cekPertanyaan = function(a, b) {
    if (a == b) {
        Swal.fire({
            title: "Kamu Benar!",
            icon: "success"
        }).then(() => {
            nilai += 10;
            clearInterval(hitungMundur);
            soalSelanjutnya();
        });
    } else {
        Swal.fire({
            title: "Jawaban Salah",
            icon: "error"
        }).then(() => {
            clearInterval(hitungMundur);
            soalSelanjutnya();
        });
    }
};

window.soalSelanjutnya = function() {
    if (indexNum + 1 === soal.length) {
        tampilNilai();
    } else {
        indexNum++;
        renderQuestion();
        resetTimer();
        tampilWaktu();
    }
};

function renderQuestion() {
    // Memilih soal secara acak yang belum ditampilkan
    let soalTerpilih;
    do {
        soalTerpilih = soal[Math.floor(Math.random() * soal.length)];
    } while (soalDitampilkan.includes(soalTerpilih));
    
    soalDitampilkan.push(soalTerpilih);

    soalSekarang.innerHTML = indexNum + 1;
    totalSoal.innerHTML = soal.length;

    pertanyaan.innerHTML = soalTerpilih.pertanyaan;

    answerParent.innerHTML = '';
    for (let i = 0; i < soalTerpilih.pilihan.length; i++) {
        answerParent.innerHTML += `<button onclick="cekPertanyaan('${soalTerpilih.pilihan[i]}', '${soalTerpilih.benar}')" class='card p-2 m-1 align-items-center btn btn-outline-secondary border-2'>${soalTerpilih.pilihan[i]}</button>`;
    }
    resetTimer();
}

function resetTimer() {
    clearInterval(hitungMundur);
    hitung = 15;
    sisaWaktu.innerHTML = `<i class="fa-solid fa-stopwatch" style="font-size: 24px;"></i> ${hitung}s`;
}

const tampilWaktu = () => {
    hitungMundur = setInterval(() => {
        hitung--;
        sisaWaktu.innerHTML = `<i class="fa-solid fa-stopwatch" style="font-size: 24px;"></i> ${hitung}s`;
        if (hitung === 0) {
            clearInterval(hitungMundur);
            soalSelanjutnya();
        }
    }, 1000);
};

function tampilNilai() {
    document.getElementById("kuisCard").innerHTML = `<div class="card-body"><h5 class="card-title m-3 text-center" style="font-size: x-large;">Kamu mendapatkan nilai : <br><p class="mt-2">${nilai}</p></h5></div>`;
}

document.getElementById("mulaiButton").addEventListener("click", function() {
    document.getElementById("mulaiButton").classList.add("hidden");
    document.getElementById("kuisCard").classList.remove("hidden");
    renderQuestion();
    tampilWaktu();
});
