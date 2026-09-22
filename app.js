(function () {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    if (!input || !results) return;

    input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        if (!q) {
            results.classList.remove("active");
            results.innerHTML = "";
            return;
        }

        const found = SITE_PAGES.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q)
        );

        if (found.length === 0) {
            results.innerHTML = `<div class="search-result-item"><span class="no-results">Ничего не найдено</span></div>`;
        } else {
            results.innerHTML = found.map(p => `
                <div class="search-result-item" onclick="location.href='${p.id}'">
                    <div class="title">${p.title}</div>
                    <div class="snippet">${p.desc}</div>
                </div>
            `).join("");
        }
        results.classList.add("active");
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-box")) {
            results.classList.remove("active");
        }
    });
})();
