let pid;
let mode;
let questions = [];
let current = 0;
let answers = [];

function go() {
    pid = document.getElementById("pid").value.trim();

    if (!pid) {
        alert("Skriv inn deltaker-ID");
        return;
    }

    document.getElementById("start").style.display = "none";
    document.getElementById("mode").style.display = "block";
}

function start() {
    const selected = document.querySelector("input[name=m]:checked");

    if (!selected) {
        alert("Velg skjema");
        return;
    }

    mode = selected.value;

    fetch(`/data/${mode}.json`)
        .then(r => r.json())
        .then(data => {
            questions = data;
            current = 0;

            document.getElementById("mode").style.display = "none";
            document.getElementById("questionPage").style.display = "block";

            showQuestion();
        });
}

function showQuestion() {

    const q = questions[current];

    document.getElementById("questionNumber").innerText =
        `Spørsmål ${current + 1} av ${questions.length}`;

    document.getElementById("questionText").innerText = q.text;

    const area = document.getElementById("answerArea");

    let html = "";

    if (q.type === "radio") {
        q.options.forEach(option => {
            html += `
            <label>
              <input type="radio" name="answer" value="${option}">
              ${option}
            </label><br>
            `;
        });
    }

    else if (q.type === "checkbox") {
        q.options.forEach(option => {
            html += `
            <label>
              <input type="checkbox" name="answer" value="${option}">
              ${option}
            </label><br>
            `;
        });
    }

    else if (q.type === "text") {
        html = `
            <textarea
                id="textAnswer"
                rows="6"
                placeholder="Skriv svaret ditt her..."
            ></textarea>
        `;
    }

    else if (q.type === "scale") {

        html = `<div class="scale">`;

        for (let i = q.min; i <= q.max; i++) {
            html += `
                <label>
                    <input type="radio"
                           name="answer"
                           value="${i}">
                    ${i}
                </label>
            `;
        }

        html += `</div>`;
    }

    area.innerHTML = html;

    if (answers[current]) {
        restoreAnswer();
    }
}

function restoreAnswer() {

    const saved = answers[current];

    if (!saved) return;

    if (Array.isArray(saved)) {

        saved.forEach(value => {

            const el =
                document.querySelector(
                    `input[value="${value}"]`
                );

            if (el) el.checked = true;
        });

    } else {

        const radio =
            document.querySelector(
                `input[value="${saved}"]`
            );

        if (radio) radio.checked = true;

        const text =
            document.getElementById("textAnswer");

        if (text) text.value = saved;
    }
}

function collectAnswer() {

    const q = questions[current];

    if (q.type === "radio" || q.type === "scale") {

        const selected =
            document.querySelector(
                "input[name=answer]:checked"
            );

        return selected ? selected.value : null;
    }

    if (q.type === "checkbox") {

        return Array.from(
            document.querySelectorAll(
                "input[name=answer]:checked"
            )
        ).map(x => x.value);
    }

    if (q.type === "text") {

        return document
            .getElementById("textAnswer")
            .value;
    }

    return null;
}

function next() {

    answers[current] = collectAnswer();

    current++;

    if (current >= questions.length) {

        fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                participantId: pid,
                mode,
                answers
            })
        })
        .then(() => {

            document.getElementById(
                "questionPage"
            ).style.display = "none";

            document.getElementById(
                "done"
            ).style.display = "block";
        });

        return;
    }

    showQuestion();
}

function back() {

    if (current === 0) return;

    answers[current] = collectAnswer();

    current--;

    showQuestion();
}
``
