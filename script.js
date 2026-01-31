/* =========================================================
   CONFIG
========================================================= */
const API_URL =
  "https://script.google.com/macros/s/AKfycbyeFwZ761GS776jve8y-UJQQy-u0nWsnowfl25-Bcqh0rBXxUm23Q9uaAEe7hVqtCfwKA/exec";

const SPREADSHEET_ID = "1U5kHGV3ZlFkixyG_av7LN9ZIRGVLUq6Rsf3RKaaDzvs";

/* =========================================================
   GOOGLE AUTH
========================================================= */
function initGoogleLogin() {
  if (!window.google || !google.accounts) return;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleLogin
  });

  google.accounts.id.renderButton(
    document.getElementById("gSignInBtn"),
    { theme: "outline", size: "large", width: 250 }
  );
}

function handleGoogleLogin(response) {
  if (!response.credential) return;

  const payload = JSON.parse(atob(response.credential.split(".")[1]));
  localStorage.setItem("cms_user_email", (payload.email || "").toLowerCase());
  bootApplication();
}

/* =========================================================
   SESSION + BOOT
========================================================= */
function bootApplication() {
  const email = localStorage.getItem("cms_user_email");
  if (!email) return;

  document.getElementById("loginScreen")?.style && (loginScreen.style.display = "none");
  document.getElementById("appRoot")?.style && (appRoot.style.display = "block");

  loadDashboard();
  loadPendingMakeup();
  refreshRoutineDropdowns();
}

window.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("cms_user_email");

  if (email) {
    bootApplication();
  } else {
    document.getElementById("loginScreen")?.style && (loginScreen.style.display = "flex");
    document.getElementById("appRoot")?.style && (appRoot.style.display = "none");
    initGoogleLogin();
  }

  bindForms();
});

/* =========================================================
   ROLE CONTROL
========================================================= */
const ADMIN_EMAILS = [
  "classmonitoringsystem@gmail.com",
  "cseoffice5@daffodilvarsity.edu.bd"
];

const isAdminUser = () =>
  ADMIN_EMAILS.includes((localStorage.getItem("cms_user_email") || "").toLowerCase());

/* =========================================================
   MASTER DATA (MERGED & CLEAN)
========================================================= */
const TEACHERS = [
  "Faisal Ahmed (FLA)",
  "Muhammad Lutfur Rahman Abrar (LRA)",
  "Md. Shamim Al Mamun (MSAM)",
  "Md. Abdul Kader (ALK)",
  "Nafis-Ul Momin (NUM)",
  "Ishtiaque Ahmed",
  "Debanjon Chakraborty",
  "Sumona Afroz (SA)",
  "Md. Naymul Islam Nayoun",
  "Dr. Bimal Chandra Das (BCD)",
  "Rafi Al Mahmud (RAM)",
  "Shadab Sheper (SBS)",
  "Unknown"
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
  sel.innerHTML = `<option value="">Select</option>`;
  list.forEach(v => sel.add(new Option(v, v)));
}

function formatBDDateTimeFromInput(value) {
  if (!value) return "";
  const nowBD = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
  const d = new Date(value);
  return new Date(
    d.getFullYear(), d.getMonth(), d.getDate(),
    nowBD.getHours(), nowBD.getMinutes()
  ).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
    timeZone: "Asia/Dhaka"
  }).replace(",", "");
}

/* =========================================================
   DASHBOARD
========================================================= */
function animateCount(el, to) {
  if (!el) return;
  let val = 0;
  const step = Math.max(1, Math.ceil(to / 30));
  const t = setInterval(() => {
    val += step;
    el.textContent = val >= to ? to : val;
    if (val >= to) clearInterval(t);
  }, 20);
}

function loadDashboard() {
  fetch(`${API_URL}?action=get_dashboard`)
    .then(r => r.json())
    .then(d => {
      if (d.status !== "success") return;
      animateCount(totalMissed, isAdminUser() ? d.totalMissed : 0);
      animateCount(completed, d.completed || 0);
      animateCount(pending, d.pending || 0);
      animateCount(extraCount, d.extra || 0);
    })
    .catch(console.error);
}

/* =========================================================
   ROUTINE MASTER (A → AE)
========================================================= */
async function refreshRoutineDropdowns() {
  try {
    const res = await fetch(`${API_URL}?action=get_routine_master`);
    const d = await res.json();
    if (d.status !== "success") return;

    const uniq = a => [...new Set(a.filter(Boolean))];

    populateSelect("m_time", uniq(d.times));
    populateSelect("m_room", uniq(d.rooms));
    populateSelect("m_course", uniq(d.courses));
    populateSelect("m_teacher", uniq(d.teachers));

    populateSelect("k_time", uniq(d.times));
    populateSelect("k_room", uniq(d.rooms));
    populateSelect("k_course", uniq(d.courses));
    populateSelect("k_teacher", uniq(d.teachers));
  } catch (e) {
    console.error("Routine master load failed", e);
  }
}

/* =========================================================
   FORM BINDINGS (FIXES NOT OPEN ISSUE)
========================================================= */
function bindForms() {
  const missedForm = document.getElementById("missedForm");
  const makeupForm = document.getElementById("makeupForm");

  missedForm?.addEventListener("submit", submitMissed);
  makeupForm?.addEventListener("submit", submitMakeup);
}

/* ================= MISSED ================= */
async function submitMissed(e) {
  e.preventDefault();

  const payload = {
    action: "save_missed",
    date: formatBDDateTimeFromInput(m_date.value),
    department: m_dept.value,
    course: m_course.value,
    room: m_room.value,
    timeSlot: m_time.value,
    teacherInitial: m_teacher.value,
    reason: m_reason.value
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams(payload)
  }).then(r => r.json());

  if (res.status === "success") {
    alert("✅ Missed class saved");
    e.target.reset();
    loadDashboard();
  } else {
    alert(res.message || "❌ Failed");
  }
}

/* ================= MAKEUP ================= */
async function submitMakeup(e) {
  e.preventDefault();

  const payload = {
    action: "save_makeup",
    scheduleDate: formatBDDateTimeFromInput(k_schedule.value),
    department: k_dept.value,
    course: k_course.value,
    teacherInitial: k_teacher.value,
    makeupDate: formatBDDateTimeFromInput(k_date.value),
    makeupTime: k_time.value,
    makeupRoom: k_room.value,
    status: k_status.value,
    remarks: k_remarks.value.trim()
  };

  for (const k in payload) {
    if (!payload[k] && k !== "remarks") {
      alert("⚠️ Fill all required fields");
      return;
    }
  }

  const res = await fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams(payload)
  }).then(r => r.json());

  if (res.status === "success") {
    alert("✅ Makeup saved");
    e.target.reset();
    loadPendingMakeup();
    loadDashboard();
  } else {
    alert(res.message || "❌ Slot already booked");
  }
}

/* =========================================================
   PENDING MAKEUP
========================================================= */
function loadPendingMakeup() {
  fetch(`${API_URL}?action=get_pending_makeup`)
    .then(r => r.json())
    .then(res => {
      const tbody = document.querySelector("#pendingTable tbody");
      if (!tbody) return;
      tbody.innerHTML = "";

      if (!res.data?.length) {
        tbody.innerHTML = `<tr><td colspan="9">No pending makeup classes</td></tr>`;
        return;
      }

      res.data.forEach(r => {
        tbody.insertAdjacentHTML("beforeend", `
<tr>
  <td>${r.scheduleDate}</td>
  <td>${r.department}</td>
  <td>${r.course}</td>
  <td>${r.teacher}</td>
  <td>${r.makeupDate}</td>
  <td>${r.makeupTime}</td>
  <td>${r.makeupRoom}</td>
  <td>
    <select id="status_${r.row}">
      <option>${r.status}</option>
      <option>Pending</option>
      <option>Completed</option>
    </select>
  </td>
  <td>
    <input id="remarks_${r.row}" value="${r.remarks || ""}">
    <button onclick="updateMakeup(${r.row})">Update</button>
  </td>
</tr>`);
      });
    })
    .catch(console.error);
}

function updateMakeup(row) {
  const status = document.getElementById(`status_${row}`).value;
  const remarks = document.getElementById(`remarks_${row}`).value;

  fetch(`${API_URL}?action=update_makeup&row=${row}&status=${status}&remarks=${encodeURIComponent(remarks)}`)
    .then(r => r.json())
    .then(() => {
      loadPendingMakeup();
      loadDashboard();
    });
}

/* =========================================================
   SERVICE WORKER
========================================================= */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}

/* =========================================================
   FORCE LOGO VISIBILITY (SAFE)
========================================================= */
window.addEventListener("scroll", () => {
  const logo = document.querySelector("header img");
  if (logo) {
    logo.style.display = "block";
    logo.style.visibility = "visible";
  }
});

