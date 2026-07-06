let pid = "";
let mode = "";
let questions = [];
let current = 0;
let answers = [];

function go() {
    const pidField = document.getElementById("pid");

    if (!pidField) {
        alert("Fant ikke deltakerfeltet.");
        return;
    }

    pid = pidField.value.trim();

    if (pid === "") {
        alert("Skriv inn deltaker-ID");
        return;
    }

    document.getElementById("start").style.display = "none";
    document.getElementById("mode").style.display = "block";
}

function start() {

    const selected =
        document.querySelector('input[name="m"]:checked');

    if (!selected) {
        alert("Velg Med karakterer eller Uten karakterer");
        return;
    }

    mode = selected.value;

    fetch(`/data/${mode}.json`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            questions = data;
            current = 0;
            answers = [];

            document.getElementById("mode").style.display = "none";
            document.getElementById("questionPage").style.display = "block";

            showQuestion();
        })
        .catch(function(error) {

            console.error(error);

            alert(
                "Kunne ikke laste spørreskjemaet. Sjekk med.json eller uten.json."
            );
        });
}

function showQuestion() {

    if (current < 0 || current >= questions.length) {
        return;
    }

    const q = questions[current];

    document.getElementById("questionNumber").innerText =
        "Spørsmål " +
        (current + 1) +
        " av " +
        questions.length;

    document.getElementById("questionText").innerText =
        q.text;

    const answerArea =
        document.getElementById("answerArea");

    let html = "";

    if (q.type === "radio") {

        q.options.forEach(function(option) {

            html +=
                '<label>' +
                '<input type="radio" name="answer" value="' +
                option +
                '">' +
                option +
                '</label><br>';
        });
    }

    else if (q.type === "checkbox") {

        q.options.forEach(function(option) {

            html +=
                '<label>' +
                '<input type="checkbox" name="answer" value="' +
                option +
                '">' +
                option +
                '</label><br>';
        });
    }

    else if (q.type === "text") {

        html =
            '<textarea id="textAnswer" rows="6" style="width:100%;"></textarea>';
    }

    else if (q.type === "scale") {

        html = "";

        for (let i = q.min; i <= q.max; i++) {

            html +=
                '<label style="margin-right:10px;">' +
                '<input type="radio" name="answer" value="' +
                i +
                '">' +
                i +
                '</label>';
        }
    }

    answerArea.innerHTML = html;

    restoreAnswer();
}

function restoreAnswer() {

    const saved = answers[current];

    if (saved === undefined) {
        return;
    }

    if (Array.isArray(saved)) {

        saved.forEach(function(value) {

            const el =
                document.querySelector(
                    'input[value="' + value + '"]'
                );

            if (el) {
                el.checked = true;
            }
        });

        return;
    }

    const textField =
        document.getElementById("textAnswer");

    if (textField) {
        textField.value = saved;
        return;
    }

    const radio =
        document.querySelector(
            'input[value="' + saved + '"]'
        );

    if (radio) {
        radio.checked = true;
    }
}

function collectAnswer() {

    const q = questions[current];

    if (q.type === "radio" || q.type === "scale") {

        const selected =
            document.querySelector(
