// app.js

// ===== Утилиты =====

/** Безопасный рендер флага: если картинки нет — показываем эмодзи */
function renderFlag(mn, className = "") {
    const src = mn.flag || "";
    const emoji = mn.flagEmoji || "🏴";
    if (!src) {
        return `<div class="${className}" style="display:flex;align-items:center;justify-content:center;font-size:2.5em;">${emoji}</div>`;
    }
    return `<img src="${src}" alt="Флаг ${mn.title}" class="${className}"
                onerror="this.outerHTML='<div class=\\'${className}\\' style=\\'display:flex;align-items:center;justify-content:center;font-size:2.5em;\\'>${emoji}</div>'" />`;
}

/** Безопасный рендер фото лидера */
function renderLeaderPhoto(mn) {
    const src = (mn.leader && mn.leader.photo) || "";
    const emoji = "👤";
    if (!src) {
        return `<div style="text-align:center;font-size:3em;padding:0.5em 0;">${emoji}</div>`;
    }
    return `<img src="${src}" alt="${mn.leader.name}"
                onerror="this.outerHTML='<div style=\\'text-align:center;font-size:3em;padding:0.5em 0;\\'>${emoji}</div>'" />`;
}

/** Найти микронацию по id */
function findById(id) {
    return window.MICRONATIONS.find(m => m.id === id);
}

// ===== Рендер главной страницы =====

function renderHome() {
    const cards = window.MICRONATIONS.map(mn => `
        <a class="article-card" href="#/article/${mn.id}">
            <div class="card-flag">
                ${mn.flag
                    ? `<img src="${mn.flag}" alt="Флаг ${mn.title}" onerror="this.outerHTML='<span style=\\'font-size:2.5em;\\'>${mn.flagEmoji || "🏴"}</span>'" />`
                    : `<span style="font-size:2.5em;">${mn.flagEmoji || "🏴"}</span>`}
            </div>
            <div class="card-title">${mn.title}</div>
            <div class="card-desc">${mn.shortDesc}</div>
        </a>
    `).join("");

    return `
        <div class="main-page">
            <h1 class="firstHeading">Добро пожаловать в Википедию о микронациях</h1>
            <p>Здесь собраны статьи о самых известных <a href="#/article/silend">микронациях</a> мира —
            самопровозглашённых государствах, которые имитируют настоящие страны, но не имеют
            международного признания.</p>
            <p>В базе сейчас <b>${window.MICRONATIONS.length}</b> статей. Используйте поиск в шапке
            или выберите статью ниже.</p>

            <h2>Все статьи</h2>
            <div class="article-grid">
                ${cards}
            </div>

            <h2>Что такое микронация?</h2>
            <p><b>Микронация</b> — небольшое самопровозглашённое образование, которое имитирует
            государство, но не обладает международным признанием. Микронации отличаются от
            непризнанных государств тем, что обычно не стремятся к полноценной независимости
            и существуют как хобби, художественный проект или туристическая достопримечательность.</p>
        </div>
    `;
}

// ===== Рендер статьи =====

function renderArticle(id) {
    const mn = findById(id);
    if (!mn) return renderNotFound();

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
    const catsHtml = (mn.categories || []).map(c => `<a href="#/all">${c}</a>`).join(" | ");

    return `
        <h1 class="firstHeading">${mn.title}</h1>

        <div class="infobox">
            <div class="infobox-title">${mn.title}</div>
            ${mn.flag
                ? `<img src="${mn.flag}" alt="Флаг ${mn.title}"
                        onerror="this.outerHTML='<div style=\\'text-align:center;font-size:4em;padding:0.3em 0;\\'>${mn.flagEmoji || "🏴"}</div>'" />`
                : `<div style="text-align:center;font-size:4em;padding:0.3em 0;">${mn.flagEmoji || "🏴"}</div>`}
            <div class="img-caption">Флаг ${mn.title}</div>
            <table>
                ${infoRows}
                <tr>
                    <th>Руководитель:</th>
                    <td>${mn.leader.name}<br><small>${mn.leader.title}</small></td>
                </tr>
            </table>
            <div style="text-align:center;padding:0.5em 0 0.2em;border-top:1px solid #eaecf0;margin-top:0.3em;">
                <div style="font-size:0.8em;color:#54595d;margin-bottom:0.3em;">${mn.leader.title}</div>
                ${renderLeaderPhoto(mn)}
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
        <div class="references">
            <ol>${refsHtml}</ol>
        </div>

        <div class="catlinks">
            <b>Категории:</b> ${catsHtml}
        </div>
    `;
}

// ===== Рендер "Все статьи" =====

function renderAllArticles() {
    const list = window.MICRONATIONS.map(mn => `
        <li>
            <span class="list-flag">
                ${mn.flag
                    ? `<img src="${mn.flag}" alt="" style="width:100%;height:100%;object-fit:cover;"
                            onerror="this.outerHTML='${mn.flagEmoji || "🏴"}'" />`
                    : (mn.flagEmoji || "🏴")}
            </span>
            <a href="#/article/${mn.id}">${mn.title}</a>
            <span style="color:#54595d;font-size:0.9em;">— ${mn.shortDesc}</span>
        </li>
    `).join("");

    return `
        <h1 class="firstHeading">Все статьи</h1>
        <p>Полный список микронаций в базе данных.</p>
        <ul class="article-list">${list}</ul>
    `;
}

// ===== 404 =====

function renderNotFound() {
    return `
        <h1 class="firstHeading">Статья не найдена</h1>
        <p>К сожалению, статьи с таким названием пока нет. Вернитесь на
        <a href="#/">главную страницу</a> или воспользуйтесь поиском.</p>
    `;
}

// ===== Роутер (hash-based) =====

function router() {
    const hash = window.location.hash || "#/";
    const content = document.getElementById("content");

    // Сброс скролла при смене страницы
    window.scrollTo(0, 0);

    if (hash === "#/" || hash === "") {
        content.innerHTML = renderHome();
    } else if (hash === "#/all") {
        content.innerHTML = renderAllArticles();
    } else if (hash.startsWith("#/article/")) {
        const id = hash.replace("#/article/", "");
        content.innerHTML = renderArticle(id);
    } else {
        content.innerHTML = renderNotFound();
    }

    // Закрыть поиск
    document.getElementById("searchResults").classList.remove("active");
}

// ===== Поиск =====

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
        searchResults.classList.remove("active");
        searchResults.innerHTML = "";
        return;
    }

    const matches = window.MICRONATIONS.filter(mn =>
        mn.title.toLowerCase().includes(q) ||
        mn.shortDesc.toLowerCase().includes(q) ||
        (mn.info && Object.values(mn.info).some(v => String(v).toLowerCase().includes(q)))
    );

    if (matches.length === 0) {
        searchResults.innerHTML = `<div class="search-result-item"><span class="no-results">Ничего не найдено</span></div>`;
    } else {
        searchResults.innerHTML = matches.map(mn => `
            <div class="search-result-item" onclick="goToArticle('${mn.id}')">
                <div class="title">${mn.title}</div>
                <div class="snippet">${mn.shortDesc}</div>
            </div>
        `).join("");
    }
    searchResults.classList.add("active");
});

// Закрытие поиска при клике вне
document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) {
        searchResults.classList.remove("active");
    }
});

// Переход по Enter — к первой найденной статье
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const first = searchResults.querySelector(".search-result-item .title");
        if (first) {
            const items = searchResults.querySelectorAll(".search-result-item");
            items[0].click();
        }
    }
    if (e.key === "Escape") {
        searchResults.classList.remove("active");
    }
});

// ===== Навигация =====

function goToArticle(id) {
    window.location.hash = `#/article/${id}`;
    searchInput.value = "";
    searchResults.classList.remove("active");
}

function navigateHome() {
    window.location.hash = "#/";
}

// ===== Инициализация =====

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);

// Глобальные функции для inline-обработчиков
window.goToArticle = goToArticle;
window.navigateHome = navigateHome;
