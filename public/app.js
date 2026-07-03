let pid;
let questions = [];
let index = 0;
let answers = [];

function nextStep() {
  pid = document.getElementById("pid").value;

  document.getElementById("start").style.display = "none";
  document.getElementById("choose").style.display = "block";
}

async function start(type) {
  const res = await fetch(`/api/survey/${type}`);
  questions = await res.json();

  document.getElementById("choose").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  show();
}

function show() {
  document.getElementById("question").innerText =
    `Spørsmål ${index + 1} av ${questions.length}`;

  const q = questions[index];

  let html = "";

  q.options.forEach(o => {
    html += `<label><input type="checkbox" value="${o}"> ${o}</label><br>`;
  });

  document.getElementById("options").innerHTML = html;
}

function next() {
  const selected = [...document.querySelectorAll("input:checked")]
    .map(e => e.value);

  answers[index] = {
    answer: selected,
    comment: document.getElementById("comment").value
  };

  index++;

  if (index >= questions.length) {
    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pid, answers })
    });

    document.getElementById("quiz").style.display = "none";
    document.getElementById("done").style.display = "block";
  } else {
    show();
  }
}

function back() {
  if (index > 0) index--;
  show();
}
