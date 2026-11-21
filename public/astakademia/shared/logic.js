// The joining page's logic (D28): plain functions, no page access, tested in the server
// suite (backend/test/page.test.ts) against the same contracts as the Worker and the app.

/** The Worker the page talks to: the app's own (project.yml ASTAKADEMIA_API_BASE_URL). */
export const API_BASE = "https://academic-hub-api.hackedutechlabs.workers.dev";

/** From contracts/join.json (a test keeps them equal): the code's alphabet and length, and the
 *  limits the Worker refuses beyond. */
export const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
export const CODE_LENGTH = 10;
export const LIMITS = { max_name_length: 100, max_other_interest_length: 60 };

/** A code as typed: spaces and hyphens removed, upper-cased; null unless every character is
 *  in the alphabet and the length is right (contracts/join.json code.normalise). */
export function normaliseCode(typed, alphabet, length) {
  if (typeof typed !== "string") return null;
  const code = typed.replace(/[\s-]+/g, "").toUpperCase();
  if (code.length !== length) return null;
  for (const c of code) if (!alphabet.includes(c)) return null;
  return code;
}

/** The code after '#k=' in the page's address. A browser never sends this part to the host. */
export function codeFromAddress(hash, alphabet, length) {
  const match = /^#k=(.*)$/.exec(hash || "");
  return match ? normaliseCode(decodeURIComponent(match[1]), alphabet, length) : null;
}

/** A matric number as the Worker reads it: spaces removed, upper-cased, letters and digits. */
export function normaliseMatric(typed) {
  const m = String(typed ?? "").toUpperCase().replace(/\s+/g, "");
  return /^[A-Z0-9]{1,20}$/.test(m) ? m : null;
}

/** The student's own ILS result: per scale, the larger count minus the smaller, the letter of
 *  the larger and its band (contracts/ils.json). Empty unless every item is answered. */
export function scoreAnswers(answers, scales, bands) {
  const total = scales.reduce((n, s) => n + s.items.length, 0);
  if (typeof answers !== "string" || answers.length !== total || /[^ab]/.test(answers)) return [];
  return scales.map((s) => {
    const a = s.items.filter((n) => answers[n - 1] === "a").length;
    const b = s.items.length - a;
    const score = Math.abs(a - b);
    const band = bands.find((x) => x.min <= score && score <= x.max);
    return { code: s.code, a, b, score, letter: a > b ? "a" : "b", band: band ? band.code : "" };
  });
}

/** The first detail that would be refused, by its field name, or null. */
export function detailsProblem(d, stateCodes, limits) {
  if (!normaliseMatric(d.matric)) return "matric";
  const name = String(d.name ?? "").trim();
  if (!name || name.length > limits.max_name_length) return "name";
  if (!stateCodes.includes(d.home_state)) return "home_state";
  if (!Array.isArray(d.interests) || d.interests.length === 0) return "interests";
  if (d.interests.includes("other")) {
    const other = String(d.interests_other ?? "").trim();
    if (!other || other.length > limits.max_other_interest_length) return "interests_other";
  }
  return null;
}

/** The body of POST /v1/join (contracts/join.json endpoints.submit.request). */
export function submission(code, d, answers, browserId) {
  return {
    code,
    matric: normaliseMatric(d.matric),
    name: String(d.name).trim(),
    home_state: d.home_state,
    interests: [...d.interests],
    interests_other: d.interests.includes("other") ? String(d.interests_other).trim() : null,
    ils_answers: answers,
    browser_id: browserId,
  };
}

/** The attendance page's code and token from after '#h=' (contracts/attendance.json page):
 *  the lecture's code, a dot, and the six-character token of the moment. */
export function attendFromAddress(hash, alphabet, length) {
  const match = /^#h=([^.]*)\.([A-Za-z0-9]{6})$/.exec(hash || "");
  if (!match) return null;
  const code = normaliseCode(decodeURIComponent(match[1]), alphabet, length);
  return code ? { code, token: match[2].toUpperCase() } : null;
}

/** The body of POST /v1/attend (contracts/attendance.json endpoints.attend.request). */
export function attendSubmission(code, token, matric, browserId) {
  return { code, token, matric: normaliseMatric(matric), browser_id: browserId };
}
