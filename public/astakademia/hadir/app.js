// The attendance page (D28, D33; the design canvas, boards 7 to 9). The lecture's code and the
// token of the moment come from after '#h='; the page talks only to the Worker's two public
// endpoints. A phone that joined the class knows its student and sends at once; otherwise the
// matric number is typed once and kept. The page never knows whether the Worker counted the
// student present, so it says "Dihantar", never "Hadir".
import { CODE_ALPHABET as alphabet, CODE_LENGTH as length, attendFromAddress, attendSubmission, normaliseMatric } from "../shared/logic.js";
import { browserId, el, post, problem, savedStudent, show as showIn } from "../shared/page.js";

const page = document.getElementById("page");
const place = document.getElementById("place");
const show = (...nodes) => showIn(page, ...nodes);

const scanned = attendFromAddress(location.hash, alphabet, length);
let info = null;

const lectureLine = () => info ? `${info.course_code} · Kumpulan ${info.group_code} · ${info.starts_at}-${info.ends_at}${info.venue ? ` · ${info.venue}` : ""}` : "";

function stale() {
  show(
    el("h1", {}, "Kod ini sudah tamat"),
    el("p", {}, "Kod di skrin bertukar setiap 20 saat. Imbas kod yang dipaparkan sekarang."),
  );
}

function closed() {
  show(el("h1", {}, "Kehadiran ditutup"), el("p", {}, "Kehadiran kuliah ini sudah ditutup."));
}

function offline(retry) {
  show(
    el("h1", {}, "Tiada talian"),
    el("p", {}, "Tiada talian. Cuba imbas sekali lagi."),
    el("div", { class: "actions" }, el("button", { class: "primary", type: "button", onclick: retry }, "Cuba lagi")),
  );
}

async function start() {
  if (!scanned) {
    show(el("h1", {}, "Imbas kod di skrin kelas"), el("p", {}, "Halaman ini dibuka dengan mengimbas kod kehadiran yang dipaparkan oleh pensyarah anda."));
    return;
  }
  page.replaceChildren(el("p", { class: "muted" }, "Memuatkan…"));
  const res = await post("/v1/attend/info", { code: scanned.code });
  if (res.status === 410) return closed();
  if (res.status === 0) return offline(start);
  if (res.status !== 200 || !res.data) {
    return show(el("h1", {}, "Kod tidak dikenali"), el("p", {}, "Imbas kod yang dipaparkan di skrin kelas sekali lagi."));
  }
  info = res.data;
  place.textContent = lectureLine();
  const known = savedStudent.get();
  if (known) return send(known.matric, known.name);
  return firstTime();
}

function firstTime(message) {
  const input = el("input", { type: "text", id: "matric", autocomplete: "off", autocapitalize: "characters", spellcheck: "false", maxlength: "24", "aria-describedby": "matric-hint" });
  show(
    el("p", { class: "step" }, lectureLine()),
    el("h1", {}, "Rekod kehadiran"),
    el("p", {}, "Telefon ini belum mengenali anda. Taip no. matrik sekali; selepas ini satu imbasan sahaja."),
    el("form", {
      onsubmit: (e) => {
        e.preventDefault();
        const matric = normaliseMatric(input.value);
        if (!matric) { firstTime("Semak no. matrik: huruf dan nombor sahaja, tanpa sengkang."); return; }
        // Kept first: if the code changes while it is sent, the next scan needs no typing.
        savedStudent.set(matric, null);
        send(matric, null);
      },
    },
      el("label", { class: "field", for: "matric" }, "No. matrik"),
      input,
      el("p", { class: "hint", id: "matric-hint" }, `Hanya pelajar dalam senarai ${info.course_code} Kumpulan ${info.group_code} boleh merekod kehadiran di sini.`),
      message ? problem(message) : null,
      el("div", { class: "actions" }, el("button", { class: "primary", type: "submit" }, "Saya hadir")),
    ),
  );
}

async function send(matric, name) {
  page.replaceChildren(el("p", { class: "muted" }, "Menghantar…"));
  let res;
  try {
    res = await post("/v1/attend", attendSubmission(scanned.code, scanned.token, matric, browserId()));
  } catch {
    res = { status: -1 };
  }
  if (res.status === 409) return stale();
  if (res.status === 410) return closed();
  if (res.status === 0) return offline(() => send(matric, name));
  if (res.status === 400) {
    savedStudent.clear();
    return firstTime("Semak no. matrik: huruf dan nombor sahaja, tanpa sengkang.");
  }
  if (res.status !== 202) {
    return show(el("h1", {}, "Tidak dapat dihantar"), el("p", {}, "Cuba imbas kod di skrin sekali lagi sebentar lagi."));
  }
  const at = new Date().toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kuala_Lumpur" });
  show(
    el("p", { class: "step" }, lectureLine()),
    el("h1", {}, "Dihantar"),
    el("div", { class: "card" },
      name ? el("p", {}, el("strong", {}, name)) : null,
      el("p", { class: "code-input" }, matric),
      el("p", { class: "small muted" }, `Dihantar pada ${at}`),
    ),
    el("p", { class: "small muted" }, name
      ? "Nama dan no. matrik ini disimpan di telefon anda semasa menyertai kelas. Tunjukkan skrin ini jika pensyarah bertanya."
      : "No. matrik ini disimpan di telefon anda. Tunjukkan skrin ini jika pensyarah bertanya."),
    el("div", { class: "actions" }, el("button", { type: "button", onclick: () => { savedStudent.clear(); firstTime(); } }, "Bukan anda? Tukar pelajar di telefon ini")),
  );
}

start();
