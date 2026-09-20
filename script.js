const tests = [
  { name: "CBC Test", cat: "blood", desc: "Routine complete blood count screening.", tag: "Blood" },
  { name: "Liver Function Test", cat: "blood", desc: "Common markers used for routine liver health screening.", tag: "Blood" },
  { name: "Kidney Function Test", cat: "blood", desc: "Routine renal function screening profile.", tag: "Blood" },
  { name: "Fasting Blood Sugar", cat: "blood", desc: "Glucose screening with fasting sample.", tag: "Blood" },
  { name: "HbA1c", cat: "wellness", desc: "Marker commonly used for longer-term glucose monitoring.", tag: "Wellness" },
  { name: "Thyroid Profile", cat: "thyroid", desc: "T3, T4 and TSH thyroid screening profile.", tag: "Thyroid" },
  { name: "Vitamin D", cat: "vitamins", desc: "Vitamin D total level testing.", tag: "Vitamins" },
  { name: "Vitamin B12", cat: "vitamins", desc: "Vitamin B12 level assessment.", tag: "Vitamins" },
  { name: "Lipid Profile", cat: "wellness", desc: "Cholesterol and triglyceride screening.", tag: "Wellness" },
  { name: "Urine Routine", cat: "wellness", desc: "Routine urine analysis for common screening.", tag: "Wellness" },
  { name: "Full Body Checkup", cat: "wellness", desc: "Demo preventive screening concept.", tag: "Wellness" },
  { name: "Diabetes Care Package", cat: "wellness", desc: "Demo diabetes-oriented screening concept.", tag: "Wellness" }
];

const grid = document.querySelector("#testGrid");
const search = document.querySelector("#testSearch");
const clear = document.querySelector("#clearSearch");
const filters = Array.from(document.querySelectorAll(".filter"));
const heroSearch = document.querySelector("#heroSearch");

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function renderTests() {
  const query = search ? search.value.trim().toLowerCase() : "";
  const active = document.querySelector(".filter.active");
  const activeCategory = active ? active.dataset.filter : "all";

  const rows = tests.filter(function(test) {
    const matchesFilter = activeCategory === "all" || test.cat === activeCategory;
    const searchable = (test.name + " " + test.desc + " " + test.tag).toLowerCase();
    return matchesFilter && (!query || searchable.includes(query));
  });

  if (!grid) return;

  if (!rows.length) {
    grid.innerHTML =
      '<div class="empty-state"><strong>No matching test found</strong><div>Try another search term or contact FM Diagnostics.</div></div>';
    refreshIcons();
    return;
  }

  grid.innerHTML = rows.map(function(test) {
    return (
      '<article class="test-card">' +
        '<span class="test-tag">' + test.tag + "</span>" +
        "<h3>" + test.name + "</h3>" +
        "<p>" + test.desc + "</p>" +
        '<a class="test-link" href="#booking" data-test="' + test.name + '">' +
          'Ask about this test <i data-lucide="arrow-right"></i>' +
        "</a>" +
      "</article>"
    );
  }).join("");

  refreshIcons();
}

if (search) {
  search.addEventListener("input", renderTests);
}

if (clear) {
  clear.addEventListener("click", function() {
    if (search) search.value = "";
    renderTests();
    if (search) search.focus();
  });
}

filters.forEach(function(filter) {
  filter.addEventListener("click", function() {
    filters.forEach(function(item) {
      item.classList.remove("active");
    });
    filter.classList.add("active");
    renderTests();
  });
});

if (heroSearch) {
  heroSearch.addEventListener("input", function(event) {
    if (search) search.value = event.target.value;
    const testsSection = document.querySelector("#tests");
    if (testsSection) {
      testsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    renderTests();
  });
}

document.addEventListener("click", function(event) {
  const testTrigger = event.target.closest("[data-test]");
  const packageTrigger = event.target.closest("[data-package]");

  if (testTrigger) {
    localStorage.setItem("fm_selected_item", testTrigger.dataset.test);
  }

  if (packageTrigger) {
    localStorage.setItem("fm_selected_item", packageTrigger.dataset.package);
  }
});

const bookingForm = document.querySelector("#bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const data = new FormData(bookingForm);
    const selected = localStorage.getItem("fm_selected_item");

    const messageParts = [
      "Hi FM Diagnostics, I would like to make an enquiry.",
      "Name: " + (data.get("name") || ""),
      "Phone: " + (data.get("phone") || ""),
      "Need: " + (data.get("need") || ""),
      selected ? "Selected: " + selected : "",
      "Message: " + (data.get("message") || "")
    ];

    const message = messageParts.filter(Boolean).join("\n");
    const url = "https://wa.me/919359744913?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  });
}

refreshIcons();
renderTests();