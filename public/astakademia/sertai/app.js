// The joining page (D28; the design canvas, boards 3 to 6). The code comes from after '#k='
// (never sent to this page's host) or is typed; the page talks only to the Worker's two public
// endpoints, with the code in the body. Text from the server is always set as text, never HTML.
import { CODE_ALPHABET as ALPHABET, CODE_LENGTH as LENGTH, LIMITS, codeFromAddress, detailsProblem, normaliseCode, scoreAnswers, submission } from "../shared/logic.js";
import { browserId, el, post, problem, savedStudent, show as showIn, store } from "../shared/page.js";

const page = document.getElementById("page");
const place = document.getElementById("place");

let code = null;
let info = null;
/** What the student has entered so far, kept on this phone until it is sent. */
let state = { step: "welcome", details: { matric: "", name: "", home_state: "", interests: [], interests_other: "" }, answers: "", question: 0 };

// MARK: Progress on this phone (it may be blocked: the page works without it)

const progressKey = () => `astakademia.join.${code}`;
const save = () => store.set(progressKey(), JSON.stringify(state));
function restore() {
  try {
    const saved = JSON.parse(store.get(progressKey()) || "null");
    if (saved && saved.details && typeof saved.answers === "string") state = { ...state, ...saved };
  } catch { /* start afresh */ }
}

// MARK: Building the page

const show = (...nodes) => showIn(page, ...nodes);
const stepLine = (n) => el("p", { class: "step" }, `Langkah ${n} daripada 4`);

const closedText = {
  404: "Kod ini tidak dikenali. Semak kod di skrin kelas dan cuba lagi.",
  410: "Kod ini sudah ditutup. Minta pensyarah anda menunjukkan kod baharu.",
  0: "Tiada sambungan internet. Semak talian anda dan cuba lagi.",
};

// MARK: Steps

function askForCode(message) {
  const input = el("input", { type: "text", class: "code-input", id: "code", autocomplete: "off", autocapitalize: "characters", spellcheck: "false", inputmode: "text", placeholder: "ABCDE-FGHJK", "aria-describedby": "code-hint" });
  const form = el("form", {
    onsubmit: (e) => {
      e.preventDefault();
      const typed = normaliseCode(input.value, ALPHABET, LENGTH);
      if (!typed) { show(...askForCode("Kod mempunyai 10 huruf dan nombor, seperti di skrin kelas.").childNodes); return; }
      location.hash = `k=${typed}`;
      start(typed);
    },
  },
    el("label", { class: "field", for: "code" }, "Kod kelas"),
    input,
    el("p", { class: "hint", id: "code-hint" }, "Taip kod yang ditunjukkan di skrin kelas."),
    message ? problem(message) : null,
    el("div", { class: "actions" }, el("button", { class: "primary", type: "submit" }, "Teruskan")),
  );
  const wrap = el("div", {}, el("h1", {}, "Sertai kelas"), form);
  return wrap;
}

async function start(typed) {
  code = typed;
  page.replaceChildren(el("p", { class: "muted" }, "Memuatkan…"));
  const res = await post("/v1/join/info", { code });
  if (res.status !== 200 || !res.data) {
    show(...askForCode(closedText[res.status] || "Halaman ini tidak dapat dimuatkan. Cuba lagi sebentar lagi.").childNodes);
    return;
  }
  info = res.data;
  place.textContent = `${info.course_code} · Kumpulan ${info.group_code}`;
  restore();
  render();
}

function render() {
  save();
  if (state.step === "details") return details();
  if (state.step === "survey") return survey();
  return welcome();
}

function welcome() {
  show(
    stepLine(1),
    el("h1", {}, "Sertai kelas ini"),
    el("p", {}, `${info.course_code} ${info.course_name}, Kumpulan ${info.group_code}, ${info.semester_code}. Pensyarah anda menggunakan Astakademia untuk senarai kelas. Lebih kurang 10 minit.`),
    el("div", { class: "card" },
      el("h2", {}, "Apa yang ditanya, dan sebabnya"),
      el("ul", {},
        el("li", {}, el("strong", {}, "No. matrik dan nama"), ": untuk senarai kelas."),
        el("li", {}, el("strong", {}, "Negeri asal dan minat"), ": supaya pensyarah mengenali kelas."),
        el("li", {}, el("strong", {}, "Gaya pembelajaran"), `: ${info.ils.items.length} soalan ringkas (Index of Learning Styles) tentang cara anda suka belajar.`),
      ),
      el("p", {}, "Hanya pensyarah anda melihat jawapan ini. Rakan sekelas tidak. Pensyarah boleh memadam rekod anda bila-bila masa."),
      el("p", { class: "small muted" }, "Semua soalan wajib dijawab."),
    ),
    el("div", { class: "actions" }, el("button", { class: "primary", type: "button", onclick: () => { state.step = "details"; render(); } }, "Mula")),
  );
}

function details() {
  const d = state.details;
  const field = (id, labelText, input, hint) => [el("label", { class: "field", for: id }, labelText), input, hint ? el("p", { class: "hint" }, hint) : null];
  const matric = el("input", { type: "text", id: "matric", value: d.matric, autocomplete: "off", autocapitalize: "characters", spellcheck: "false", maxlength: "24" });
  const name = el("input", { type: "text", id: "name", value: d.name, autocomplete: "name", maxlength: String(LIMITS.max_name_length) });
  const stateSelect = el("select", { id: "home_state" },
    el("option", { value: "" }, "Pilih negeri"),
    info.states.map((s) => el("option", { value: s.code, selected: s.code === d.home_state }, s.ms)),
  );
  const other = el("input", { type: "text", id: "interests_other", value: d.interests_other, maxlength: String(LIMITS.max_other_interest_length), "aria-label": "Minat lain" });
  const otherWrap = el("div", { hidden: !d.interests.includes("other") }, other);
  const boxes = info.interests.map((i) => {
    const box = el("input", { type: "checkbox", value: i.code, checked: d.interests.includes(i.code) });
    if (i.code === "other") box.addEventListener("change", () => { otherWrap.hidden = !box.checked; });
    return el("label", { class: "choice" }, box, el("span", {}, i.ms));
  });
  const message = el("div");
  const read = () => ({
    matric: matric.value, name: name.value, home_state: stateSelect.value,
    interests: boxes.map((b) => b.querySelector("input")).filter((b) => b.checked).map((b) => b.value),
    interests_other: other.value,
  });
  const words = {
    matric: "Semak no. matrik: huruf dan nombor sahaja, tanpa sengkang.",
    name: "Isi nama penuh anda.",
    home_state: "Pilih negeri asal anda.",
    interests: "Pilih sekurang-kurangnya satu minat.",
    interests_other: "Tulis minat lain anda secara ringkas.",
  };
  show(
    stepLine(2),
    el("h1", {}, "Tentang anda"),
    field("matric", "No. matrik", matric, "Huruf dan nombor sahaja, seperti pada kad pelajar anda. Semak sebelum menghantar."),
    field("name", "Nama penuh", name),
    field("home_state", "Negeri asal", stateSelect),
    el("fieldset", { class: "card" },
      el("legend", { class: "field" }, "Minat anda (pilih seberapa banyak)"),
      el("div", { class: "choices" }, boxes),
      otherWrap,
    ),
    message,
    el("div", { class: "actions" },
      el("button", { type: "button", onclick: () => { state.details = read(); state.step = "welcome"; render(); } }, "Kembali"),
      el("button", { class: "primary", type: "button", onclick: () => {
        const now = read();
        state.details = now;
        save();
        const wrong = detailsProblem(now, info.states.map((s) => s.code), LIMITS);
        if (wrong) {
          message.replaceChildren(problem(words[wrong]));
          document.getElementById(wrong === "interests" ? "interests_other" : wrong)?.focus();
          return;
        }
        state.step = "survey";
        state.question = Math.min(state.answers.length, info.ils.items.length - 1);
        render();
      } }, "Seterusnya"),
    ),
  );
}

function survey() {
  const items = info.ils.items;
  const n = state.question;
  const item = items[n];
  const chosen = state.answers[n] || "";
  const pick = (letter) => {
    const a = state.answers.padEnd(n, "?").split("");
    a[n] = letter;
    state.answers = a.join("").replace(/\?+$/, "");
    save();
    if (n < items.length - 1) { state.question = n + 1; render(); } else { survey(); }
  };
  const option = (letter, text) => el("label", { class: "choice" },
    el("input", { type: "radio", name: "answer", value: letter, checked: chosen === letter, onchange: () => pick(letter) }),
    el("span", {}, el("span", { class: "letter" }, `(${letter}) `), text),
  );
  const complete = state.answers.length === items.length && !/[^ab]/.test(state.answers);
  const sendProblem = el("div");
  show(
    stepLine(3),
    el("h1", {}, "Gaya pembelajaran"),
    el("div", { class: "progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(items.length), "aria-valuenow": String(n + 1), "aria-label": `Soalan ${n + 1} daripada ${items.length}` },
      el("span", { style: null })),
    el("p", { class: "small muted" }, `${n + 1} / ${items.length}`),
    n === 0 ? el("p", { class: "small muted", lang: "en" }, info.ils.directions) : null,
    el("fieldset", { class: "card", lang: "en" },
      el("legend", { class: "question" }, `${item.n}. ${item.stem}`),
      el("div", { class: "choices" }, option("a", item.a), option("b", item.b)),
    ),
    el("p", { class: "small muted" }, "Jawapan disimpan pada telefon ini semasa anda menjawab, jadi anda boleh sambung jika talian terputus."),
    sendProblem,
    el("div", { class: "actions" },
      el("button", { type: "button", onclick: () => { if (n === 0) { state.step = "details"; } else { state.question = n - 1; } render(); } }, "Sebelum"),
      n < items.length - 1
        ? el("button", { class: "primary", type: "button", disabled: !chosen, onclick: () => { state.question = n + 1; render(); } }, "Seterusnya")
        : el("button", { class: "primary", type: "button", disabled: !complete, onclick: (e) => send(e.currentTarget, sendProblem) }, "Hantar"),
    ),
    el("p", { class: "credit", lang: "en" }, info.ils.credit),
  );
  // The bar's width is set in script, so the page's style policy needs no inline styles.
  page.querySelector(".progress span").style.width = `${((n + 1) / items.length) * 100}%`;
}

const sendText = {
  400: "Ada maklumat yang tidak lengkap. Semak no. matrik, nama, negeri dan minat anda.",
  404: closedText[404],
  410: closedText[410],
  429: "Kod ini telah menerima terlalu banyak hantaran. Minta pensyarah anda menunjukkan kod baharu.",
  0: closedText[0],
};

async function send(button, where) {
  button.disabled = true;
  where.replaceChildren(el("p", { class: "muted" }, "Menghantar…"));
  let res;
  try {
    res = await post("/v1/join", submission(code, state.details, state.answers, browserId()));
  } catch {
    res = { status: -1 }; // never leave the student stuck on "Menghantar"
  }
  if (res.status !== 202) {
    button.disabled = false;
    where.replaceChildren(problem(sendText[res.status] || "Jawapan tidak dapat dihantar. Cuba lagi sebentar lagi."));
    if (res.status === 400 && res.data?.field && res.data.field !== "ils_answers") {
      state.step = "details";
      save();
    }
    return;
  }
  const results = scoreAnswers(state.answers, info.ils.scales, info.ils.bands);
  store.remove(progressKey()); // sent: the answers do not stay on this phone
  savedStudent.set(submission(code, state.details, "", "").matric, state.details.name.trim()); // for attendance (D28)
  done(results);
}

function done(results) {
  const bandWords = { balanced: "seimbang", moderate: "kecenderungan sederhana", strong: "kecenderungan kuat" };
  show(
    el("p", { class: "step" }, "Selesai"),
    el("h1", {}, "Maklumat anda telah dihantar"),
    el("p", {}, `Pensyarah anda akan menyemak dan menambah anda ke ${info.course_code} Kumpulan ${info.group_code}. Jika ada masalah, pensyarah akan menghubungi anda.`),
    results.length ? el("div", { class: "card" },
      el("h2", {}, "Profil pembelajaran anda"),
      results.map((r) => {
        const s = info.ils.scales.find((x) => x.code === r.code);
        return el("div", { class: "result" },
          el("span", { class: r.letter === "a" && r.score > 3 ? "end lean" : "end" }, s.a_ms),
          el("span", { class: "score" }, `${r.score}${r.letter.toUpperCase()} · ${bandWords[r.band] || ""}`),
          el("span", { class: r.letter === "b" && r.score > 3 ? "end lean" : "end" }, s.b_ms),
        );
      }),
      el("p", { class: "small muted" }, "Ini menggambarkan cara anda suka belajar, bukan kebolehan anda. Kebanyakan orang berada di tengah bagi sesetengah skala."),
    ) : null,
    el("p", { class: "muted" }, "Anda boleh menutup halaman ini."),
  );
}

// MARK: Start

const fromAddress = codeFromAddress(location.hash, ALPHABET, LENGTH);
if (fromAddress) start(fromAddress); else show(...askForCode().childNodes);
