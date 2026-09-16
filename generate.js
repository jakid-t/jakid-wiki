// generate.js — запуск: node generate.js
const fs = require("fs");
const path = require("path");

// Загружаем data.js в текущий контекст
const dataCode = fs.readFileSync(path.join(__dirname, "data.js"), "utf8");
const sandbox = { window: {} };
const vm = require("vm");
vm.createContext(sandbox);
vm.runInContext(dataCode, sandbox);
const MICRONATIONS = sandbox.window.MICRONATIONS || sandbox.MICRONATIONS;

// Шаблон отдельной статьи
const articleTemplate = (mn) => `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mn.title} — Википедия</title>
    <link rel="stylesheet" href="style.css">
</head>
<body data-article-id="${mn.id}">

<header id="wiki-header">
    <div class="header-inner">
        <a href="index.html" class="logo">
            <span class="logo-globe">🌐</span>
            <span class="logo-text">Википедия<br><small>Микронации</small></span>
        </a>
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Поиск микронации..." autocomplete="off">
            <div id="searchResults" class="search-results"></div>
        </div>
        <div class="header-links">
            <a href="index.html">Главная</a>
            <a href="all.html">Все статьи</a>
        </div>
    </div>
</header>

<main id="content"></main>

<footer id="wiki-footer">
    <p>Материал из «Википедии о микронациях» — свободной энциклопедии.</p>
</footer>

<script src="data.js"></script>
<script src="app.js"></script>
</body>
</html>`;

// Генерируем файлы
MICRONATIONS.forEach(mn => {
    const filename = `${mn.id}.html`;
    fs.writeFileSync(path.join(__dirname, filename), articleTemplate(mn), "utf8");
    console.log("✓ Создан:", filename);
});

console.log(`\nГотово! Сгенерировано ${MICRONATIONS.length} статей.`);
