/* =========================================================
   CONFIG (GITHUB SAFE)
========================================================= */
const API_URL =
  "https://script.google.com/macros/s/AKfycbwFlDrplCzmYeykNATmV8mR86RZmAaJpC8zJTi_pfpjMiMGgtdp8ZkwN8c2k4fFXbaSUA/exec";

/* ---------- HELPERS ---------- */
function qs(sel) { return document.querySelector(sel); }
function qid(id) { return document.getElementById(id); }

function populateSelect(id, list) {
  const sel = qid(id);
  if (!sel) return;

  sel.innerHTML = `<option value="">Select</option>`;

  list.forEach(v => {
    if (v && v.toString().trim() !== "") {
      sel.add(new Option(v, v));
    }
  });
}

function formatDateISO(d) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

/* ---------- BOOT ---------- */
window.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("cms_user_email");

  if (email) {
    qid("loginScreen").style.display = "none";
    qid("appRoot").style.display = "block";

    loadDashboard();
    refreshRoutineDropdowns();
    loadPendingMakeup();
    
    const emptyTab = document.querySelector('[data-tab="empty"]');
if (emptyTab) {
  emptyTab.addEventListener("click", loadEmptyRooms);
}

    bindForms();
  } else {
    qid("loginScreen").style.display = "flex";
    qid("appRoot").style.display = "none";
  }
});

/* ---------- DASHBOARD ---------- */
function loadDashboard() {
  fetch(`${API_URL}?action=get_dashboard`)
    .then(r => r.json())
    .then(d => {
      if (d.status !== "success") return;

      qid("totalMissed").textContent = d.totalMissed || 0;
      qid("completed").textContent = d.completed || 0;
      qid("pending").textContent = d.pending || 0;
      qid("extraCount").textContent = d.extra || 0;
    })
    .catch(console.error);
}

/* ---------- ROUTINE MASTER DROPDOWNS ---------- */
async function refreshRoutineDropdowns() {
  try {
    const res = await fetch(`${API_URL}?action=get_routine_master`);
    const d = await res.json();
    if (d.status !== "success") {
      console.error("Routine load failed", d);
      return;
    }

    const uniq = a => [...new Set((a || []).filter(v => v && v.toString().trim() !== ""))];

    populateSelect("m_time", uniq(d.times));
    populateSelect("m_room", uniq(d.rooms));
    populateSelect("m_course", uniq(d.courses));
    populateSelect("m_teacher", uniq(d.teachers));

    populateSelect("k_time", uniq(d.times));
    populateSelect("k_room", uniq(d.rooms));
    populateSelect("k_course", uniq(d.courses));
    populateSelect("k_teacher", uniq(d.teachers));
        
    setTimeout(() => {
      $("#m_teacher, #m_course, #k_teacher, #k_course").select2({
        width: "100%",
        placeholder: "Search & select...",
        allowClear: true
      });
    }, 300);


  } catch (e) {
    console.error("Routine load failed", e);
  }
}

$(document).ready(function() {
  $('#m_teacher, #m_course, #k_teacher, #k_course').select2({
    width: '100%',
    placeholder: 'Select an option',
    allowClear: true
  });
});

/* ---------- FORM BINDINGS ---------- */
function bindForms() {
  qid("missedForm")?.addEventListener("submit", submitMissed);
  qid("makeupForm")?.addEventListener("submit", submitMakeup);
}

/* ---------- SAVE MISSED ---------- */
async function submitMissed(e) {
  e.preventDefault();

  const payload = new URLSearchParams({
    action: "save_missed",
    date: formatDateISO(qid("m_date").value),
    department: qid("m_dept").value,
    course: qid("m_course").value,
    room: qid("m_room").value,
    timeSlot: qid("m_time").value,
    teacherInitial: qid("m_teacher").value,
    reason: qid("m_reason").value
  });

  const res = await fetch(API_URL, { method: "POST", body: payload }).then(r => r.json());

  if (res.status === "success") {
    alert("Missed class entry saved successfully.");
    e.target.reset();
    loadDashboard();
  } else {
    alert(res.message || "Failed to save missed class entry.");
  }
}

/* ---------- SAVE MAKEUP ---------- */
async function submitMakeup(e) {
  e.preventDefault();

  const payload = new URLSearchParams({
    action: "save_makeup",
    scheduleDate: formatDateISO(qid("k_schedule").value),
    department: qid("k_dept").value,
    course: qid("k_course").value,
    teacherInitial: qid("k_teacher").value,
    makeupDate: formatDateISO(qid("k_date").value),
    makeupTime: qid("k_time").value,
    makeupRoom: qid("k_room").value,
    status: qid("k_status").value,
    remarks: qid("k_remarks").value.trim()
  });

  const res = await fetch(API_URL, { method: "POST", body: payload }).then(r => r.json());

    if (res.status === "success") {
    alert("Makeup class entry saved successfully.");
    e.target.reset();
    loadPendingMakeup();
    loadDashboard();
    loadEmptyRooms();
  } else {
    alert(res.message || "Failed to save makeup class entry.");
  }
}

/* =========================================================
   PENDING MAKEUP
========================================================= */
function updateMakeup(row) {
  const statusEl = document.getElementById(`status_${row}`);
  const remarksEl = document.getElementById(`remarks_${row}`);

  if (!statusEl) return;

  const status = statusEl.value;
  const remarks = remarksEl ? remarksEl.value.trim() : "";

  fetch(
    `${API_URL}?action=update_makeup&row=${row}&status=${status}&remarks=${encodeURIComponent(remarks)}`
  )
    .then(r => r.json())
    .then(res => {
      if (res.status === "success") {
        alert("✅ Updated");
        loadPendingMakeup();
        loadDashboard();
      } else {
        alert(res.message || "❌ Update failed");
      }
    })
    .catch(console.error);
}

function loadPendingMakeup() {
  fetch(`${API_URL}?action=get_pending_makeup`)
    .then(r => r.json())
    .then(res => {
      const tbody = document.querySelector("#pendingTable tbody");
      if (!tbody) return;

      tbody.innerHTML = "";

      if (!res.data || !res.data.length) {
        tbody.innerHTML =
          `<tr><td colspan="9">No pending makeup classes</td></tr>`;
        return;
      }

      res.data.forEach(r => {
        tbody.insertAdjacentHTML(
          "beforeend",
          `
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
      <option value="" disabled selected hidden>${r.status}</option>
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
    </select>
  </td>
  <td>
    <input
      id="remarks_${r.row}"
      value="${r.remarks || ""}"
      placeholder="Attendance link provide"
    >
    <button onclick="updateMakeup(${r.row})">Update</button>
  </td>
</tr>
          `
        );
      });
    })
    .catch(console.error);
}

// --------- FIX: SEARCH IN PENDING LIST ---------
document.getElementById("pendingTeacherSearch").addEventListener("keyup", function () {
  const term = this.value.toLowerCase().trim();
  const rows = document.querySelectorAll("#pendingTable tbody tr");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(term) ? "" : "none";
  });
});

/* ---------- EMPTY ROOM CHECK (DAY + TIME + ROOM) ---------- */
function loadEmptyRooms() {
  fetch(`${API_URL}?action=get_empty_rooms`)
    .then(r => r.json())
    .then(res => {
      const tbody = qs("#emptyRoomTable tbody");
      tbody.innerHTML = "";

      if (!res.data || !res.data.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align:center; color:#777;">
              No empty rooms available
            </td>
          </tr>`;
        return;
      }

      res.data.forEach(r => {
        tbody.insertAdjacentHTML(
          "beforeend",
          `<tr>
            <td>${r.day || ""}</td>
            <td>${r.time || ""}</td>
            <td>${r.room || ""}</td>
            <td>
              <button class="book-btn"
                onclick="autoFillMakeup('', '${r.time || ""}', '${r.room || ""}')">
                Book
              </button>
            </td>
          </tr>`
        );
      });
    })
    .catch(err => {
      console.error("Empty room load error:", err);
      const tbody = qs("#emptyRoomTable tbody");
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="color:red; text-align:center;">
            Failed to load empty rooms
          </td>
        </tr>`;
    });
}

/* ---------- SEARCH FILTER FOR EMPTY ROOMS ---------- */
function filterEmptyRooms() {
  const input = qid("emptyRoomSearch").value.toLowerCase();
  const rows = document.querySelectorAll(".empty-room-row");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

/* Auto-fill Makeup Form */
function autoFillMakeup(day, time, room) {
  qid("k_time").value = time;
  qid("k_room").value = room;

  const makeupTab = document.querySelector('[data-tab="makeup"]');
  if (makeupTab) makeupTab.click();

  alert(`Selected: ${day} | ${time} | ${room}`);
}

/* ---------- SEARCH EMPTY ROOM LIST ---------- */
function searchEmptyRooms() {
  const term = qid("emptyRoomSearch").value.toLowerCase().trim();
  const rows = qs("#emptyRoomTable tbody").querySelectorAll("tr");

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    if (text.includes(term)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
