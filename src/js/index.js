import "bootstrap";

import "./static-js";

// Автоматически импортировать ВСЕ SVG из src/icons
const importAll = (r) => r.keys().forEach(r);
importAll(require.context("../icons", false, /\.svg$/));
