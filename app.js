// Pantallas: portada (una por variante), catálogo y ficha.
// Variantes: b (la B actual), b1 Estantería, b2 Índice, b3 Vidriera.

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => "$" + n.toLocaleString("es-AR");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const sizeLabel = (p) => !p.ml ? "" : p.ml <= 5 ? "Decant 5 ml" : `Frasco ${p.ml} ml`;
const PAGE = 24;

function store(key, val) {
	try {
		if (val === undefined) return JSON.parse(localStorage.getItem("huele2:" + key));
		localStorage.setItem("huele2:" + key, JSON.stringify(val));
	} catch (e) { return null; }
}

const VARIANTS = { b: "B actual", b1: "B1 Estantería", b2: "B2 Índice", b3: "B3 Vidriera" };
const EMPTY_F = { cat: "", group: "", brand: "", q: "", sort: "store", hideOut: false, mood: "", accord: "", note: "" };

const S = {
	variant: VARIANTS[store("variant")] ? store("variant") : "b1",
	view: { name: "home" },
	stack: [],
	f: { ...EMPTY_F },
	limit: PAGE,
	cart: (store("cart") || []).filter((i) => byId(i.id)),
	focusId: null,
	qty: 1,
};

// ---------- Huecos para las funciones experimentales (lab.js) ----------
// Cada pantalla deja lugares con nombre; lab.js los llena. Sin lab.js, o con lo
// experimental apagado, quedan vacíos y la página funciona igual.
const LAB = { slots: {} };
const labOn = () => document.documentElement.dataset.lab === "on";
const slot = (name, ...args) => (labOn() ? (LAB.slots[name] || []).map((f) => f(...args)).join("") : "");

// ---------- Color de cada perfume, sacado de su foto ----------

const TINT = new Map();
const NEUTRAL = "#d9d5cd";
const tintStyle = (id) => (TINT.has(id) ? `--liq:${TINT.get(id)};` : "");

function measure(img) {
	try {
		const c = measure.c || (measure.c = document.createElement("canvas"));
		c.width = c.height = 40;
		const x = c.getContext("2d", { willReadFrequently: true });
		x.clearRect(0, 0, 40, 40);
		x.drawImage(img, 0, 0, 40, 40);
		const d = x.getImageData(0, 0, 40, 40).data;
		const B = Array.from({ length: 12 }, () => [0, 0, 0, 0]);
		for (let i = 0; i < d.length; i += 4) {
			const r = d[i], g = d[i + 1], b = d[i + 2];
			if (d[i + 3] < 200) continue;
			const mx = Math.max(r, g, b), mn = Math.min(r, g, b), dl = mx - mn;
			const l = (mx + mn) / 510, s = dl === 0 ? 0 : dl / (255 - Math.abs(mx + mn - 255));
			if (s < 0.28 || l < 0.12 || l > 0.9) continue;
			let h = mx === r ? ((g - b) / dl) % 6 : mx === g ? (b - r) / dl + 2 : (r - g) / dl + 4;
			h = (h * 60 + 360) % 360;
			const k = B[Math.floor(h / 30) % 12];
			k[0] += r * s; k[1] += g * s; k[2] += b * s; k[3] += s;
		}
		const best = B.reduce((m, k) => (k[3] > m[3] ? k : m));
		if (best[3] < 6) return NEUTRAL;
		return `rgb(${best.slice(0, 3).map((v) => Math.round(v / best[3])).join(" ")})`;
	} catch (e) { return NEUTRAL; }
}

function applyTint(img) {
	// La foto todavía no llegó (está esperando su paquete): no hay nada que medir
	if (img.dataset.pack || img.src === BLANK) return;
	const id = img.dataset.pid;
	img.style.setProperty("--ar", (img.naturalWidth / img.naturalHeight).toFixed(3));
	if (!TINT.has(id)) TINT.set(id, measure(img));
	$$(`[data-tint="${id}"]`).forEach((el) => el.style.setProperty("--liq", TINT.get(id)));
	if (S.view.name === "product" && S.view.id === id) setPageTint(TINT.get(id));
}

// En la ficha, toda la página toma el color del perfume
function setPageTint(c) {
	if (c) document.body.style.setProperty("--page-tint", c);
	document.body.classList.toggle("tinted", !!c);
}
document.addEventListener("load", (e) => { if (e.target.dataset && e.target.dataset.pid) applyTint(e.target); }, true);
const tintExisting = () => {
	watchPacks();
	$$("img[data-pid]").forEach((img) => { if (img.complete && img.naturalWidth) applyTint(img); });
};

// ---------- Piezas ----------

// Fotos con fondo de escena (no liso): conservan su fondo y se les difuminan los bordes.
// Al resto se le recortó el fondo y el producto queda directo sobre el color.
const FRAMED = new Set(typeof FRAMED_IDS !== "undefined" ? FRAMED_IDS : ["7UG4EbTZsALnV3IGQJfE", "BzJOb1yu7Ams5MdTqw4U", "FP3xbm6P8BVWtJdqEE4B", "JydKqXUsCskvE65O8ZgM",
	"P2YP2DgDItbPMjw0CyqO", "P9EKKh1s6tCQyBxF6WkT", "PwsRxw86H2JqcQk8QgEx", "RR9Bt38OmyCegFlxPRg2", "UMWUHqSDzLqnAhEjAkFD",
	"bSUQD6hW195UKJ0aoZXy", "g2s1GdGvj0kd4g5Ndrfq", "iF5LFhT7VL0VmMR9PYsf", "l0sryxFNnazGADitZ7qx", "sFmjBqXdyzMQ6X3Hhv9T"]);

// En la tienda final cada foto es un archivo (img/p/<id>.webp). En la página de prueba van en paquetes
// de a 30 (img/pk/<n>.js, con PACK_OF diciendo en cuál está cada una), porque admite pocos archivos;
// cada paquete se pide cuando sus fotos se acercan a la vista.
const PACKED = typeof PACK_OF !== "undefined";
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
const PHOTO = {};
const packState = {};
function PACK(n, map) {
	Object.assign(PHOTO, map);
	packState[n] = "done";
	$$(`img[data-pack="${n}"]`).forEach(showPacked);
}
function showPacked(img) {
	if (!PHOTO[img.dataset.pid]) return;
	img.removeAttribute("data-pack");
	img.src = PHOTO[img.dataset.pid];
}
function loadPack(n) {
	if (packState[n]) return;
	packState[n] = "loading";
	const s = document.createElement("script");
	s.src = `img/pk/${n}.js`;
	document.head.appendChild(s);
}
const packWatch = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((e) => {
	if (!e.isIntersecting) return;
	packWatch.unobserve(e.target);
	loadPack(e.target.dataset.pack);
}), { rootMargin: "900px 0px" }) : null;
function watchPacks() {
	$$("img[data-pack]").forEach((img) => {
		if (packState[img.dataset.pack] === "done") showPacked(img);
		else if (packWatch) packWatch.observe(img);
		else loadPack(img.dataset.pack);
	});
}

function photo(p, lazy = true) {
	const src = PACKED ? PHOTO[p.id] : p.img;
	const pack = PACKED && !src && PACK_OF[p.id] ? ` data-pack="${PACK_OF[p.id]}"` : "";
	return `<img src="${src || BLANK}"${pack} data-pid="${p.id}" alt="${esc(p.raw)}"${FRAMED.has(p.id) ? ' class="framed"' : ""}${lazy && !PACKED ? ' loading="lazy"' : ""} decoding="async">`;
}

function card(p, extra = "") {
	const c = CAT[p.cat];
	const focus = p.id === S.focusId ? ' style="view-transition-name:hero-bottle"' : "";
	return `<article class="card${p.out ? " is-out" : ""}" data-tint="${p.id}" style="${tintStyle(p.id)}--vt:c-${p.id}">
		<button class="card-hit" data-open="${p.id}" aria-label="Ver ${esc(p.name)}"></button>
		<div class="card-art"><div class="pwrap"${focus}>${photo(p)}</div>${p.out ? '<span class="badge badge-out">Sin stock</span>' : ""}</div>
		<div class="card-body">
			<p class="card-brand">${esc(p.brand || c.short)}</p>
			<h3 class="card-name">${esc(p.name)}</h3>
			<p class="card-meta">${sizeLabel(p) || esc(c.short)}</p>
			<p class="card-price"><b>${money(p.price)}</b></p>
			${extra}
		</div>
		${p.out ? "" : `<button class="quick" data-quick="${p.id}" aria-label="Agregar ${esc(p.name)} al pedido">+ Agregar</button>`}
		${slot("card", p)}
	</article>`;
}

function catTile(c, big = false) {
	return `<button class="cat-tile${big ? " big" : ""}" data-cat="${c.id}">
		<span class="cat-img"><img src="${c.img}" alt="" loading="lazy" decoding="async"></span>
		<span class="cat-txt">
			<span class="cat-name">${esc(c.short)}</span>
			<span class="cat-count">${c.total} productos</span>
		</span>
	</button>`;
}

const grid = (list) => `<div class="grid">${list.map((p) => card(p)).join("")}</div>`;
const featured = () => FEATURED.map(byId);


// Preguntas frecuentes: lo que pregunta quien no conoce la tienda
function faq() {
	const meet = STORE.meet.map(([, n, where]) => `${n.replace("Encuentro en ", "")} (${where})`).join(" o en ");
	const qs = [
		["¿Qué es un decant?", `Es un frasquito de 5 ml con atomizador, cargado del frasco del perfume. Sirve para usarlo unos días y ver cómo te queda antes de comprar el frasco entero, o para tener varios perfumes sin gastar de más.
			<a class="link" href="https://www.youtube.com/watch?v=${STORE.decantVideo[0]}" target="_blank" rel="noopener">Cómo se hace un decant, en el canal →</a>`],
		["¿Cuánto rinde un decant de 5 ml?", "Unas 50 a 70 atomizaciones, según el atomizador. Alcanza para probarlo bien durante varias semanas."],
		["¿Qué quiere decir “inspirado en”?", "Que es un perfume de otra marca, o de mi línea, con un aroma parecido a uno conocido y a un precio menor. En cada perfume te digo en cuál se inspira."],
		["¿Cómo hago el pedido?", `Elegís los perfumes, los sumás al pedido y lo mandás por WhatsApp. Ahí te confirmo stock, entrega y forma de pago. ${STORE.notice}`],
		["¿Hay un mínimo de compra?", `Sí, el pedido mínimo es de ${money(STORE.minOrder)}. Podés combinar decants y frascos como quieras.`],
		["¿Cómo me llega?", `Nos encontramos en ${meet}. Si no te queda cerca, lo envío por Correo Argentino a la sucursal que te quede cómoda.`],
		["¿Cómo pago?", "Lo coordinamos por WhatsApp cuando confirmás el pedido."],
	];
	return `<section class="sec faq" id="preguntas">
		<div class="sec-head"><p class="eyebrow">Antes de comprar</p><h2>Preguntas frecuentes</h2></div>
		<div class="faq-list">${qs.map(([q, a]) => `<details><summary>${q}</summary><div class="faq-a"><p>${a}</p></div></details>`).join("")}</div>
	</section>`;
}

function howTo() {
	return `<section class="sec sec-how">
		<div class="sec-head"><p class="eyebrow">Así se compra</p><h2>Cómo hacer tu pedido</h2></div>
		<ol class="steps">
			<li><b>Elegí tus perfumes.</b> Decant de 5 ml para probar o el frasco entero.</li>
			<li><b>Armá el pedido.</b> El mínimo es de ${money(STORE.minOrder)}; podés combinar lo que quieras.</li>
			<li><b>Lo cerramos por WhatsApp.</b> Te confirmo stock, envío y forma de pago.</li>
		</ol>
	</section>`;
}

// ---------- Portadas ----------

const HOME = {
	// B actual: titular gigante, fila de decants y categorías
	b() {
		const rack = CATS.filter((c) => c.group === "decant").map((c) => PRODUCTS.find((p) => p.cat === c.id && !p.out)).filter(Boolean).slice(0, 7);
		return `<section class="hero hero-a">
			<p class="eyebrow">Decants de 5 ml · ${STORE.place}</p>
			<h1 class="mega"><span>Probá</span> <span>antes de</span> <span>enamorarte</span></h1>
			<div class="hero-a-row">
				<p class="lede">Árabes, de diseñador y de nicho en decant de 5 ml. Si te enamorás, vas por el frasco.</p>
				<div class="cta"><button class="btn" data-group="decant">Ver decants</button><button class="btn ghost" data-catalog>Todo el catálogo</button></div>
			</div>
			<div class="rack">${rack.map((p, i) => `<button class="rack-item" data-tint="${p.id}" style="${tintStyle(p.id)}--i:${i}" data-open="${p.id}">
				<span class="rack-photo pwrap">${photo(p, false)}</span>
				<span class="rack-name">${esc(p.name)}</span>
				<span class="rack-price">${money(p.price)}</span>
			</button>`).join("")}</div>
		</section>
		<section class="sec"><div class="sec-head"><p class="eyebrow">Colecciones</p><h2>Elegí por categoría</h2></div>
			<div class="cat-grid">${CATS.map((c) => catTile(c)).join("")}</div></section>
		<section class="sec"><div class="sec-head"><p class="eyebrow">Para empezar</p><h2>Destacados</h2>
			<button class="link" data-catalog>Ver todo el catálogo →</button></div>${grid(featured())}</section>
		${howTo()}`;
	},

	// B1: las categorías primero, como en la tienda actual
	b1() {
		return `<section class="intro">
			<h1 class="intro-title">Categorías</h1>
			<p class="intro-txt">Decants de 5 ml y frascos de perfumes árabes, de diseñador y nicho.</p>
		</section>
		<section class="mosaic">${CATS.map((c, i) => catTile(c, i === 0)).join("")}</section>
		${slot("home")}
		<section class="sec sec-pop"><div class="sec-head"><p class="eyebrow">Para empezar</p><h2>Destacados</h2></div>${grid(featured())}</section>
		${howTo()}
		${faq()}`;
	},

	// B2: índice al costado; en la portada, grupos con sus categorías
	b2() {
		return `<section class="intro">
			<h1 class="intro-title">Probá antes de <em>enamorarte</em></h1>
			<p class="intro-txt">Todas las categorías están en el índice. Los decants de 5 ml son para probar; los frascos, para quedarte.</p>
		</section>
		${Object.entries(GROUPS).map(([g, G]) => `<section class="sec sec-group">
			<div class="sec-head"><p class="eyebrow">${G.hint}</p><h2>${G.name}</h2>
				<button class="link" data-group="${g}">Ver todo →</button></div>
			<div class="cat-grid">${CATS.filter((c) => c.group === g).map((c) => catTile(c)).join("")}</div>
		</section>`).join("")}
		<section class="sec"><div class="sec-head"><p class="eyebrow">Para empezar</p><h2>Destacados</h2></div>${grid(featured())}</section>
		${howTo()}`;
	},

	// B3: accesos directos y una fila deslizable por categoría
	b3() {
		const quick = [
			["group", "decant", "Decants de 5 ml"], ["group", "frasco", "Frascos"], ["cat", "ZrzCxoGZZq7ovd2q7nf6", "Ofertas"],
			["cat", "PypkckaWyv6pWwCku3L3", "Línea de la casa"], ["cat", "96RmOEIA4IW98xBL2FW5", "Nicho"], ["cat", "DI0FUuoaRooGHMTJJaHm", "Diseñador"],
		];
		const count = ([k, v]) => k === "group" ? CATS.filter((c) => c.group === v).reduce((t, c) => t + c.total, 0) : CAT[v].total;
		return `<section class="hero hero-b3">
			<h1 class="mega small"><span>Probá</span> <span>antes de</span> <span>enamorarte</span></h1>
			<nav class="quick-nav" aria-label="Accesos directos">${quick.map((q) =>
				`<button data-${q[0]}="${q[1]}"><span>${q[2]}</span><em>${count(q).toLocaleString("es-AR")} productos</em></button>`).join("")}</nav>
		</section>
		${CATS.map((c) => {
			const items = PRODUCTS.filter((p) => p.cat === c.id).slice(0, 12);
			return `<section class="shelf">
				<div class="shelf-head">
					<h2><button data-cat="${c.id}">${esc(c.short)}</button></h2>
					<span class="shelf-group">${GROUPS[c.group].name}</span>
					<button class="link" data-cat="${c.id}">Ver los ${c.total} →</button>
				</div>
				<div class="shelf-row">${items.map((p) => card(p)).join("")}</div>
			</section>`;
		}).join("")}
		${howTo()}`;
	},
};

// ---------- Índice (B2) y barra de categorías (B1) ----------

function indexNav() {
	const f = S.f, inCat = S.view.name === "catalog";
	return `<button class="idx-all" data-catalog aria-current="${inCat && !f.cat && !f.group && !f.q}">Todo el catálogo</button>
	${Object.entries(GROUPS).map(([g, G]) => `<div class="idx-group">
		<button class="idx-gname" data-group="${g}" aria-current="${inCat && f.group === g && !f.cat}">${G.name}</button>
		<ul>${CATS.filter((c) => c.group === g).map((c) => `<li><button data-cat="${c.id}" aria-current="${inCat && f.cat === c.id}">
			<span>${esc(c.short)}</span><em>${c.total}</em></button></li>`).join("")}</ul>
	</div>`).join("")}`;
}

// Accesos directos a todas las categorías, en el orden de la tienda y sin subgrupos.
// "Todo" vuelve a la portada, donde están todas las categorías a la vista.
function railNav() {
	return `<button data-go="home">Todo</button>${CATS.map((c) =>
		`<button data-cat="${c.id}">${esc(c.short)}</button>`).join("")}`;
}

// ---------- Catálogo ----------

// ---------- Búsqueda: por nombre, marca, "inspirado en", notas, acordes y estilo, aunque esté mal escrito ----------

// Cómo "suena" una palabra, así "sovage" encuentra Sauvage y "bainilla" encuentra vainilla
const sound = (w) => norm(w).replace(/eau|au/g, "o").replace(/ou/g, "u").replace(/ph/g, "f").replace(/th/g, "t")
	.replace(/qu/g, "k").replace(/c(?=[ei])/g, "s").replace(/c/g, "k").replace(/z/g, "s").replace(/v/g, "b")
	.replace(/y/g, "i").replace(/h/g, "").replace(/(.)\1+/g, "$1");

function searchText(p) {
	if (!p._s) {
		const name = norm(`${p.raw} ${p.brand} ${p.inspired}`);
		const extra = norm(`${CAT[p.cat].short} ${allNotes(p).join(" ")} ${(p.accords || []).map((a) => a[0]).join(" ")} ${p.moods.join(" ")}`);
		const words = [...new Set(`${name} ${extra}`.split(/[^a-z0-9]+/).filter((w) => w.length >= 3).map(sound))];
		p._s = { name, extra, words };
	}
	return p._s;
}

// ¿Están a "max" letras o menos de distancia? (cambiar, sacar o agregar una letra cuenta 1)
function near(a, b, max) {
	if (Math.abs(a.length - b.length) > max) return false;
	let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		const cur = [i];
		let best = i;
		for (let j = 1; j <= b.length; j++) {
			cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
			best = Math.min(best, cur[j]);
		}
		if (best > max) return false;
		prev = cur;
	}
	return prev[b.length] <= max;
}

// Qué tan bien coincide: 3 en el nombre o la marca, 2 en notas, acordes o estilo, 1 parecido (si se permite), 0 nada
function matchScore(p, q, fuzzy) {
	const s = searchText(p);
	const toks = q.split(/[^a-z0-9]+/).filter(Boolean);
	if (s.name.includes(q) || toks.every((t) => s.name.includes(t))) return 3;
	if (s.extra.includes(q) || toks.every((t) => s.name.includes(t) || s.extra.includes(t))) return 2;
	if (!fuzzy) return 0;
	// Si suena igual ("laiton" → Layton) va antes que si solo se parece ("laiton" → Clayton)
	let same = true;
	const ok = toks.every((t) => {
		if (s.name.includes(t) || s.extra.includes(t)) return true;
		const st = sound(t), k = st.length >= 7 ? 2 : st.length >= 4 ? 1 : 0;
		if (s.words.includes(st)) return true;
		same = false;
		return k > 0 && s.words.some((w) => near(st, w, k) || (w.length > st.length && near(st, w.slice(0, st.length), k)));
	});
	return ok ? (same ? 1.5 : 1) : 0;
}

function scoped(withBrand = true) {
	const f = S.f;
	const q = norm(f.q).trim();
	let list = PRODUCTS.filter((p) =>
		(!f.cat || p.cat === f.cat) && (!f.group || p.group === f.group) &&
		(!withBrand || !f.brand || p.brand === f.brand) && (!f.hideOut || !p.out) &&
		(!f.mood || p.moods.includes(f.mood)) && (!f.accord || (p.accords || []).some(([a]) => a === f.accord)) &&
		(!f.note || allNotes(p).includes(f.note)));
	let fuzzy = false;
	if (q) {
		// Primero lo que coincide tal cual; si no hay nada, lo más parecido
		let hits = list.map((p) => [p, matchScore(p, q, false)]).filter((h) => h[1]);
		if (!hits.length && q.length >= 4) {
			hits = list.map((p) => [p, matchScore(p, q, true)]).filter((h) => h[1]);
			fuzzy = hits.length > 0;
		}
		list = hits.sort((a, b) => b[1] - a[1]).map((h) => h[0]);
	}
	if (f.sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
	if (f.sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
	list.fuzzy = fuzzy;
	return list;
}

function brandChips() {
	const counts = {};
	scoped(false).forEach((p) => { if (p.brand) counts[p.brand] = (counts[p.brand] || 0) + 1; });
	const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 14);
	if (top.length < 2) return "";
	return `<div class="fgroup"><span class="flabel">Marca</span><div class="chips" role="group" aria-label="Marca">
		<button class="chip" data-brand="" data-fkey="brand-" aria-pressed="${!S.f.brand}">Todas</button>
		${top.map(([b, n]) => `<button class="chip" data-brand="${esc(b)}" data-fkey="brand-${esc(b)}" aria-pressed="${S.f.brand === b}">${esc(b)} <em>${n}</em></button>`).join("")}
	</div></div>`;
}

function catChips() {
	if (S.variant === "b1" || S.variant === "b2") return "";
	const f = S.f;
	const cats = f.group ? CATS.filter((c) => c.group === f.group) : CATS;
	return `<div class="fgroup"><span class="flabel">Categoría</span><div class="chips" role="group" aria-label="Categoría">
		<button class="chip" data-fcat="" data-fkey="cat-" aria-pressed="${!f.cat}">Todas</button>
		${cats.map((c) => `<button class="chip" data-fcat="${c.id}" data-fkey="cat-${c.id}" aria-pressed="${f.cat === c.id}">${esc(c.short)}${f.group ? "" : ` <em>${GROUPS[c.group].name.split(" ")[0]}</em>`}</button>`).join("")}
	</div></div>`;
}

// En la página de un estilo, los demás estilos a mano para seguir explorando
function moodChips() {
	if (!S.f.mood) return "";
	const counts = {};
	PRODUCTS.forEach((p) => p.moods.forEach((m) => { counts[m] = (counts[m] || 0) + 1; }));
	return `<div class="fgroup"><span class="flabel">Estilo</span><div class="chips" role="group" aria-label="Estilo">
		${Object.keys(MOOD_COLORS).filter((m) => counts[m]).map((m) => `<button class="chip chip-mood" data-mood="${esc(m)}" style="--c:${MOOD_COLORS[m]}" aria-pressed="${S.f.mood === m}">${esc(m)}</button>`).join("")}
	</div></div>`;
}

function catBody() {
	const list = scoped();
	return `<div class="filters">
		${moodChips()}
		${catChips()}
		${brandChips()}
		<div class="fgroup frow">
			<label class="fsort"><span class="flabel">Ordenar</span>
				<select id="sort">
					<option value="store"${S.f.sort === "store" ? " selected" : ""}>Como en la tienda</option>
					<option value="asc"${S.f.sort === "asc" ? " selected" : ""}>Menor precio</option>
					<option value="desc"${S.f.sort === "desc" ? " selected" : ""}>Mayor precio</option>
				</select>
			</label>
			<label class="fcheck"><input type="checkbox" id="hide-out"${S.f.hideOut ? " checked" : ""}> Ocultar sin stock</label>
		</div>
	</div>
	<p class="count">${list.length} perfume${list.length === 1 ? "" : "s"}${list.fuzzy ? ` · lo más parecido a “${esc(S.f.q)}”` : ""}</p>
	${list.length ? grid(list) : `<div class="empty"><p>No encontramos perfumes con esos filtros.</p><button class="btn" data-clear>Limpiar filtros</button></div>`}`;
}

function catalog() {
	const f = S.f, c = CAT[f.cat];
	const cap = (s) => s[0].toUpperCase() + s.slice(1);
	const dot = f.mood ? MOOD_COLORS[f.mood] : f.accord ? ACCORD_COLORS[f.accord] : "";
	const title = f.q ? `Resultados para “${esc(f.q)}”` : f.mood ? esc(f.mood) : f.accord ? esc(cap(f.accord)) : f.note ? esc(cap(f.note))
		: c ? esc(c.short) : f.group ? GROUPS[f.group].name : "Todo el catálogo";
	const sub = f.mood ? `Todos los perfumes marcados como «${esc(f.mood)}».` : f.accord ? `Perfumes con acorde ${esc(f.accord)}.`
		: f.note ? `Perfumes con ${esc(f.note)} entre sus notas.`
		: c ? `${c.total.toLocaleString("es-AR")} productos en la tienda` : f.group ? GROUPS[f.group].hint : "Decants de 5 ml, frascos y ofertas.";
	return `<section class="cat-head">
		<div class="topbar"><button class="back" data-back>← Volver</button>${shareBtn()}</div>
		<h1${dot ? ` class="h-dot" style="--c:${dot}"` : ""}>${title}</h1>
		<p>${sub}</p>
	</section>
	${slot("catHead", c)}
	<div id="cat-body">${catBody()}</div>`;
}

// ---------- Ficha ----------

function product() {
	const p = byId(S.view.id), c = CAT[p.cat];
	const sib = siblingsOf(p);
	const like = similarTo(p);
	const more = like.length >= 2 ? [] : PRODUCTS.filter((o) => o.cat === p.cat && o.id !== p.id && !o.out).slice(0, 4);
	return `<section class="pdp" data-tint="${p.id}" style="${tintStyle(p.id)}">
		<div class="topbar"><button class="back" data-back>← Volver</button>${shareBtn()}</div>
		<div class="pdp-art"><div class="pwrap" id="pdp-photo" style="view-transition-name:hero-bottle">${photo(p, false)}</div></div>
		<div class="pdp-info">
			<button class="pdp-line" data-cat="${c.id}">${esc(c.short)}</button>
			${p.brand ? `<p class="pdp-brand">${esc(p.brand)}</p>` : ""}
			<h1 class="pdp-name">${esc(p.name)}</h1>
			${p.inspired ? `<p class="pdp-insp">Inspirado en ${esc(p.inspired)}</p>` : ""}
			<p class="pdp-tags">${sizeLabel(p) ? `<span>${sizeLabel(p)}</span>` : ""}${p.gender ? `<span>${p.gender === "hombre" ? "Hombre" : "Mujer"}</span>` : ""}${p.out ? '<span class="tag-out">Sin stock</span>' : ""}</p>
			${moods(p)}
			<p class="pdp-price">${money(p.price)}</p>
			${slot("pdpPrice", p, sib)}
			${sib.length ? `<div class="sizes"><span class="flabel">También en</span>${sib.map((o) =>
				`<button class="size" data-open="${o.id}"><span class="size-name">${sizeLabel(o) || "Otra presentación"}</span><span class="size-price">${money(o.price)}</span></button>`).join("")}</div>` : ""}
			<div class="buy">
				<div class="qty" aria-label="Cantidad">
					<button data-qty="-1" aria-label="Uno menos"${p.out ? " disabled" : ""}>−</button>
					<output id="qty">${S.qty}</output>
					<button data-qty="1" aria-label="Uno más"${p.out ? " disabled" : ""}>+</button>
				</div>
				<button class="btn add" id="add"${p.out ? " disabled" : ""}><span>${p.out ? "Sin stock" : "Agregar al pedido"}</span><b id="add-price">${money(p.price * S.qty)}</b></button>
			</div>
			${p.desc ? `<div class="about"><h2>Sobre este perfume</h2><p>${esc(p.desc)}</p></div>` : ""}
			${slot("pdpAfter", p)}
		</div>
		${p.notes ? notesBlock(p) : ""}
	</section>
	${like.length ? `<section class="sec sec-related">
		<div class="sec-head"><p class="eyebrow">Por acordes parecidos</p><h2>Si te gusta este, probá</h2></div>
		<div class="grid">${like.map(({ q, common }) => card(q, `<p class="card-why">En común: ${common.map(esc).join(", ")}</p>`)).join("")}</div>
	</section>` : ""}
	${more.length ? `<section class="sec sec-related">
		<div class="sec-head"><p class="eyebrow">Misma categoría</p><h2>Más de ${esc(c.short)}</h2>
			<button class="link" data-cat="${c.id}">Ver los ${c.total} →</button></div>
		${grid(more)}
	</section>` : ""}`;
}

// ---------- Notas: salida, corazón y fondo, con un punto del color de la familia de cada nota ----------

// Acordes principales en barras: el largo es cuánto pesa cada acorde en el perfume.
// Debajo, las notas de salida, corazón y fondo en texto simple.
function isLight(hex) {
	const n = parseInt(hex.slice(1), 16);
	return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 150;
}

function notesBlock(p) {
	const tiers = [["top", "Salida"], ["heart", "Corazón"], ["base", "Fondo"]];
	return `<section class="pdp-notes">
		${p.accords ? `<h2>Acordes principales</h2>
		<div class="accords">${p.accords.map(([a, v], i) => {
			const c = ACCORD_COLORS[a] || "#ccc";
			return `<button class="accord" data-accord="${esc(a)}" style="--w:${v}%;--c:${c};--t:${isLight(c) ? "#161513" : "#fff"};--i:${i}" aria-label="Ver perfumes con acorde ${esc(a)}">${esc(a)}</button>`;
		}).join("")}</div>` : ""}
		<dl class="nlines">${tiers.map(([k, t]) => `<div><dt>${t}</dt><dd>${p.notes[k].map((n) =>
			`<button class="nlink" data-note="${esc(n)}">${esc(n)}</button>`).join(", ")}</dd></div>`).join("")}</dl>
	</section>`;
}

const moods = (p) => p.moods.length ? `<p class="moods">${p.moods.map((m) =>
	`<button class="mood" data-mood="${esc(m)}" style="--c:${MOOD_COLORS[m] || "#999"}">${esc(m)}</button>`).join("")}</p>` : "";

// "Si te gusta este, probá": parecidos por acordes (lo que más pesa), estilo y notas en común.
// Un solo tamaño por perfume, y si se puede del mismo tamaño que el que se está mirando.
function similarTo(p, n = 4) {
	if (!p.accords) return [];
	const A = Object.fromEntries(p.accords), lenA = Math.hypot(...Object.values(A));
	const notesP = new Set(allNotes(p));
	const seen = new Set([p.key + "|" + p.brand]);
	return PRODUCTS.filter((q) => q.accords && !q.out && q.id !== p.id)
		.map((q) => {
			const B = Object.fromEntries(q.accords);
			const cos = Object.keys(A).reduce((t, k) => t + A[k] * (B[k] || 0), 0) / (lenA * Math.hypot(...Object.values(B)));
			const moodsInCommon = q.moods.filter((m) => p.moods.includes(m)).length / 3;
			const nq = allNotes(q), notesInCommon = nq.filter((x) => notesP.has(x)).length / new Set([...notesP, ...nq]).size;
			const common = Object.keys(A).filter((k) => B[k]).sort((a, b) => Math.min(B[b], A[b]) - Math.min(B[a], A[a])).slice(0, 2);
			return { q, common, score: cos * 0.7 + moodsInCommon * 0.15 + notesInCommon * 0.15 + (q.ml === p.ml ? 0.001 : 0) };
		})
		.filter((s) => s.score > 0.45 && s.common.length)
		.sort((a, b) => b.score - a.score)
		.filter(({ q }) => { const k = q.key + "|" + q.brand; return !seen.has(k) && seen.add(k); })
		.slice(0, n);
}

// ---------- Compartir ----------

const SHARE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/></svg>`;
const shareBtn = () => `<button class="share-btn" data-share>${SHARE_ICON}<span>Compartir</span></button>`;

// La dirección de la página que se está viendo (la que va a tener cuando la tienda esté en huele.com.ar)
function pageLink() {
	const v = S.view, f = S.f;
	if (v.name === "product") return `${STORE.site}/perfume/${byId(v.id).slug}`;
	if (v.name !== "catalog") return STORE.site;
	if (f.mood) return `${STORE.site}/estilo/${slug(f.mood)}`;
	if (f.accord) return `${STORE.site}/acorde/${slug(f.accord)}`;
	if (f.note) return `${STORE.site}/nota/${slug(f.note)}`;
	if (f.cat) return `${STORE.site}/categoria/${CAT[f.cat].slug}`;
	if (f.q) return `${STORE.site}/buscar?q=${encodeURIComponent(f.q)}`;
	return STORE.site;
}

function shareData() {
	const v = S.view;
	if (v.name === "product") {
		const p = byId(v.id);
		const what = `${p.name}${p.brand && p.brand !== STORE.name ? ` de ${p.brand}` : ""}${sizeLabel(p) ? ` (${sizeLabel(p).toLowerCase()})` : ""}`;
		return { title: `${p.name} · ${STORE.name}`, text: `Mirá ${what} en ${STORE.name}`, url: pageLink() };
	}
	const h = $(".cat-head h1")?.textContent || STORE.name;
	return { title: `${h} · ${STORE.name}`, text: `${h} en ${STORE.name}`, url: pageLink() };
}

function updatePrice() {
	const p = byId(S.view.id);
	$("#qty").textContent = S.qty;
	$("#add-price").textContent = money(p.price * S.qty);
}
