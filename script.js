/* =========================================================
   CONFIG
========================================================= */
const API_URL =
  "https://script.google.com/macros/s/AKfycbwluQOhq2B67N1Jqt1DlTiV5arth0ukzac5ugn30i-lVPwlMCT4LFsjkxcfJbSqzCK_dw/exec";

/* =========================================================
   MASTER DATA
========================================================= */
const TEACHERS = [
  "Ishtiaque Ahmed","Debanjon Chakraborty","Sumona Afroz (SA)",
  "Md. Naymul Islam Nayoun","Dr. Bimal Chandra Das (BCD)",
  "Rafi Al Mahmud (RAM)","Shadab Sheper (SBS)","Unknown"
];

const DEPARTMENTS = ["CSE", "Others"];

const COURSES = [
  "ACT211","ACT301","ACT322","ACT327","AOL101","BNS101",
  "CSE112","CSE113","CSE114","CSE115","CSE121","CSE122",
  "CSE123","CSE124","CSE131","CSE132","CSE133","CSE134","CSE135"
];

const ROOMS = [
  "201","208","213","216","217","218","219","220","221","222","223","224",
  "302","303","304","305","306","307","318(A)","318(B)","320"
];

const TIMES = [
  "8:30 AM - 10:00 AM",
  "10:00 AM - 11:30 AM",
  "11:30 AM - 1:00 PM",
  "1:00 PM - 2:30 PM",
  "2:30 PM - 4:00 PM",
  "4:00 PM - 5:30 PM"
];

/* =========================================================
   HELPERS
========================================================= */
function populateSelect(id, list) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = "";
  list.forEach(v => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    sel.appendChild(o);
  });
}

function formatBDDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    timeZone: "Asia/Dhaka"
  });
}

async function post(payload) {
  const r = await fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams(payload)
  });
  return r.json();
}

/* =========================================================
   SMART DROPDOWN (FIXED + MATCHES HTML)
========================================================= */
function initSmartDropdowns() {
  document.querySelectorAll(".smart-filter").forEach(input => {
    const select = document.getElementById(input.dataset.target);
    if (!select) return;

    input.addEventListener("focus", () => {
      input.classList.add("show");
      filterOptions(input, select);
    });

    input.addEventListener("input", () => {
      input.classList.add("show");
      filterOptions(input, select);
    });

    select.addEventListener("change", () => {
      input.value = select.value;
      input.classList.remove("show");
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.classList.contains("smart-filter")) {
      document.querySelectorAll(".smart-filter").forEach(i =>
        i.classList.remove("show")
      );
    }
  });
}

function filterOptions(input, select) {
  const q = input.value.toLowerCase();
  let visible = false;

  [...select.options].forEach(opt => {
    const match = opt.text.toLowerCase().includes(q);
    opt.style.display = match ? "" : "none";
    if (match) visible = true;
  });

  input.classList.toggle("show", visible);
}

/* =========================================================
   DASHBOARD
========================================================= */
function animate(el, to) {
  let n = 0;
  const step = Math.max(1, Math.ceil(to / 25));
  const t = setInterval(() => {
    n += step;
    if (n >= to) {
      el.textContent = to;
      clearInterval(t);
    } else el.textContent = n;
  }, 20);
}

function loadDashboard() {
  fetch(`${API_URL}?action=get_dashboard`)
    .then(r => r.json())
    .then(d => {
      if (d.status !== "success") return;
      animate(totalMissed, d.totalMissed || 0);
      animate(completed, d.completed || 0);
      animate(pending, d.pending || 0);
      animate(extraCount, d.extra || 0);
    });
}

/* =========================================================
   FORM HANDLERS
========================================================= */
missedForm.addEventListener("submit", async e => {
  e.preventDefault();

  const res = await post({
    action: "save_missed",
    date: formatBDDate(m_date.value),
    department: m_dept.value,
    course: m_course.value,
    room: m_room.value,
    timeSlot: m_time.value,
    teacherInitial: m_teacher.value,
    reason: m_reason.value
  });

  if (res.status === "success") {
    alert("✅ Missed class saved");
    e.target.reset();
    loadDashboard();
  } else alert("❌ Failed");
});

makeupForm.addEventListener("submit", async e => {
  e.preventDefault();

  const res = await post({
    action: "save_makeup",
    scheduleDate: formatBDDate(k_schedule.value),
    department: k_dept.value,
    course: k_course.value,
    teacherInitial: k_teacher.value,
    makeupDate: formatBDDate(k_date.value),
    makeupTime: k_time.value,
    makeupRoom: k_room.value,
    status: k_status.value,
    remarks: k_remarks.value.trim()
  });

  if (res.status === "success") {
    alert("✅ Makeup class saved");
    e.target.reset();
    loadDashboard();
  } else alert("❌ Slot conflict");
});

/* =========================================================
   VIEW SWITCH
========================================================= */
function show(id) {
  ["missedForm","makeupForm","pendingSection"]
    .forEach(x => document.getElementById(x).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

btn_missed.onclick  = () => show("missedForm");
btn_makeup.onclick  = () => show("makeupForm");
btn_pending.onclick = () => show("pendingSection");

window.addEventListener("DOMContentLoaded", () => {

  /* === DOM REFERENCES (SAFE) === */
  const missedForm   = document.getElementById("missedForm");
  const makeupForm   = document.getElementById("makeupForm");
  const pendingSection = document.getElementById("pendingSection");

  const btn_missed  = document.getElementById("btn-missed");
  const btn_makeup  = document.getElementById("btn-makeup");
  const btn_pending = document.getElementById("btn_pending");

  /* === VIEW SWITCH === */
  function show(id) {
    [missedForm, makeupForm, pendingSection]
      .forEach(el => el.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
  }

  btn_missed.addEventListener("click", () => show("missedForm"));
  btn_makeup.addEventListener("click", () => show("makeupForm"));
  btn_pending.addEventListener("click", () => show("pendingSection"));

  /* === INIT DATA === */
  populateSelect("m_teacher", TEACHERS);
  populateSelect("k_teacher", TEACHERS);
  populateSelect("m_dept", DEPARTMENTS);
  populateSelect("k_dept", DEPARTMENTS);
  populateSelect("m_course", COURSES);
  populateSelect("k_course", COURSES);
  populateSelect("m_room", ROOMS);
  populateSelect("k_room", ROOMS);
  populateSelect("m_time", TIMES);
  populateSelect("k_time", TIMES);

  initSmartDropdowns();
  loadDashboard();
});

/* =========================================================
   SERVICE WORKER
========================================================= */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
