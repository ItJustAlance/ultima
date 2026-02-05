# static-site-webpack-habr — starter template for front-end layout

templates static HTML site, Webpack 5, jQuery, SVG sprites, SASS (with convenient media-query helpers)

- - -

## English

### What this project is

A minimal **starter template** for building static sites with Webpack 5. It includes:

*   HTML templates (via `html-webpack-plugin`)
    
*   SASS workflow with reusable breakpoints & helpers
    
*   Inline SVG sprite support (svg-sprite-loader) for easy use of icons
    
*   jQuery available globally (or via `ProvidePlugin`)
    
*   A small modal module included (JustModal)
    
*   Copy/static assets handling, image/font pipeline, dev server, prod build optimizations
    

This repo is intended for fast prototyping and as a comfortable base for markup / layout work.

- - -

### Key features

*   Webpack 5 based pipeline: dev server, HMR, production build (CSS/JS minification)
    
*   SASS variables and a breakpoint helper `r()` to write readable responsive rules
    
*   Automatical inlining of SVG icons into DOM (no external sprite file needed)
    
*   Global jQuery exposure (so older plugins or scripts using `$` work)
    
*   Simple modal component (JustModal)
    
*   Copy plugin to move `src/img`, `src/fonts`, `favicon` etc → `dist/`
    

- - -

### Quick install & scripts

bash

`# install dependencies (once)
npm install

# development build
npm run dev

# watch mode
npm run watch

# start dev server (opens browser)
npm start

# production build
npm run build
`

`package.json` scripts (example):

json

`{
  "scripts": {
    "dev": "webpack --mode development",
    "watch": "webpack --mode development --watch",
    "start": "webpack serve --no-client-overlay-warnings --open",
    "build": "webpack --mode production && prettier --print-width=120 --parser html --write dist/*.html"
  }
}`

- - -

### Project structure (suggested)

graphql

`
project-root/
├─ src/
│  ├─ js/
│  │  ├─ index.js        # entry
│  │  ├─ jquery.js       # optional manual jQuery boot (or use ProvidePlugin)
│  │  └─ static-js.js    # page scripts that rely on jQuery
│  ├─ scss/
│  │  ├─ _variables.scss
│  │  ├─ _mixins.scss
│  │  └─ style.scss
│  ├─ icons/             # svg files -> included in inline sprite
│  ├─ img/               # images copied to /dist/img
│  ├─ fonts/
│  └─ html/
│     ├─ views/          # templates (html-webpack-plugin)
│     └─ includes/       # partials loaded via raw-loader
├─ webpack.config.js
├─ package.json
└─ README.md
`

- - -

### How SVG inline sprite works

1.  Put SVG files in `src/icons/` (e.g. `phone.svg`, `logo.svg`).
    
2.  In your `src/js/index.js` import all icons so the loader includes them:
    

js


`const importAll = (r) => r.keys().forEach(r); importAll(require.context("../icons", false, /\.svg$/));`

3.  Use icons in HTML/templates:
    

html

`<svg class="svg-item">
        <use xlink:href="#icon-logo"></use>
      </svg>`

Here `svg-sprite-loader` will generate symbols with ids like `icon-<name>` by default.

- - -

### jQuery & global `$`

Two options to make `$` available:
 `src/js/index.js`:

js

`import $ from 'jquery'; window.$ = window.jQuery = $;`



- - -

### SASS breakpoints and helper `+r($md)`

Add SASS variables and a small mixin helper to keep media queries compact and consistent.

Example `_variables.scss`:

scss


`$xss: 360; $xs: 450; $sm: 600; $md: 768; $lg: 1023; $xxl: 1160; $xl: 1200; $hd: 1440;`

Example `_mixins.scss` (helper `+r()`):

sass

`@mixin r($min) {   @media (min-width: #{$min}px) {     @content;   } }`

Example usage:

sass

`.block font-size: 14px;   
	+r($md)
	  font-size: 16px;`


You can also create helpers for max-width or ranges if you prefer.

- - -

### Modal module — JustModal

A simple small modal module is included (JustModal). Put modal code in `src/js/justmodal.js` and expose an API:

js

To launch a modal window,
add the "js-btn-modal" class.
To specify the modal window ID, use the data-modal="modal-support" attribute.

`&#706;a class="js-btn-modal" href="#" data-modal="modal-support"&#707;Модальное окно&#706;/a&#707;`
`<div class="just-modal" id="modal-support">...</div>`

- - -

### Notes & tips

*   Keep `src/icons` exclusive for icons used in sprite; other SVG files can live in `src/img`.
    
*   If you need SVG optimization, use `svgo` with compatible `svgo-loader` versions — test locally.
    
*   For multi-page templates, rely on `html-webpack-plugin` to generate each page from `src/html/views`.
    
*   Use `MiniCssExtractPlugin` for extracting CSS in production and local `css-loader` for imports.
    
*   Remember to set `mode` properly when running webpack (or the config can set defaults).
    

- - -

## Author

Author: **ItJustALance**

- - -

- - -

# Русская версия

# static-site-webpack-habr — начальный шаблон для верстки

Шаблон для статического HTML-сайта с Webpack 5, jQuery, SVG-спрайтами и SASS (с удобными медиазапросами)

- - -

### Что это такое

Минимальный **стартер-шаблон** для разработки и верстки. Включает:

*   HTML-шаблоны (html-webpack-plugin)
    
*   SASS с переменными и удобным helper'ом для breakpoint'ов
    
*   Inline SVG-спрайт (svg-sprite-loader) — иконки автоматически вставляются в DOM
    
*   jQuery доступен глобально (или через ProvidePlugin)
    
*   Модуль модального окна (JustModal)
    
*   Обработка статических ресурсов: изображения, шрифты, фавикон; dev-server и оптимизации для production
    

Шаблон удобен для быстрой верстки и прототипирования.

- - -

### Основные возможности

*   Сборка на Webpack 5: dev-server, HMR, production-оптимизации (минификация CSS/JS)
    
*   SASS-переменные + миксин `r()` для компактных медиазапросов
    
*   Inline-спрайт SVG (нет отдельного файла спрайта)
    
*   Глобальная доступность `$`/`jQuery`
    
*   Лёгкий модальный компонент (JustModal)
    
*   CopyPlugin — копирует `src/img`, `src/fonts`, `favicon` в `dist/`
    

- - -

### Быстрый старт и скрипты

bash

`# install dependencies (once)
npm install

# development build
npm run dev

# watch mode
npm run watch

# start dev server (opens browser)
npm start

# production build
npm run build
`

Пример скриптов в `package.json`:

json

`{
  "scripts": {
    "dev": "webpack --mode development",
    "watch": "webpack --mode development --watch",
    "start": "webpack serve --no-client-overlay-warnings --open",
    "build": "webpack --mode production && prettier --print-width=120 --parser html --write dist/*.html"
  }
}`

- - -

### Структура проекта (рекомендуемая)

css

Копировать код

`
project-root/
├─ src/
│  ├─ js/
│  │  ├─ index.js        # entry
│  │  ├─ jquery.js       # optional manual jQuery boot (or use ProvidePlugin)
│  │  └─ static-js.js    # page scripts that rely on jQuery
│  ├─ scss/
│  │  ├─ _variables.scss
│  │  ├─ _mixins.scss
│  │  └─ style.scss
│  ├─ icons/             # svg files -> included in inline sprite
│  ├─ img/               # images copied to /dist/img
│  ├─ fonts/
│  └─ html/
│     ├─ views/          # templates (html-webpack-plugin)
│     └─ includes/       # partials loaded via raw-loader
├─ webpack.config.js
├─ package.json
└─ README.md
`

- - -

### Inline SVG-спрайт — как работает

1.  Поместите SVG в `src/icons/` (напр., `logo.svg`, `phone.svg`).
    
2.  В `src/js/index.js` импортируйте все SVG:
    

js


`const importAll = (r) => r.keys().forEach(r); importAll(require.context("../icons", false, /\.svg$/));`

3.  Используйте иконки в шаблонах:
    

html

`<svg class="svg-item">
        <use xlink:href="#icon-logo"></use>
      </svg>`

По умолчанию `svg-sprite-loader` генерирует id в формате `icon-<имя-файла>`.

- - -

### jQuery и глобальная переменная `$`

js

`import $ from 'jquery'; window.$ = window.jQuery = $;`

- - -

### SASS: переменные и `r($md)`

Пример `_variables.scss`:

scss

Копировать код

`$xss: 360; $xs: 450; $sm: 600; $md: 768; $lg: 1023; $xxl: 1160; $xl: 1200; $hd: 1440;`

Пример `_mixins.scss`:

sass

`@mixin r($min) {   @media (min-width: #{$min}px) {     @content;   } }`

Пример использования:

sass

`.block font-size: 14px;   
	+r($md)
	  font-size: 16px;`

- - -

### Модуль модального окна — JustModal

Простой модуль для открытия/закрытия модальных окон. Пример API:

для запуска модального окна,
    добавляем класс "js-btn-modal"
    для указания id модального окна пишем аттрибут data-modal="modal-support"

`&#706;a class="js-btn-modal" href="#" data-modal="modal-support"&#707;Модальное окно&#706;/a&#707;`
`<div class="just-modal" id="modal-support">...</div>`

- - -

### Заметки и рекомендации

*   Держите иконки для спрайта в `src/icons`, а обычные SVG для `<img>` в `src/img`.
    
*   Если нужна оптимизация SVG, добавляйте `svgo` совместимой версии и настраивайте `svgo-loader`.
    
*   Для мультстраничных сайтов используйте `html-webpack-plugin` для генерации страниц.
    
*   Не забывайте выставлять `mode` при запуске webpack (`development`/`production`) или задайте его в конфиге.
    
*   В production обязательно протестируйте получившиеся CSS/JS и относительные пути в шаблонах.
    

- - -

## Автор

Автор: **ItJustALance**
