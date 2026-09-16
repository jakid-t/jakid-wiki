// app.js
// ===== Рендер статьи на отдельной HTML-странице =====

function renderArticlePage() {
    const body = document.body;
    const id = body.dataset.articleId;
    if (!id) return; // это главная или all.html — ничего не рендерим

    const content = document.getElementById("content");
    if (!content) return;

    const mn = window.MICRONATIONS.find(m => m.id === id);
    if (!mn) {
        content.innerHTML = `<h1 class="firstHeading">Статья не найдена</h1>
            <p>Вернитесь на <a href="index.html">главную</a>.</p>`;
        return;
    }

    // Меняем title страницы
    document.title = mn.title + " — Википедия";

    // Оглавление
    const tocItems = mn.sections.map((s, i) =>
        `<li><span class="tocnumber">${i + 1}</span> <a href="#section-${i}">${s.title}</a></li>`
    ).join("");

    // Разделы
    const sectionsHtml = mn.sections.map((s, i) => `
        <h2 id="section-${i}">${s.title}</h2>
        ${s.content}
    `).join("");

    // Инфобокс
    const infoRows = Object.entries(mn.info).map(([k, v]) =>
        `<tr><th>${k}:</th><td>${v}</td></tr>`
    ).join("");

    // Сноски
    const refsHtml = (mn.references || []).map((r, i) => {
        const n = i + 1;
        return `<li id="cite_note-${n}"><a href="#cite_ref-${n}">↑</a> ${r}</li>`;
    }).join("");

    // Категории
    const catsHtml = (mn.categories || []).map(c => `<a href="all.html">${c}</a>`).join(" | ");

    // Фото лидера
    const leaderPhoto = mn.leader.photo
        ? `<img src="${mn.leader.photo}" alt="${mn.leader.name}"
               onerror="this.outerHTML='<div style=\\'text-align:center;font-size:3em;\\'>👤</div>'">`
        : `<div style="text-align:center;font-size:3em;">👤</div>`;

    content.innerHTML = `
        <h1 class="firstHeading">${mn.title}</h1>

        <div class="infobox">
            <div class="infobox-title">${mn.title}</div>
            ${mn.flag
                ? `<img src="${mn.flag}" alt="Флаг ${mn.title}"
                        onerror="this.outerHTML='<div style=\\'text-align:center;font-size:4em;\\'>${mn.flagEmoji || "🏴"}</div>'">`
                : `<div style="text-align:center;font-size:4em;">${mn.flagEmoji || "🏴"}</div>`}
            <div class="img-caption">Флаг ${mn.title}</div>
            <table>${infoRows}</table>
            <div style="text-align:center;padding:0.5em 0 0.2em;border-top:1px solid #eaecf0;margin-top:0.3em;">
                <div style="font-size:0.8em;color:#54595d;margin-bottom:0.3em;">${mn.leader.title}</div>
                ${leaderPhoto}
                <div style="font-size:0.85em;font-weight:bold;">${mn.leader.name}</div>
            </div>
        </div>

        <p><b>${mn.title}</b> — ${mn.shortDesc}</p>

        <div id="toc">
            <div class="toctitle"><h2>Содержание</h2></div>
            <ul>${tocItems}</ul>
        </div>

        ${sectionsHtml}

        <h2 id="Примечания">Примечания</h2>
        <div class="references"><ol>${refsHtml}</ol></div>

        <div class="catlinks"><b>Категории:</b> ${catsHtml}</div>
    `;
}

// ===== Поиск (работает на всех страницах) =====

function initSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    if (!searchInput || !searchResults) return;

    searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) {
            searchResults.classList.remove("active");
            searchResults.innerHTML = "";
            return;
        }
        const matches = window.MICRONATIONS.filter(mn =>
            mn.title.toLowerCase().includes(q) ||
            mn.shortDesc.toLowerCase().includes(q)
        );
        searchResults.innerHTML = matches.length
            ? matches.map(mn => `
                <div class="search-result-item" onclick="location.href='${mn.id}.html'">
                    <div class="title">${mn.title}</div>
                    <div class="snippet">${mn.shortDesc}</div>
                </div>`).join("")
            : `<div class="search-result-item"><span class="no-results">Ничего не найдено</span></div>`;
        searchResults.classList.add("active");
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const first = searchResults.querySelector(".search-result-item");
            if (first) first.click();
        }
        if (e.key === "Escape") searchResults.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-box")) searchResults.classList.remove("active");
    });
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
    renderArticlePage();
    initSearch();
});
