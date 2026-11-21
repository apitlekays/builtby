// The public pages' shared helpers (D28): storage on the phone that may be blocked, the
// browser id for the shared-phone hint, building the page from text (never HTML), and the
// Worker's two-call shape with its retry while a class sends at once. DOM code, used by
// web/sertai and web/hadir; the plain logic is in logic.js, tested in the server suite.
import { API_BASE } from "./logic.js";

export const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* private mode */ } },
  remove(key) { try { localStorage.removeItem(key); } catch { /* private mode */ } },
};

/** A random id for this browser, so he can see when one phone answered for two students. */
export function browserId() {
  let id = store.get("astakademia.browser");
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    id = newId();
    store.set("astakademia.browser", id);
  }
  return id;
}

/** A version 4 UUID, also on phone browsers without crypto.randomUUID. */
function newId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** The student this phone joined as (D28): their matric number and name, for attendance. */
export const savedStudent = {
  get() {
    try {
      const s = JSON.parse(store.get("astakademia.student") || "null");
      return s && typeof s.matric === "string" ? s : null;
    } catch { return null; }
  },
  set(matric, name) { store.set("astakademia.student", JSON.stringify({ matric, name: name || null })); },
  clear() { store.remove("astakademia.student"); },
};

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else if (v === true) node.setAttribute(k, "");
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const c of children.flat()) if (c != null) node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return node;
}

export function show(page, ...nodes) {
  page.replaceChildren(...nodes.flat(Infinity).filter((n) => n != null));
  window.scrollTo(0, 0);
  const heading = page.querySelector("h1");
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
}

export const problem = (text) => el("p", { class: "problem", role: "alert" }, text);

/** POST to the Worker, trying again while it is busy (a whole class at once). */
export async function post(path, body) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(API_BASE + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), credentials: "omit", referrerPolicy: "no-referrer" });
    } catch {
      return { status: 0 };
    }
    // Busy: a whole class is sending at once. Wait a little and try again.
    if (res.status === 503 && attempt < 4) { await new Promise((r) => setTimeout(r, 800 * (attempt + 1))); continue; }
    let data = null;
    try { data = await res.json(); } catch { /* no body */ }
    return { status: res.status, data };
  }
}
