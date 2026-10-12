// Navegación, carrito, pedido por WhatsApp y eventos.

// ---------- Dibujar la página ----------

function currentLabel() {
	const f = S.f;
	if (S.view.name !== "catalog") return "Elegí una";
	return f.cat ? CAT[f.cat].short : f.group ? GROUPS[f.group].name : "Todo";
}

function render() {
	const v = S.view.name;
	let html = v === "home" ? HOME[S.variant]() : v === "catalog" ? catalog() : product();
	if (S.variant === "b2") {
		html = `<div class="idx-layout">
			<aside class="idx" aria-label="Categorías">${indexNav()}</aside>
			<div class="idx-main">
				<button class="idx-open" data-index><span>Categorías</span><b>${esc(currentLabel())}</b></button>
				${html}
			</div>
		</div>`;
	}
	$("#view").innerHTML = html;
	document.documentElement.dataset.view = v;
	const activeCat = v === "catalog" ? S.f.cat : v === "product" ? byId(S.view.id).cat : "";
	$$("#rail button").forEach((b) => b.setAttribute("aria-current",
		b.dataset.go === "home" ? v === "home" : !!activeCat && b.dataset.cat === activeCat));
	const on = $("#rail [aria-current='true']");
	// En el celular la barra se desliza de costado hasta la categoría activa (sin mover la página)
	const rail = $("#rail");
	if (on && rail.scrollWidth > rail.clientWidth) {
		rail.scrollTo({ left: on.offsetLeft - rail.clientWidth / 2 + on.offsetWidth / 2, behavior: reduceMotion() ? "auto" : "smooth" });
	}
	setPageTint(v === "product" ? TINT.get(S.view.id) : null);
	tintExisting();
}


function refreshCatalog() {
	const key = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.fkey : null;
	const update = () => {
		$("#cat-body").innerHTML = catBody();
		tintExisting();
		if (key) $(`[data-fkey="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
	};
	if (document.startViewTransition && !reduceMotion()) {
		document.documentElement.dataset.dir = "filter";
		document.startViewTransition(update);
	} else update();
}

function transition(update, dir = "fwd") {
	document.documentElement.dataset.dir = dir;
	if (document.startViewTransition && !reduceMotion()) return document.startViewTransition(update);
	update();
	const v = $("#view");
	v.classList.remove("enter"); void v.offsetWidth; v.classList.add("enter");
}

function go(view, from) {
	// Un solo elemento por página puede llevar el nombre de la foto que "viaja"
	if (from) {
		$$("#view [style*='hero-bottle']").forEach((el) => { el.style.viewTransitionName = "none"; });
		from.style.viewTransitionName = "hero-bottle";
	}
	S.stack.push({ view: S.view, f: { ...S.f }, limit: S.limit, scroll: scrollY });
	transition(() => {
		S.view = view;
		render();
		scrollTo(0, 0);
	});
}

function back() {
	const prev = S.stack.pop() || { view: { name: "home" }, f: { ...EMPTY_F }, limit: PAGE, scroll: 0 };
	transition(() => {
		S.view = prev.view;
		S.f = prev.f;
		S.limit = prev.limit;
		S.qty = 1;
		render();
		scrollTo(0, prev.scroll);
	}, "back");
}

function openProduct(id, el) {
	S.focusId = id;
	S.qty = 1;
	const holder = el && (el.closest(".card") || el.closest(".rack-item"));
	go({ name: "product", id }, holder ? $(".pwrap", holder) : null);
}

function openCatalog(patch) {
	closeAll();
	S.f = { ...EMPTY_F, q: $("#q").value.trim(), ...patch };
	S.limit = PAGE;
	go({ name: "catalog" });
}

// ---------- Carrito ----------

const cartTotal = () => S.cart.reduce((t, i) => t + i.qty * byId(i.id).price, 0);
const cartCount = () => S.cart.reduce((t, i) => t + i.qty, 0);

function addToCart(id, qty = 1, obs = "") {
	const key = id + "|" + obs;
	const line = S.cart.find((i) => i.key === key);
	if (line) line.qty += qty;
	else S.cart.push({ key, id, qty, obs });
	saveCart();
	toast(`Agregaste ${byId(id).name}`);
}

function saveCart() {
	store("cart", S.cart);
	const n = cartCount();
	$("#cart-count").textContent = n;
	$("#cart-btn").classList.toggle("has", n > 0);
	$("#cart-btn").setAttribute("aria-label", `Ver mi pedido (${n})`);
	if (!$("#drawer").hidden) drawDrawer();
}

function bumpCart() {
	const b = $("#cart-btn");
	b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
}

// Nube del color del perfume que vuela de la foto al carrito
function puff(fromEl, color) {
	if (!fromEl || reduceMotion()) { bumpCart(); return; }
	const a = fromEl.getBoundingClientRect(), b = $("#cart-btn").getBoundingClientRect();
	const x0 = a.left + a.width / 2, y0 = a.top + a.height * 0.4;
	const x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
	for (let i = 0; i < 14; i++) {
		const d = document.createElement("span");
		d.className = "puff";
		d.style.setProperty("--c", color || NEUTRAL);
		d.style.left = x0 + "px"; d.style.top = y0 + "px";
		document.body.appendChild(d);
		const sx = (Math.random() - 0.5) * 120, sy = -40 - Math.random() * 90;
		d.animate([
			{ transform: "translate(-50%,-50%) scale(.2)", opacity: 0 },
			{ transform: `translate(calc(-50% + ${sx}px), calc(-50% + ${sy}px)) scale(1)`, opacity: 0.9, offset: 0.35 },
			{ transform: `translate(calc(-50% + ${x1 - x0}px), calc(-50% + ${y1 - y0}px)) scale(.3)`, opacity: 0.2 },
		], { duration: 800 + Math.random() * 300, delay: i * 18, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => d.remove();
	}
	setTimeout(bumpCart, 850);
}

function drawDrawer() {
	const total = cartTotal();
	const missing = Math.max(0, STORE.minOrder - total);
	const pct = Math.min(100, (total / STORE.minOrder) * 100);
	const body = $("#drawer-body");
	if (!S.cart.length) {
		body.innerHTML = `<div class="d-empty"><p>Todavía no agregaste nada.</p>
			<button class="btn" data-catalog>Ver los perfumes</button></div>`;
	} else {
		const inCart = new Set(S.cart.map((i) => i.id));
		const ideas = FEATURED.map(byId).concat(PRODUCTS.filter((p) => p.ml === 5))
			.filter((p, i, a) => !p.out && !inCart.has(p.id) && p.ml === 5 && a.indexOf(p) === i).slice(0, 3);
		body.innerHTML = `<ul class="lines">${S.cart.map((i) => {
			const p = byId(i.id);
			return `<li class="line" data-tint="${p.id}" style="${tintStyle(p.id)}">
				<span class="line-art pwrap">${photo(p)}</span>
				<span class="line-info">
					<b>${esc(p.name)}</b>
					<span>${esc([p.brand, sizeLabel(p)].filter(Boolean).join(" · ") || CAT[p.cat].short)}</span>
					${i.obs ? `<em>“${esc(i.obs)}”</em>` : ""}
					<span class="qty sm">
						<button data-cq="${esc(i.key)}" data-d="-1" aria-label="Uno menos">−</button>
						<output>${i.qty}</output>
						<button data-cq="${esc(i.key)}" data-d="1" aria-label="Uno más">+</button>
					</span>
				</span>
				<span class="line-end"><b>${money(p.price * i.qty)}</b><button class="link" data-rm="${esc(i.key)}">Quitar</button></span>
			</li>`;
		}).join("")}</ul>
		${missing && ideas.length ? `<div class="ideas"><p>Sumá un decant para llegar al mínimo:</p>
			${ideas.map((p) => `<button class="idea" data-quick="${p.id}" data-tint="${p.id}" style="${tintStyle(p.id)}">
				<span class="pwrap">${photo(p)}</span><b>${esc(p.name)}</b><em>${money(p.price)}</em></button>`).join("")}
		</div>` : ""}`;
	}
	$("#drawer-foot").innerHTML = S.cart.length ? `
		<div class="progress" style="--pct:${pct}%"><i></i></div>
		<p class="progress-txt">${missing ? `Te faltan <b>${money(missing)}</b> para el mínimo de ${money(STORE.minOrder)}.` : "Llegaste al mínimo. ¡Ya podés hacer el pedido!"}</p>
		<p class="total"><span>Total</span><b>${money(total)}</b></p>
		<button class="btn wide" data-checkout${missing ? " disabled" : ""}>Continuar con el pedido</button>` : "";
	tintExisting();
}

let lastFocus = null;
function openPanel(sel, wide = false) {
	lastFocus = document.activeElement;
	const el = $(sel);
	$(".sheet", el)?.classList.toggle("wide", wide);
	el.hidden = false;
	requestAnimationFrame(() => el.classList.add("open"));
	setTimeout(() => $("[data-close]:not(.scrim)", el)?.focus(), 50);
}
function closePanel(el) {
	if (!el || el.hidden) return;
	el.classList.remove("open");
	setTimeout(() => { el.hidden = true; }, reduceMotion() ? 0 : 320);
	lastFocus?.focus?.({ preventScroll: true });
}
const closeAll = () => $$(".drawer, .modal").forEach(closePanel);
function openDrawer() { drawDrawer(); openPanel("#drawer"); }

// ---------- Pedido por WhatsApp ----------

function checkoutForm() {
	const d = store("buyer") || {};
	const ship = ["envio", ...STORE.meet.map((m) => m[0])].includes(d.ship) ? d.ship : STORE.meet[0][0];
	$("#modal-body").innerHTML = `<h2 id="modal-title">Tus datos</h2>
		<p class="muted">Con estos datos armamos tu pedido para mandarlo por WhatsApp.</p>
		<form id="checkout" class="form" novalidate>
			<label for="f-name">Nombre</label>
			<input id="f-name" name="name" autocomplete="name" required value="${esc(d.name || "")}">
			<fieldset><legend>Entrega</legend>
				${STORE.meet.map(([v, n, where], i) => `<label class="opt"><input type="radio" name="ship" value="${v}" ${ship === v ? "checked" : ""}> <span>${n}<small>${where}</small></span></label>`).join("")}
				<label class="opt"><input type="radio" name="ship" value="envio" ${ship === "envio" ? "checked" : ""}> ${STORE.ship}</label>
			</fieldset>
			<div id="addr-wrap"${ship === "envio" ? "" : " hidden"}>
				<label for="f-addr">Localidad y código postal</label>
				<input id="f-addr" name="addr" autocomplete="postal-code" value="${esc(d.addr || "")}">
			</div>
			<fieldset><legend>Pago</legend>
				<label class="opt"><input type="radio" name="pay" value="Transferencia" ${d.pay !== "Efectivo" ? "checked" : ""}> Transferencia</label>
				<label class="opt"><input type="radio" name="pay" value="Efectivo" ${d.pay === "Efectivo" ? "checked" : ""}> Efectivo</label>
			</fieldset>
			<p class="form-err" id="form-err" role="alert"></p>
			<button class="btn wide" type="submit">Ver el mensaje</button>
		</form>`;
}

function orderMessage(d) {
	const lines = S.cart.map((i) => {
		const p = byId(i.id);
		return `• ${i.qty} × ${p.raw}: ${money(p.price * i.qty)}` + (i.obs ? `\n   Obs: ${i.obs}` : "");
	});
	return [
		"¡Hola! Quiero hacer este pedido:", "", ...lines, "",
		`Total: ${money(cartTotal())}`,
		`Nombre: ${d.name}`,
		`Entrega: ${d.ship === "envio" ? `${STORE.ship} (${d.addr})` : (() => { const m = STORE.meet.find(([v]) => v === d.ship) || STORE.meet[0]; return `${m[1]} (${m[2]})`; })()}`,
		`Pago: ${d.pay}`,
	].join("\n").trim();
}

function showMessage(d) {
	$("#modal-body").innerHTML = `<h2 id="modal-title">Tu mensaje</h2>
		<p class="muted">Así le llega el pedido a Huelepectacular por WhatsApp (${STORE.whatsapp}).</p>
		<pre class="msg" id="msg">${esc(orderMessage(d))}</pre>
		<div class="msg-actions">
			<button class="btn ghost" data-edit>Editar datos</button>
			<button class="btn ghost" data-copy-msg>Copiar mensaje</button>
			<button class="btn" data-wa>Enviar por WhatsApp</button>
		</div>`;
}

function openCheckout() {
	closePanel($("#drawer"));
	checkoutForm();
	setTimeout(() => openPanel("#modal"), 120);
}

function openInfo() {
	$("#modal-body").innerHTML = `<h2 id="modal-title">Huelepectacular</h2>
		<dl class="info">
			<div><dt>WhatsApp</dt><dd><span class="sel">${STORE.whatsapp}</span> <button class="link" data-copy="${STORE.whatsapp}">Copiar</button></dd></div>
			<div><dt>Entregas</dt><dd>${STORE.meet.map(([, n, where]) => `${n.replace("Encuentro en ", "")} <small class="muted">(${where})</small>`).join("<br>")}<br>${STORE.ship}</dd></div>
			<div><dt>Atención</dt><dd>${STORE.notice}</dd></div>
			<div><dt>Pedido mínimo</dt><dd>${money(STORE.minOrder)}</dd></div>
			<div><dt>Redes</dt><dd><a href="${STORE.instagram}" target="_blank" rel="noopener">Instagram</a> · <a href="${STORE.youtube}" target="_blank" rel="noopener">YouTube</a></dd></div>
		</dl>
		<p class="info-more"><button class="link" data-jump="preguntas">Preguntas frecuentes</button></p>`;
	openPanel("#modal");
}

function openIndexSheet() {
	$("#modal-body").innerHTML = `<h2 id="modal-title">Categorías</h2><nav class="idx idx-sheet">${indexNav()}</nav>`;
	openPanel("#modal");
}

// ---------- Avisos y copiar ----------

let toastT = 0;
function toast(text) {
	const t = $("#toast");
	t.textContent = text;
	t.classList.add("show");
	clearTimeout(toastT);
	toastT = setTimeout(() => t.classList.remove("show"), 2200);
}

function copy(text, el) {
	const fallback = () => {
		if (!el) return;
		const r = document.createRange(); r.selectNodeContents(el);
		const s = getSelection(); s.removeAllRanges(); s.addRange(r);
		toast("Seleccionado: copialo con Ctrl+C");
	};
	try { navigator.clipboard.writeText(text).then(() => toast("Copiado"), fallback); } catch (e) { fallback(); }
}

// ---------- Quién soy y preguntas frecuentes (secciones de la portada) ----------

function jumpTo(id) {
	closeAll();
	const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
	if (S.view.name === "home") return scroll();
	$("#q").value = "";
	S.stack = [];
	S.f = { ...EMPTY_F };
	go({ name: "home" });
	setTimeout(scroll, 500);
}

// ---------- Estilos, acordes y notas ----------

// Tocar un estilo, un acorde o una nota lleva a todos los perfumes que lo tienen.
// Entre estilos (los botones de arriba de esa página) se cambia sin sumar un paso al "Volver".
function openTrait(ds) {
	const patch = ds.mood ? { mood: ds.mood } : ds.accord ? { accord: ds.accord } : { note: ds.note };
	$("#q").value = "";
	if (S.view.name === "catalog" && S.f.mood && ds.mood) {
		S.f = { ...EMPTY_F, ...patch };
		return transition(render);
	}
	openCatalog({ ...patch, q: "" });
}

// ---------- Compartir ----------

// En el celular abre el menú de compartir del teléfono (WhatsApp, Instagram y lo que tenga instalado);
// en la compu, o si el teléfono no lo permite, una hoja con las redes y el link para copiar.
async function sharePage() {
	const d = shareData();
	if (navigator.share && matchMedia("(pointer: coarse)").matches) {
		try { await navigator.share(d); return; } catch (e) { if (e.name === "AbortError") return; }
	}
	openShareSheet(d);
}

const SH_ICONS = {
	whatsapp: `<svg viewBox="0 0 24 24"><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.2 7.8c.3 0 .5.1.6.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.6 0 1-.9 1.8-1.9 1.8-3.3-.3-6.5-3.4-6.8-6.8 0-1 .8-1.9 1.9-1.9z" fill="currentColor"/></svg>`,
	facebook: `<svg viewBox="0 0 24 24"><path d="M13.4 20v-6.8h2.3l.35-2.7H13.4V8.8c0-.8.2-1.3 1.3-1.3h1.4V5.1c-.25 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2H8.4v2.7h2.3V20z" fill="currentColor"/></svg>`,
	x: `<svg viewBox="0 0 24 24"><path d="M4.8 4.8h3.8l10.6 14.4h-3.8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M18.6 4.8l-5.5 6.1M5.4 19.2l5.5-6.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
	telegram: `<svg viewBox="0 0 24 24"><path d="M20.4 4.6 3.6 11.1c-.8.3-.8 1.4 0 1.7l4.1 1.4 1.6 5c.2.6 1 .8 1.4.3l2.3-2.4 4.2 3.1c.6.4 1.3.1 1.5-.6l2.8-13.6c.2-.9-.6-1.6-1.4-1.4z" fill="currentColor"/><path d="M7.9 14.1 17 8.2l-6.6 6.5-.4 3.6" fill="none" stroke="#2aabee" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
	mail: `<svg viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
	link: `<svg viewBox="0 0 24 24"><path d="M10.2 13.8a3.6 3.6 0 0 0 5.1 0l3-3a3.6 3.6 0 0 0-5.1-5.1l-1 1M13.8 10.2a3.6 3.6 0 0 0-5.1 0l-3 3a3.6 3.6 0 0 0 5.1 5.1l1-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
};

function openShareSheet(d) {
	const u = encodeURIComponent(d.url), tx = encodeURIComponent(d.text);
	const nets = [
		["WhatsApp", "#25d366", `https://wa.me/?text=${encodeURIComponent(d.text + " " + d.url)}`, SH_ICONS.whatsapp],
		["Facebook", "#1877f2", `https://www.facebook.com/sharer/sharer.php?u=${u}`, SH_ICONS.facebook],
		["X", "#000", `https://x.com/intent/tweet?text=${tx}&url=${u}`, SH_ICONS.x],
		["Telegram", "#2aabee", `https://t.me/share/url?url=${u}&text=${tx}`, SH_ICONS.telegram],
		["Mail", "", `mailto:?subject=${encodeURIComponent(d.title)}&body=${encodeURIComponent(d.text + "\n" + d.url)}`, SH_ICONS.mail],
	];
	const p = S.view.name === "product" ? byId(S.view.id) : null;
	$("#modal-body").innerHTML = `<h2 id="modal-title">Compartir</h2>
		${p ? `<div class="sh-what" style="${tintStyle(p.id)}"><div class="pwrap">${photo(p, false)}</div>
			<p><b>${esc(p.name)}</b><span>${esc([p.brand, sizeLabel(p), money(p.price)].filter(Boolean).join(" · "))}</span></p></div>`
		: `<p class="sh-what"><b>${esc(d.title.split(" · ")[0])}</b></p>`}
		<div class="sh-grid">
			${nets.map(([n, c, href, ic]) => `<a class="sh" href="${href}" target="_blank" rel="noopener"${c ? ` style="--c:${c}"` : ""}><i>${ic}</i><span>${n}</span></a>`).join("")}
			<button class="sh" data-copy-link="${esc(d.url)}"><i>${SH_ICONS.link}</i><span>Copiar link</span></button>
		</div>
		<div class="sh-link"><span class="sel">${esc(d.url)}</span><button class="link" data-copy="${esc(d.url)}">Copiar</button></div>`;
	openPanel("#modal");
}

// Si se entra por la dirección de una página (huele.com.ar/perfume/..., /estilo/..., /nota/...), se abre ahí mismo
function openFromLink() {
	const path = location.hash.startsWith("#/") ? location.hash.slice(1) : location.pathname;
	const q = new URLSearchParams(location.search).get("q");
	if (/^\/buscar\/?$/.test(path) && q) { S.f = { ...EMPTY_F, q }; $("#q").value = q; S.view = { name: "catalog" }; return; }
	const m = path.match(/^\/(perfume|categoria|estilo|acorde|nota)\/([^/?#]+)/);
	if (!m) return;
	const [, kind, s] = m;
	if (kind === "perfume") {
		const p = PRODUCTS.find((x) => x.slug === s);
		if (p) { S.view = { name: "product", id: p.id }; S.focusId = p.id; }
		return;
	}
	const find = (names) => [...new Set(names)].find((x) => slug(x) === s);
	const v = kind === "categoria" ? CATS.find((c) => c.slug === s)?.id
		: kind === "estilo" ? find(PRODUCTS.flatMap((p) => p.moods))
		: kind === "acorde" ? find(PRODUCTS.flatMap((p) => (p.accords || []).map((a) => a[0])))
		: find(PRODUCTS.flatMap(allNotes));
	if (v) { S.f = { ...EMPTY_F, [{ categoria: "cat", estilo: "mood", acorde: "accord", nota: "note" }[kind]]: v }; S.view = { name: "catalog" }; }
}

// ---------- Variante ----------

function setVariant(v, animate = true) {
	const apply = () => {
		S.variant = v;
		document.documentElement.dataset.variant = v;
		$$("#switcher button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.variant === v));
		store("variant", v);
		render();
	};
	if (animate) transition(apply, "design"); else apply();
}

// ---------- Eventos ----------

document.addEventListener("click", (e) => {
	const t = e.target.closest("button, a");
	if (!t) return;
	const ds = t.dataset;
	if (ds.close !== undefined) return closePanel(t.closest(".drawer, .modal"));
	if (ds.open) { closeAll(); return openProduct(ds.open, t); }
	if (ds.quick) {
		const p = byId(ds.quick);
		addToCart(p.id);
		return puff((t.closest(".card, .idea") && $(".pwrap", t.closest(".card, .idea"))) || t, TINT.get(p.id));
	}
	if (ds.cat) return openCatalog({ cat: ds.cat });
	if (ds.group) return openCatalog({ group: ds.group });
	if (ds.jump) return jumpTo(ds.jump);
	if (ds.mood || ds.accord || ds.note) return openTrait(ds);
	if (ds.share !== undefined) return sharePage();
	if (ds.copyLink) return copy(ds.copyLink, $(".sh-link .sel"));
	if (t.matches("a.sh")) return closePanel(t.closest(".modal"));
	if (ds.catalog !== undefined) return openCatalog({});
	if (ds.back !== undefined) return back();
	if (ds.go === "home") { closeAll(); $("#q").value = ""; S.stack = []; S.f = { ...EMPTY_F }; return go({ name: "home" }); }
	if (ds.index !== undefined) return openIndexSheet();
	if (ds.brand !== undefined) { S.f.brand = S.f.brand === ds.brand ? "" : ds.brand; S.limit = PAGE; return refreshCatalog(); }
	if (ds.fcat !== undefined) { S.f.cat = ds.fcat; S.f.brand = ""; S.limit = PAGE; return refreshCatalog(); }
	if (ds.more !== undefined) { S.limit += PAGE; $("#cat-body").innerHTML = catBody(); return tintExisting(); }
	if (ds.clear !== undefined) { S.f = { ...EMPTY_F }; $("#q").value = ""; S.limit = PAGE; return transition(render); }
	if (ds.qty) { S.qty = Math.max(1, Math.min(20, S.qty + +ds.qty)); return updatePrice(); }
	if (t.id === "add") {
		const p = byId(S.view.id);
		addToCart(p.id, S.qty);
		puff($("#pdp-photo"), TINT.get(p.id));
		S.qty = 1;
		return updatePrice();
	}
	if (t.id === "cart-btn") return openDrawer();
	if (t.id === "info-btn") return openInfo();
	if (ds.cq) {
		const line = S.cart.find((i) => i.key === ds.cq);
		line.qty += +ds.d;
		if (line.qty < 1) S.cart = S.cart.filter((i) => i !== line);
		return saveCart();
	}
	if (ds.rm) { S.cart = S.cart.filter((i) => i.key !== ds.rm); return saveCart(); }
	if (ds.checkout !== undefined) return openCheckout();
	if (ds.edit !== undefined) return checkoutForm();
	if (ds.copyMsg !== undefined) return copy($("#msg").textContent, $("#msg"));
	// Versión de muestra: no manda pedidos al WhatsApp real de la tienda
	if (ds.wa !== undefined) return toast("Versión de muestra: el pedido no se envía");
	if (ds.copy) return copy(ds.copy, t.previousElementSibling);
	if (ds.variant) return setVariant(ds.variant);
	if (t.id === "announce-x") { $("#announce").hidden = true; store("announce", "x"); }
});

document.addEventListener("input", (e) => {
	if (e.target.id === "q") {
		clearTimeout(S.qT);
		S.qT = setTimeout(() => {
			const q = e.target.value.trim();
			if (S.view.name !== "catalog") { if (q) openCatalog({ q }); return; }
			S.f.q = q; S.limit = PAGE;
			const h = $(".cat-head h1");
			if (h && q) h.textContent = `Resultados para “${q}”`;
			refreshCatalog();
		}, 220);
	}
});

document.addEventListener("change", (e) => {
	if (e.target.id === "sort") { S.f.sort = e.target.value; refreshCatalog(); }
	if (e.target.id === "hide-out") { S.f.hideOut = e.target.checked; S.limit = PAGE; refreshCatalog(); }
	if (e.target.name === "ship") $("#addr-wrap").hidden = e.target.value !== "envio";
});

document.addEventListener("submit", (e) => {
	if (e.target.id !== "checkout") return;
	e.preventDefault();
	const d = Object.fromEntries(new FormData(e.target).entries());
	const err = !d.name.trim() ? "Escribí tu nombre." : d.ship === "envio" && !d.addr.trim() ? "Escribí tu localidad y código postal para el envío." : "";
	if (err) { $("#form-err").textContent = err; return; }
	store("buyer", d);
	showMessage(d);
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") closePanel($(".modal:not([hidden]), .drawer:not([hidden])"));
});

// ---------- Inicio ----------

$("#rail").innerHTML = railNav();
if (store("announce") === "x") $("#announce").hidden = true;
saveCart();
openFromLink();
// Elegida: B1 Estantería (las otras variantes quedan en el código y en el historial del link)
setVariant("b1", false);

// Cuándo se copiaron de Pedix los precios y el stock (lo escribe la sincronización en catalog.js)
if (typeof SYNCED_AT !== "undefined") {
	const d = new Date(SYNCED_AT);
	$("#foot-sync").textContent = `Precios y stock actualizados el ${d.toLocaleDateString("es-AR", { day: "numeric", month: "numeric" })} a las ${d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" })}.`;
}
