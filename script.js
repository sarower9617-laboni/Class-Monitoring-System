/* script.js - frontend logic (populate selects, filters, submit) */

/* ========== UPDATE THIS to your Web App URL (exec) ========== */
const API_URL = "https://script.google.com/macros/s/AKfycbxr-1ttvbSK2wUGEkfS6sCA4Lh4V0okP8Kx38KCK_WdgZIEMuM6XMXMkmuTrSb-BP9m/exec";

/* ---------- MASTER LISTS ---------- */
const TEACHERS = [
"Dr. Sheak Rashed Haider Noori (SRH)","Dr. S.M Aminul Haque (SMAH)","Dr. Arif Mahmud (AM)",
"Dr. Md. Fokhray Hossain (MFH)","Professor Dr. Md. Adnan Kiber (MAK)","Professor Dr. Fernaz Narin Nur (FNN)",
"Dr. Md. Zahid Hasan (ZH)","Ms. Nazmun Nessa Moon (NNM)","Dr. Fizar Ahmed (FZA)","Dr. Naznin Sultana (NS)",
"Dr. Md. Kamrul Hossain (MKH)","Dr. Mr. Abdus Sattar (AS)","Mr. Anuz Kumar Chakrabarty (AKC)","Dr. Md. Ali Hossain (MAH)",
"Dr. Md. Akhtaruzzaman (DAN)","Dr. Mohammad Nuruzzaman Bhuiyan (MNB)","Mohammad Salek Parvez (SP)","Mr. Md. Sadekur Rahman (SR)",
"Mr. Shah Md Tanvir Siddiquee (SMTS)","Most. Hasna Hena (HH)","Raja Tariqul Hasan Tusher (THT)","Md. Abbas Ali Khan (AAK)",
"Ms. Samia Nawshin (SN)","Md. Sazzadur Ahamed (SZ)","Mr. Saiful Islam (SI)","Mr. Mohammad Monirul Islam (MMI)",
"Ms. Masuma Parvin (MPL)","Fatema Tuj Johora (FTJ)","Ms. Shirin Sultana (SSL)","Amit Chakraborty Chhoton (ACC)",
"Dewan Mamun Raza (DMR)","Dr. Md Alamgir Kabir (DMAK)","Mr. Mohammad Jahangir Alam (MJA)","Mushfiqur Rahman (MUR)",
"Mr. Shahadat Hossain (SH)","Md Masum Billah (MMB)","Ms. Sharun Akter Khushbu (SAK)","Mr. Amir Sohel (ARS)",
"Mr. Md Assaduzzaman (MA)","Mr. Mayen Uddin Mojumdar (MUM)","Md. Hasanuzzaman Dipu (MHD)","Fahiba Farhin (FFN)",
"Ms. Sakia Shabnam Kader","Tapasy Rabeya (TRA)","Ms. Aliza Ahmed Khan (ADK)","Zakia Sultana Eshita (ZS)",
"Mst. Sharmin Akter (SAR)","Md. Firoz Hasan (FH)","Israt Jahan (IJN)","Lamia Rukhsara (LR)","Eng. Mosharraf Hossain Khan (MHK)",
"Mr. Md Mohammad Masum Bakaul (MB)","Shamim Hossain (SMH)","MD. RASEDUL ISLAM (MRIS)","Md. Shah Jalal (MSJ)",
"Mr. Md Umaid Hasan (MUH)","Tanzina Afroz Rimi (TAR)","Mr. Abdullah Al Mamun (AAM)","Ms. Syada Tasmia Alvi (STA)",
"Ms. Umme Ayman (UA)","Mr. Md. Mizanur Rahman (MMRN)","Ms. Tasfia Anika Bushra (TAB)","Mr. Md. Aynul Hasan Nahid (AHN)",
"Ms. Nahid Sultana (NDS)","Md. Ferdouse Ahmed Foysal (FAF)","Mr. Partha Dip Sarkar (PDS)","Mr. Md. Mahedi Hassan (MHS)",
"Mr. Mahimul Islam Nadim (MIN)","Mr. Golam Rabbany (GR)","Mr. Md. Ashraful Islam Talukder (MAIT)","Ms. Dristi Saha (DS)",
"Ms. Zannatul Mawa Koli (ZMK)","Mr. Tanvirul Islam (TI)","Mr. Rahmatul Kabir Rasel Sarker (RKR)","Mr. Md. Monarul Islam (MIS)",
"Atia Sanjida Talulder (AST)","Umme Habiba (UH)","Hasnur Jahan (HJ)","Md. Jahidul Alam (JLA)","Sakib Mahmood Chowdhury (SMC)",
"Anup Kumar Modak (AKM)","Md. Atikul Islam (MAI)","Md. Jakaria Zobair (MJZ)","Md. Abdullah-Al-Kafi (AHAK)","Shahriar Shakil (MSS)",
"Ms Rabeya Khatun (RAK)","Ms. Nushrat Jahan Oyshi (NJO)","Ms Sadia Jannat Mitu (SAJ)","Ms Shahrin Khan (SNK)","Mr Mehadi Hasan (MHN)",
"Mr Mir Safwan Marzouq (MSM)","Mr Ashaf Uddaula (AUA)","Ms Faiza Feroz (FFZ)","Arpita Ghose Tusi (AGT)","Husne Mubarak (HMK)",
"Chayti Saha (CSA)","Abdullah Al-Amin (AAA)","Noor Muhammad (NRM)","Abdullah Al Sakib (AAS)","Md. Ashik-E-Elahe (AEE)",
"Md. Roni Islam (RIM)","Saida Mahmuda Rahman (SMN)","Md. Al-Mamun (AMN)","Abir Saha (ASA)","Angshuman Rashid (ANR)",
"S. M. Sharif Hasan (SMSH)","Tamanna Sultana (TAS)","MD. MEZBAUL ISLAM ZION (MIZ)","Nafiz Ahmed Emon (NAE)","Shadman Rabby (SHR)",
"Jamilul Huq Jami (JHJ)","Ms. Rowzatul Zannat (ROZ)","Md. Hefzul Hossain Papon (HHP)","Syed Eftasum Alam (SEA)",
"Mohammed Sami Khan (MSK)","Shoumik Debnath (SHD)","Ms. Rimi Akter (RIA)","Ms. Taslima Akhter (TAK)","Muhammad Abu Rayan (MAR)",
"Md. Zami Al Zunaed Farabe (ZAF)","Md. Alvee Ehsan (ALE)","Pranto Protim Choudhury (PPC)","Md. Shakib Hossain (MSH)",
"Mizanur Rahman (MRR)","Mohiuddin Muhi (MNM)","Monju Akter Mou (MAM)","Abdullah Ar Rafi (AAR)","Nishat Sadaf Lira (NSL)",
"Fahim Ahsan (FMA)","Md. Jubayar Alam Rafi (JAR)","Showmick Guha Paul (SGP)","Mir Faiyaz Hossain (MFZ)","Md. Yousuf Ali (MYA)",
"Mushfiqur Rahman Chowdhury (MRC)","Shreya Nag Riya (SNR)","Nishat Tasnim Shishir (NTS)","Z N M Zarif Mahmud (ZZM)",
"Fardowsi Rahman (FRN)","Nawshin Haque (NHE)","Liza Akter (LAR)","Md. Mahabul Alom Santo (MAS)","Md. Jahangir Alam (JAM)",
"Jotirmoy Roy (JRY)","Kridita Ray (KRY)","Shaswata Bhattacharya (SBA)","Md. Taufik Hasan (MTN)","Indrani Sen Toma (IST)",
"Shahariar Sarkar (SRS)","Sadaf M. Anis (SFMA)","Sourav Majumder (SVM)","S. M. Faisal (SMF)","Md. Touhidul Islam Sovon (TIS)",
"Tanjir Ahmed Anik (TAA)","Md. Aman Ullah (MAU)","Md. Mehefujur Rahman Mubin (MRM)","Sayeda Parvin (SAP)","Most. Sanjida Afrin (MSA)",
"Mohammad Rony (MRY)","Khandoker Nosiba Arifin (KNA)","Pallabi Biswas (PB)","Tasmiah Rahman (TRN)","MS. SUBARNA AKTER LIZA (SAL)",
"Md. Ridoy Sarkar (RYS)","Nazia Nuzhat (NNT)","Yamina Islam (YI)","Md. Imtiaj Hossain (MIH)","Professor Dr. Monzur Morshed (MM)",
"Mr. Mohammad Mahmudur Rahman (MMR)","Syeda Maria Rahman (SMR)","Ms. Shanjida Habib Swarna (SHS)","Md. Alamgir Hossain (ARH)",
"Ms. Ummey Fariha (UF)","Md. Shamim Hossain (SHN)","Md. Emad Hossain Likhon (EHL)","Md. Shadman Mostafa (SMA)","Bakhtiar Muiz (BM)",
"MD TASLIM ARIF (MTF)","Muha. Humayet Islam (MHI)","Md. Shihab Uddin (MSU)","Mohammad Al Rasel (MLR)","Kazi Hasibur Rahman (KHR)",
"Md. Atiqure Rahman Shanto (MRS)","Indrojit Sarkar (ITS)","Md. Rashedul Alam (MRA)","Sadman Sadik Khan (SKN)","Md. Kamrul Hasan (KH)",
"Jannatun Naeem Tanin (JNT)","Md Ibrahim Patwary Khokan (IPK)","Sadikur Rahman Sadik (SRS)","Shumaiya Akter Shammi (SAS)",
"Md. Sagar Hossen (MSRH)","Prottasha Sarker (PS)","Sadia Afrin Sumi (SAS)","Sangeeta Kundu (SKU)","Mst. Ainunnahar Khatun (ARN)",
"Mohammad Rifat-Ul Islam (MRI)","Mohaimenul Khan (MK)","Sumiya Alam Chowdhury (SAC)","Atikur Rahman (MARR)","Md. Anamul Kabir Jewel (AKJ)",
"Ayesha Siddka Moon (ASM)","Ekramul Islam Khan (EIK)","Arinee Anjum (AEA)","Md. Rokonuzzaman","DEWAN ASHIQUZZAMAN (DAA)",
"Faisal Ahmed (FLA)","Muhammad Lutfur Rahman Abrar (LRA)","Md. Shamim Al Mamun (MSAM)","Md. Abdul Kader (ALK)","Nafis-Ul Momin (NUM)",
"Ishtiaque Ahmed","Debanjon Chakraborty","Sumona Afroz (SA)","Md. Naymul Islam Nayoun","Dr. Bimal Chandra Das (BCD)","Rafi Al Mahmud (RAM)",
"Shadab Sheper (SBS)","Unknown"
];

const ROOMS = [
"201","208","213","216","217","218","219","220","221","222","223","224",
"302","303","304","305","306","307","318(A)","318(B)","320",
"801(A)","801(B)","802","803","804","813(B)",
"514","515","516","517(A)","518","916","919","204",
"G1-026","G1-027","501(A)","501(B)","503","504","510","513",
"G1-001","G1-002","G1-003","G1-004","G1-005","G1-006","G1-007","G1-008",
"G1-009","G1-010","G1-011","G1-012","G1-013","G1-014","G1-016","G1-017",
"G1-018","G1-020","G1-021","G1-022",
"809","810","301","502","103","105","815","816"
];

const TIMES = [
  "8:30 AM - 10:00 AM",
  "10:00 AM - 11:30 AM",
  "11:30 AM - 1:00 PM",
  "1:00 PM - 2:30 PM",
  "2:30 PM - 4:00 PM",
  "4:00 PM - 5:30 PM"
];


/* ---------- HELPERS ---------- */
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

function addFilter(filterId, selectId) {
  const f = document.getElementById(filterId);
  const s = document.getElementById(selectId);
  if (!f || !s) return;

  f.addEventListener("input", () => {
    const q = f.value.toLowerCase();
    [...s.options].forEach(o => {
      o.style.display = o.text.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

/* ---------- LOAD DROPDOWNS ON PAGE LOAD ---------- */
window.addEventListener("DOMContentLoaded", () => {
  populateSelect("m_teacher", TEACHERS);
  populateSelect("k_teacher", TEACHERS);
  populateSelect("m_room", ROOMS);
  populateSelect("k_room", ROOMS);
  populateSelect("m_time", TIMES);
  populateSelect("k_time", TIMES);

  addFilter("m_teacher_filter", "m_teacher");
  addFilter("k_teacher_filter", "k_teacher");
  addFilter("m_room_filter", "m_room");
  addFilter("k_room_filter", "k_room");
  addFilter("m_time_filter", "m_time");
  addFilter("k_time_filter", "k_time");

  loadDashboard();
  loadPendingMakeup();
});

/* ---------- POST HELPER ---------- */
async function postForm(payload) {
  const params = new URLSearchParams(payload);
  const res = await fetch(API_URL, { method: "POST", body: params });
  return await res.json();
}

/* ================= MISSED CLASS ================= */
document
  .getElementById("missedForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      action: "save_missed",
      date: m_date.value,
      department: m_dept.value.trim(),
      course: m_course.value.trim(),
      room: m_room.value,
      timeSlot: m_time.value,
      teacherInitial: m_teacher.value,
      reason: m_reason.value.trim()
    };

    const res = await postForm(payload);
    if (res.status === "success") {
      alert("Missed Class Saved!");
      this.reset();
      loadDashboard();
    } else {
      alert("Error saving missed class");
    }
  });

/* ================= MAKEUP CLASS ================= */
document
  .getElementById("makeupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      action: "save_makeup",
      scheduleDate: k_schedule.value,
      department: k_dept.value.trim(),
      course: k_course.value.trim(),
      teacherInitial: k_teacher.value,
      makeupDate: k_date.value,
      makeupTime: k_time.value,
      makeupRoom: k_room.value,
      status: k_status.value,
      remarks: k_remarks.value.trim()
    };

    if (
      !payload.scheduleDate ||
      !payload.department ||
      !payload.course ||
      !payload.teacherInitial ||
      !payload.makeupDate ||
      !payload.makeupTime ||
      !payload.makeupRoom
    ) {
      alert("Please fill all required fields");
      return;
    }

    const res = await postForm(payload);
    if (res.status === "success") {
      alert("Makeup Class Saved!");
      this.reset();
      loadPendingMakeup();
      loadDashboard();
    } else {
      alert("Makeup save failed");
      console.error(res);
    }
  });

/* ================= PENDING LIST ================= */
function updateMakeup(row) {
  const status = document.getElementById(`status_${row}`).value;
  const remarks = document.getElementById(`remarks_${row}`).value;

  const url =
    `${API_URL}?action=update_makeup` +
    `&row=${row}` +
    `&status=${encodeURIComponent(status)}` +
    `&remarks=${encodeURIComponent(remarks)}`;

  fetch(url)
    .then(r => r.json())
    .then(res => {
      if (res.status === "success") {
        alert("Updated successfully");
        loadPendingMakeup();
        loadDashboard();
      } else {
        alert("Update failed: " + res.message);
      }
    })
    .catch(err => {
      alert("Network error");
      console.error(err);
    });
}
function loadPendingMakeup() {
  fetch(`${API_URL}?action=get_pending_makeup`)
    .then(r => r.json())
    .then(res => {
      const tbody = document.querySelector("#pendingTable tbody");
      if (!tbody) return;

      tbody.innerHTML = "";

      if (!res.data || res.data.length === 0) {
        tbody.innerHTML =
          `<tr><td colspan="9">No pending makeup classes</td></tr>`;
        return;
      }

      res.data.forEach(row => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${row.scheduleDate}</td>
          <td>${row.department}</td>
          <td>${row.course}</td>
          <td>${row.teacher}</td>
          <td>${row.makeupDate}</td>
          <td>${row.time}</td>
          <td>${row.room}</td>

          <td>
            <select id="status_${row.row}">
              <option value="Pending" selected>Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </td>

          <td>
            <input type="text" id="remarks_${row.row}" value="${row.remarks || ""}">
            <br>
            <button onclick="updateMakeup(${row.row})">Update</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Pending load error:", err);
    });
}

/* ================= UPDATE STATUS ================= */
function updateStatus(row, scheduleDate) {
  const remarks = document.getElementById(`remarks_${row}`).value;
  fetch(
    `${API_URL}?action=update_makeup&row=${row}&status=Completed&remarks=${encodeURIComponent(
      remarks
    )}&scheduleDate=${scheduleDate}`
  )
    .then(r => r.json())
    .then(r => {
      if (r.status === "success") {
        alert("Updated");
        loadPendingMakeup();
        loadDashboard();
      } else {
        alert("Update failed");
      }
    });
}

/* ================= DASHBOARD ================= */
function loadDashboard() {
  fetch(`${API_URL}?action=get_dashboard`)
    .then(r => r.json())
    .then(d => {
      totalMissed.innerText = d.totalMissed || 0;
      completed.innerText = d.completed || 0;
      pending.innerText = d.pending || 0;
    });
}
