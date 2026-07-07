let questions = [];
let current = 0;
let answers = [];

document.addEventListener("DOMContentLoaded", () => {

    const nextBtn = document.getElementById("nextBtn");
    const startBtn = document.getElementById("startBtn");
    const backBtn = document.getElementById("backBtn");
    const questionNextBtn = document.getElementById("questionNextBtn");

    if (nextBtn) {
        nextBtn.addEventListener("click", go);
    }

    if (startBtn) {
        startBtn.addEventListener("click", startSurvey);
    }

    if (backBtn) {
        backBtn.addEventListener("click", previousQuestion);
    }

    if (questionNextBtn) {
        questionNextBtn.addEventListener("click", nextQuestion);
    }

});

function go() {

    const pid = document.getElementById("pid").value.trim();

    if (!pid) {
        alert("Skriv inn deltaker-ID");
        return;
    }

    document.getElementById("start").style.display = "none";
    document.getElementById("mode").style.display = "block";
}

function startSurvey() {

    const selected =
        document.querySelector('input[name="m"]:checked');

    if (!selected) {
        alert("Velg spørreskjema");
        return;
    }

    const mode = selected.value;

    fetch("/data/" + mode + ".json")
        .then(response => response.json())
        .then(data => {

            questions = data;
            current = 0;
            answers = [];

            document.getElementById("mode").style.display = "none";
            document.getElementById("questionPage").style.display = "block";

            showQuestion();

        })
        .catch(error => {

            console.error(error);
            alert("Kunne ikke laste spørreskjemaet.");

        });
}

function showQuestion() {

    const q = questions[current];

    document.getElementById("questionNumber").innerText =
        `Spørsmål ${current + 1} av ${questions.length}`;

    document.getElementById("questionText").innerText =
        q.text;

    let html = "";

    if (q.type === "radio") {

        q.options.forEach(option => {

