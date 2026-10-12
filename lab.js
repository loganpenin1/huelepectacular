// ================================ EXPERIMENTAL ================================
// Funciones en prueba. Para sacarlas de la tienda, borrar las dos líneas de
// lab.css y lab.js en index.html: nada del resto depende de este archivo.
// Solo llena los huecos que dejan las pantallas ("home", "card", "catHead", "pdpPrice", "pdpAfter").
// ==============================================================================

(function () {
	const root = document.documentElement;
	const labStore = (k, v) => store("lab:" + k, v);
	root.dataset.lab = "on";

	// El kit de decants queda guardado pero oculto, por si se retoma
	const KIT_ENABLED = false;

	const CHANNEL = "https://www.youtube.com/@huelepectacular4212";
	const yt = (id) => `https://www.youtube.com/watch?v=${id}`;
	const ytSearch = (q) => `${CHANNEL}/search?query=${encodeURIComponent(q)}`;
	const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
	const add = (name, fn) => (LAB.slots[name] ||= []).push(fn);
	// Se busca en el nombre sin el "(Inspirado en ...)", que nombra a otro perfume
	const bare = (p) => norm(p.raw.replace(/\(.*?\)/g, " "));
	const has = (p, k) => k.startsWith("=") ? p.key === k.slice(1) : bare(p).includes(k);

	// ---------------- Videos del canal de YouTube ----------------

	// Videos sobre un perfume puntual y palabras para encontrarlo en el catálogo
	const REVIEWS = [
		["1HulkA8zHpU", "Lanzó mi NUEVO PERFUME… y es UNA LOCURA | BLACK POISON TWIST", ["black poison twist"]],
		["uFdyT0D_A0o", "MIS PERFUMES: Black Poison y You Are Mine", ["black poison", "you are mine"]],
		["UCyLUUSp1EM", "In Your Prime, mi NUEVO PERFUME!! MODO BESTIA", ["in your prime", "inyour prime"]],
		["EKEOzQ6yEOg", "Creed Carmina VS Sexy Fever de HUELEPECTACULAR", ["sexy fever", "carmina"]],
		["-M4q-Uj3gGA", "El clon contra la leyenda: Rayhaan Obsidian", ["obsidian"]],
		["ilZF-ClwxOo", "Le Male Elixir ABSOLU de Jean Paul Gaultier, RESEÑA COMPLETA", ["le male elixir absolu"]],
		["ju-RDbZE5Mg", "One Million ROYAL y Jean Paul Gaultier Le Male ELIXIR. RESEÑA COMPLETA.", ["le male elixir"]],
		["_VQXvcRSGJQ", "Los 3 Perfumes KHAMRAH: Original, QAHWA y Dukhan", ["khamrah", "khamrha"]],
		["94l-qig0XuE", "¿Lattafa la rompió o la arruinó? | Khamrah Waha", ["khamrah waha", "khamrha waha"]],
		["XLGCXhxmdYU", "ASAD de Lattafa vs SALVO ELIXIR de Maison Alhambra", ["asad", "salvo elixir"]],
		["HjNheFd1_mg", "Asad BOURBON, reseña COMPLETA", ["asad bourbon"]],
		["SwhTXvi1xbw", "Asad ELIXIR de Lattafa ¿Clon de Bottled Absolu / Natura Humor Estelar?", ["asad elixir"]],
		["-U7U_OBYLnw", "ULTRA MALE de Jean Paul Gaultier vs 9PM de Afnan", ["ultra male", "9pm"]],
		["NNZ_TvuwLGU", "Perfume 9pm ELIXIR de Afnan", ["9pm elixir"]],
		["FINGlYaRJW0", "PROBÉ EL NUEVO CLUB DE NUIT ÉLITE… OJO CON ESTE ARMAF", ["club de nuit elite"]],
		["gT8rpvHFo8o", "RESEÑA del perfume CLUB DE NUIT INTENSE Man", ["club de nuit intense man"]],
		["1dKTXGue4S8", "Perfumes Club de Nuit Intense WOMAN y YARA EDP de Lattafa", ["club de nuit woman intense", "club de nuit intense woman", "=yara", "=yara edp"]],
		["J8Vq7Ip8xMI", "LA GUERRA DE LOS CLONES DE NAXOS", ["naxos"]],
		["EFtUQnMPFxk", "ITALIA Pour Homme de RAYHAAN, clon de NAXOS", ["italia pour homme", "rayhaan italia"]],
		["mEBrhOfKFLE", "Hawas Black vs Hacivat... ¿quién gana?", ["hawas black", "hacivat"]],
		["XvXJfvYMDZ8", "We Are Tribe Elixir ES CLON de Stronger With You Amber", ["we are tribe"]],
		["vY3Rzn6AC98", "Perfume The Kingdom de Lattafa vs Jean Paul Gaultier Le Male ELIXIR", []],
		["zYousdbGLsE", "9pm Night Out vs Azzaro Forever Wanted Elixir", []],
	];

	// Encontrados buscando en el canal el nombre de cada perfume del catálogo: [nombre, marca, videos]
	const CHANNEL_MATCHES = [
		["london", "Lattafa", [["Tr11wIQ0iyk", "LONDON DE LATTAFA NO ESPERABA QUE OLIERA ASÍ"]]],
		["atlas glacial valley", "", [["dWRPpiK_lBM", "¿LATTAFA CLONÓ A SUMMER HAMMER? ATLAS GLACIAL VALLEY ME SORPRENDIÓ"], ["__upN1fwflQ", "NUEVOS LATTAFA ATLAS: ¿GLACIAL VALLEY O CANYON? ¿CUÁL ES MEJOR?"]]],
		["salvo elixir", "Maison Alhambra", [["XLGCXhxmdYU", "ASAD de Lattafa vs SALVO ELIXIR de Maison Alhambra"]]],
		["le male elixir", "Jean Paul Gaultier", [["vY3Rzn6AC98", "Perfume The Kingdom de Lattafa vs Jean Paul Gaultier Le Male ELIXIR"], ["ju-RDbZE5Mg", "One Million ROYAL y Jean Paul Gaultier Le Male ELIXIR. RESEÑA COMPLETA."]]],
		["yara edp", "Lattafa", [["1dKTXGue4S8", "Perfumes Club de Nuit Intense WOMAN y YARA EDP de Lattafa"]]],
		["your touch intense", "", [["3i1gLPNDYaU", "YOUR TOUCH INTENSE de Maison Alhambra"]]],
		["asad elixir", "Lattafa", [["SwhTXvi1xbw", "Asad ELIXIR de Lattafa ¿Clon de Bottled Absolu / Natura Humor Estelar?"], ["WGMIXCFDKXE", "ASAD ELIXIR Unboxing (¿Parecido a Humor Estelar de Natura?)"]]],
		["musamam black intense", "Lattafa", [["hZvkkYiK6OQ", "Musamam Black Intense"]]],
		["scandal absolu", "Jean Paul Gaultier", [["joCmBpsgguY", "CHECKMATE KING de Armaf vs SCANDAL ABSOLU"]]],
		["brave", "Bensimon", [["nNTPJwI6g7U", "Club de Nuit Man URBAN ELIXIR y Bensimon BRAVE, RESEÑA COMPLETA"], ["6txUWRrEry8", "Perfume Bensimon Brave Intense"]]],
		["ultra male", "Jean Paul Gaultier", [["-U7U_OBYLnw", "ULTRA MALE de Jean Paul Gaultier vs 9PM de Afnan"]]],
		["firestorm", "French Avenue", [["tUzAWJhUKR4", "Perfume Firestorm de French Avenue"]]],
		["thunder", "French Avenue", [["UUOK--IcgLw", "Perfume THUNDER de French Avenue"]]],
		["azzure aoud", "French Avenue", [["ohU8ZT7Ymp8", "Azzure Aoud un ESPANTO"]]],
		["liquid brun", "French Avenue", [["B0Z1IsW7ch0", "LIQUID BRUN: perfume árabe ideal para OTOÑO"]]],
		["man in black", "Town Scent", [["MnQ-ghUd4z8", "Perfume Man In Black de Town Scent y sus comparativas con el original"]]],
		["le male", "Jean Paul Gaultier", [["mDYMFjR904w", "Perfume LE MALE Jean Paul Gaultier: RENDIMIENTO 2023 y 2 alternativas ECONÓMICAS"], ["p5gHG-BRaiA", "Le Male Le Parfum vs Urban Man Le Parfum de Fragrance World"]]],
		["glacier pour homme", "Maison Alhambra", [["-BnTK5yKIdo", "UNBOXING ÁRABES con mi amigo Martín: Bavaria Man Intense, Glacier Bold y Glacier Pour Homme"]]],
		["cedrus blanc", "Rayhaan", [["z6t734kl1jA", "ESTE PERFUME ES UNA LOCURA | Cedrus Blanc de Rayhaan"]]],
		["amazonica", "Rayhaan", [["R9WRr4Ric0s", "AMAZONICA de RAYHAAN: ¿Más de lo mismo?"]]],
		["aquatica", "Rayhaan", [["aKbM-anaTDs", "Rayhaan AQUÁTICA"]]],
		["wolf", "Rayhaan", [["cPNY2ogl1gQ", "Probé Wolf de Rayhaan: ¿puro hype?"]]],
		["nocturno elixir", "Rayhaan", [["BgZBcL0THu0", "Rayhaan NOCTURNO ELIXIR: ¿BESTIA O PURO HUMO?"]]],
		["jorge di profumo", "", [["sct5pWwPG8o", "Jorge Di Profumo de Maison Alhambra: LÍNEA COMPLETA"], ["tPzprO5pJ5Y", "Perfume Jorge Di Profumo AQUA, UNBOXING"]]],
		["moondrift blue intense", "Maison Alhambra", [["5dfDArE8JZI", "Moondrift Blue Intense de Maison Alhambra: perfume NUEVO vs AROMATIX"]]],
		["toro pour homme", "", [["48HZgh1u4t8", "Toro Pour Homme y Toro Glace de Maison Alhambra"]]],
		["infini musk", "Maison Alhambra", [["h15JycOuQHU", "El perfume árabe ideal para verano: INFINI Musk de Maison Alhambra"]]],
		["island", "Khadlaj", [["DImUSCzTI0w", "Island Khadlaj vs Le Beau Le Parfum"]]],
		["le beau le parfum", "Jean Paul Gaultier", [["DImUSCzTI0w", "Island Khadlaj vs Le Beau Le Parfum"], ["i1Tx52WOPac", "Hawas Malibú vs Le Beau Le Parfum"]]],
		["hawas chrome", "Rasasi", [["9F752qjX9Mk", "HAWAS CHROME: MODO BESTIA ACTIVADO"]]],
		["mysterium", "Paris Corner", [["mCTFCKWdz7M", "MYSTERIUM DE PARIS CORNER: ¿EL MEJOR CLON QUE NADIE ESTÁ MIRANDO?"]]],
		["seduction x", "Antonio Banderas", [["99zmA5H1qYc", "Compré Seduction X de Banderas… ¿tiré la plata?"], ["VfITEYUaCBQ", "Seduction X de Antonio Banderas vs Bad Boy Cobalt Elixir"]]],
		["scandal edt", "Jean Paul Gaultier", [["zl7LC-vwZVM", "Perfume Scandal EDT vs LE PARFUM vs ABSOLU"]]],
		["king edp", "Bharara", [["W5SKyuaqoyU", "Erba Pura vs Amber Oud Gold Edition vs Bharara King EDP"]]],
		["erba pura", "Xerjoff", [["W5SKyuaqoyU", "Erba Pura vs Amber Oud Gold Edition vs Bharara King EDP"]]],
		["the jewel of ocean", "Anfar", [["_UwTAGE_ipU", "El mejor perfume Anfar: The Jewel of Ocean"]]],
		["your touch amber", "Maison Alhambra", [["sv7SCL2OkYI", "Stronger With You AMBER vs Your Touch AMBER de Maison Alhambra"]]],
		["le male elixir absolu", "Jean Paul Gaultier", [["ilZF-ClwxOo", "Le Male Elixir ABSOLU de Jean Paul Gaultier, RESEÑA COMPLETA"], ["i5v5qz9dV3w", "Le Male Elixir ABSOLU UNBOXING"]]],
		["le beau", "Jean Paul Gaultier", [["K64K1aZfnVg", "Jean Paul Gaultier Le Beau EDT vs LE PARFUM"]]],
		["paradise garden", "Jean Paul Gaultier", [["OXr_iA7rqck", "UNBOXING: Phantom Intense, Bad Boy Cobalt Elixir, Le Beau Paradise Garden y Black Origami"]]],
		["boos intense", "", [["B4_9C3bLwJU", "RESEÑA del perfume BOOS INTENSE"], ["TYihm9wYwk0", "BOOS INTENSE DOUBLE: ¿BESTIA O PURO HUMO?"]]],
		["bold insignia", "Bensimon", [["WJt3S6umrHI", "Bensimon Bold Insignia: ¿vale el hype?"], ["k8s236uiMeQ", "Stronger With You Intensely vs Bensimon Bold INSIGNIA"]]],
		["eros energy", "Versace", [["rV64dxmoN8M", "Versace Eros Energy, primeras impresiones"]]],
		["blue jeans", "Versace", [["rFPWz3sOHrs", "Reseña del perfume Versace BLUE JEANS: rendimiento 2023/2024"]]],
		["homem potence", "Natura", [["3uZnSjtuqKA", "Natura Homem POTENCE: rendimiento 2024 y reseña COMPLETA"], ["6K7F_nJSL-Q", "Barato vs caro: Natura Homem Potence"]]],
		["yd erba pura", "", [["-fH_UMDwsBc", "YD Erba Pura de YVES D'ORGEVAL"], ["my0ahhtvnbw", "Charlamos con Jorge, dueño de Yves d'Orgeval: lanzamiento YD ERBA PURA"]]],
		["sauvage eau forte", "Dior", [["Kmgk2kbNUmg", "Dior Sauvage Eau Forte, la MEJOR RESEÑA"]]],
		["sauvage elixir", "Dior", [["hgDWlLpd-OY", "RESEÑA del perfume SAUVAGE ELIXIR de Christian Dior"]]],
		["homme cologne", "Dior", [["jZgaXQ_Xrac", "Dior Homme Cologne vs Adolfo Domínguez Citrus Cedro"]]],
		["sauvage edt", "Dior", [["ldxeDk3xiDE", "RENDIMIENTO actual 2023: Dior Sauvage EDT"], ["owcgSsJ71zY", "Con Walter: SAUVAGE EDT, EDP y PARFUM, y también Yves d'Orgeval"]]],
		["biografia assinatura", "Natura", [["8exEeAl3vsU", "Reseña del perfume NATURA Biografía ASSINATURA"]]],
		["homem tato", "Natura", [["PWHXW1gIJ9E", "¿Perfume SIMILAR a BVLGARI MAN IN BLACK? Sí: Natura HOMEM TATO"]]],
		["monique black fire", "", [["k2t4m6mmpAw", "MONIQUE BLACK FIRE ROCK, clon de ONE MILLION LUCKY y de TASCANI SINGULAR"]]],
		["bagues santorini", "", [["zoPa8kRyUa0", "Reseñas de Yves d'Orgeval ADVENTURE y Bagues SANTORINI"]]],
		["ombre leather", "Tom Ford", [["s6jVq7mbYU0", "¿Cuál es el MEJOR clon de Tom Ford Ombré Leather?"]]],
		["the secret prive", "Antonio Banderas", [["kzErjzU9RvM", "The Secret Privé de BANDERAS: ¿compra obligada o un clavo?"], ["ODzaeRsAJOw", "¿Puro humo? Antonio Banderas The Secret Privé"]]],
		["bold intense", "Bensimon", [["UV2G8RfBCjY", "Perfume Bensimon BOLD INTENSE, reseña COMPLETA"]]],
		["hydo just different", "", [["MMmHrr-qmMA", "Perfume LOW COST Yves d'Orgeval HYDO Just Different: compra obligada para el VERANO"]]],
		["black sea", "Lorenzo Pazzaglia", [["6FY_zAbbqv4", "Black Sea de Lorenzo Pazzaglia vs Sal"]]],
		["essencial mirra", "Natura", [["HrawETyx9h0", "Reseña del perfume Natura ESSENCIAL MIRRA"]]],
		["kaiak urbe", "Natura", [["u8skWNzw1TY", "Mango Blue Attraction y rendimiento 2023 de Natura Kaiak URBE"], ["TdqKxqV0jc0", "¿Querés un perfume que te sirva PARA TODO? Natura Kaiak Urbe"]]],
		["kaiak aventura", "Natura", [["-JIetvejNjs", "RESEÑA del perfume KAIAK AVENTURA"], ["bjPnC5dRNjo", "El perfume que seguramente usaron en Jurassic Park: Natura KAIAK AVENTURA"]]],
		["essencial oud", "Natura", [["uQUGjszp_7w", "Natura ESSENCIAL OUD: reseña completa + rendimiento 2024"], ["IFHy0KceTA0", "Reseña del perfume Natura Essencial Oud Vainilla"]]],
		["kaiak vital", "Natura", [["1X0XgHM9pIY", "Reseña de Natura KAIAK VITAL: te digo la posta"]]],
		["kaiak ultra", "Natura", [["PYIb6Gi1YQg", "Reseña del perfume Natura Kaiak ULTRA: el perfume mutante"]]],
		["essencial ato", "Natura", [["m_s66jxCvXQ", "Natura Essencial ATO, reseña COMPLETA"]]],
		["essencial sentir", "Natura", [["wQrrEr4SHgU", "Natura Essencial SENTIR"]]],
		["kaiak oceano", "Natura", [["nZ38MwlmILw", "Reseña de Natura Kaiak Oceano"], ["Lnr4FSsMoao", "Natura Kaiak OCEANO: rendimiento 2023 y Millanel Blue"]]],
		["kaiak sonar", "Natura", [["y0s_RDfgi0Q", "Natura Kaiak SONAR, la mejor reseña"], ["0V9Tdj5Zs40", "Natura Kaiak SONAR, unboxing"]]],
		["kaiak aero", "Natura", [["6yxXNckG51c", "RESEÑA de Natura KAIAK AERO: el más barato de Natura"], ["4pT5uIpIprA", "Kaiak AERO vs Kaiak OCEANO, por Felipe"]]],
		["kaiak o2", "Natura", [["8yQmn_hcH-w", "Natura Kaiak O2, RESEÑA COMPLETA"]]],
		["essencial palo santo", "Natura", [["FOf3dILQngI", "Reseña de Natura Essencial PALO SANTO masculino"]]],
		["homem neo", "Natura", [["kRpxy4qlsxA", "Reseña de Natura HOMEM NEO"]]],
		["homem elo", "Natura", [["c4R97RYuvVU", "Natura Homem ELO, reseña COMPLETA"]]],
		["boos elixir", "", [["lqV_-ZjhBno", "Perfumes BOOS Elixir Collection Nro 14 y Nro 21, RESEÑA COMPLETA"]]],
		["boos signature prive", "", [["U-YoTLNdLoI", "Boos Signature Privé For Him, unboxing"]]],
		["wellington polo club", "", [["fatiiQXyCn8", "Perfumes WELLINGTON POLO CLUB: saga completa"]]],
	];
	// Lo que puede venir después del nombre sin que sea otro perfume (concentración o estado del tester)
	const TAIL_OK = /^(edp|edt|parfum|le parfum|extrait|tester|nuevo|sin|caja|tapa|ni|uso|usado|de|\d+|\s)*$/;
	const channelFor = (p) => {
		const hits = CHANNEL_MATCHES.filter(([k, b]) => (!b || p.brand === b) &&
			(p.key === k || (p.key.startsWith(k + " ") && TAIL_OK.test(p.key.slice(k.length + 1).replace(/\s+/g, " ")))))
			.sort((a, b) => b[0].length - a[0].length);
		return hits.length ? hits[0][2] : [];
	};

	const BRAND_VIDEOS = {
		"Lattafa": ["DaeDMxGHqQU", "Los perfumes de Lattafa que NO FALLAN (Top real 2026)"],
		"Paris Corner": ["yVHGVU9QzGo", "TOP PARIS CORNER | Los mejores perfumes de la marca"],
		"Yves d'Orgeval": ["ZGjBM12wt7w", "Los mejores Yves d'Orgeval 2026 | Top definitivo"],
		"Lorenzo Pazzaglia": ["lsWV2UX71rs", "Lorenzo Pazzaglia A PRUEBA con Cami de Perfumeadicta"],
		"Bensimon": ["-E1rLxA1i3Y", "Así se crea un perfume en Bensimon | Entrevista a Carla Fabiani"],
	};
	const DECANT_VIDEO = ["636MD8Q2xPQ", "Cómo decantar perfumes (fácil y sin perder ni una gota)"];

	// Videos de cada producto: primero los del nombre exacto, después los de palabras clave
	const REV = new Map();
	PRODUCTS.forEach((p) => {
		const list = [...channelFor(p)];
		REVIEWS.map(([id, t, ks]) => [id, t, Math.max(0, ...ks.map((k) => (has(p, k) ? k.length : 0)))])
			.filter((r) => r[2] > 0).sort((a, b) => b[2] - a[2])
			.forEach(([id, t]) => { if (!list.some((v) => v[0] === id)) list.push([id, t]); });
		if (list.length) REV.set(p.id, list.slice(0, 2));
	});

	const videoLink = (id, t) => `<a class="lab-video" href="${yt(id)}" target="_blank" rel="noopener">
		<span class="lab-play" aria-hidden="true"></span><span><b>${esc(t)}</b><em>Ver en YouTube</em></span></a>`;

	// ---------------- Parecidos ("¿Qué perfume usás hoy?") ----------------
	// src "canal": el dueño los comparó en un video. src "conocido": parecidos conocidos.
	const SIMILAR = [
		{ q: ["le male elixir", "le male"], like: ["you are mine", "kingdom"], src: "canal", v: "vY3Rzn6AC98" },
		{ q: ["ultra male"], like: ["9pm"], src: "canal", v: "-U7U_OBYLnw" },
		{ q: ["carmina"], like: ["sexy fever"], src: "canal", v: "EKEOzQ6yEOg" },
		{ q: ["naxos"], like: ["italia pour homme", "rayhaan italia"], src: "canal", v: "EFtUQnMPFxk" },
		{ q: ["hacivat"], like: ["hawas black"], src: "canal", v: "mEBrhOfKFLE" },
		{ q: ["stronger with you", "stronger"], like: ["we are tribe", "your touch amber"], src: "canal", v: "XvXJfvYMDZ8" },
		{ q: ["bottled", "boss bottled", "humor estelar"], like: ["asad elixir"], src: "canal", v: "SwhTXvi1xbw" },
		{ q: ["forever wanted", "wanted"], like: ["9pm night out"], src: "canal", v: "zYousdbGLsE" },
		{ q: ["man in black", "bvlgari man"], like: ["man in black", "homem tato"], src: "canal", v: "PWHXW1gIJ9E" },
		{ q: ["summer hammer", "summer hummer"], like: ["atlas glacial valley"], src: "canal", v: "dWRPpiK_lBM" },
		{ q: ["sauvage"], like: ["asad", "salvo"], src: "conocido" },
		{ q: ["aventus"], like: ["club de nuit intense man", "club de nuit intense"], src: "conocido" },
		{ q: ["angels share", "angel share", "kilian"], like: ["khamrah", "khamrha"], src: "conocido" },
		{ q: ["baccarat", "rouge 540", "br540"], like: ["rouge baroque"], src: "conocido" },
		{ q: ["coco mademoiselle", "mademoiselle"], like: ["club de nuit woman"], src: "conocido" },
		{ q: ["y edp", "ysl y"], like: ["fakhar black"], src: "conocido" },
	];
	const SUGGEST = ["Sauvage", "Le Male Elixir", "Aventus", "Ultra Male", "Carmina", "Naxos", "Angels' Share", "Baccarat Rouge 540", "Stronger With You", "Bottled"];
	const videoTitle = (id) => (REVIEWS.find((x) => x[0] === id) || CHANNEL_MATCHES.flatMap((m) => m[2]).find((x) => x[0] === id) || [id, "Comparación en el canal"])[1];

	function findSimilar(raw) {
		const q = norm(raw).replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
		if (q.length < 3) return null;
		const same = PRODUCTS.filter((p) => bare(p).includes(q)).slice(0, 8);
		const inspired = PRODUCTS.filter((p) => p.inspired && norm(p.inspired).includes(q));
		const rules = SIMILAR.filter((s) => s.q.some((a) => q.includes(a) || (q.length >= 4 && a.includes(q))));
		const fromRules = (src) => rules.filter((r) => r.src === src).flatMap((r) => PRODUCTS.filter((p) => r.like.some((k) => has(p, k))));
		const seen = new Set();
		const uniq = (list) => list.filter((p) => !seen.has(p.id) && seen.add(p.id));
		return {
			q: raw.trim(),
			same: uniq(same), inspired: uniq(inspired),
			canal: uniq(fromRules("canal")).slice(0, 8), known: uniq(fromRules("conocido")).slice(0, 8),
			videos: rules.filter((r) => r.v).map((r) => r.v),
		};
	}

	function showSimilar(raw) {
		const r = findSimilar(raw);
		if (!r) return;
		const block = (title, list, extra = "") => list.length ? `<div class="lab-res"><h3>${title}</h3>${extra}<div class="grid">${list.map((p) => card(p)).join("")}</div></div>` : "";
		const total = r.same.length + r.inspired.length + r.canal.length + r.known.length;
		$("#modal-body").innerHTML = `<h2 id="modal-title">Parecidos a “${esc(r.q)}”</h2>
			${block("Lo tenemos", r.same)}
			${block("Inspirados en ese", r.inspired)}
			${block("Comparados en el canal", r.canal, r.videos.length ? `<div class="lab-videos">${r.videos.map((id) => videoLink(id, videoTitle(id))).join("")}</div>` : "")}
			${block("También se parecen", r.known)}
			${total ? "" : "<p>Todavía no tenemos parecidos para ese perfume.</p>"}
			<a class="link" href="${ytSearch(r.q)}" target="_blank" rel="noopener">Buscar “${esc(r.q)}” en el canal de YouTube →</a>`;
		openPanel("#modal", true);
		tintExisting();
	}

	// ---------------- Kit de decants (oculto: KIT_ENABLED) ----------------

	const KIT = labStore("kit") || { size: 0, items: [] };
	if (!KIT_ENABLED) { KIT.size = 0; KIT.items = []; }
	const kitSum = () => KIT.items.reduce((t, id) => t + byId(id).price, 0);

	function drawTray() {
		let tray = $("#lab-tray");
		if (!tray) {
			tray = document.createElement("div");
			tray.id = "lab-tray";
			tray.className = "lab-tray";
			document.body.appendChild(tray);
		}
		const on = KIT_ENABLED && KIT.size > 0;
		tray.hidden = !on;
		document.body.classList.toggle("has-tray", on);
		if (!on) return;
		const n = KIT.size, k = KIT.items.length, sum = kitSum();
		const missing = Math.max(0, STORE.minOrder - sum);
		tray.innerHTML = `<div class="lab-tray-in">
			<div class="lab-tray-txt"><b>Tu kit de ${n} decants</b>
				<span>${k} de ${n} elegidos · ${money(sum)}</span>
				<span class="muted">${k === n ? "¡Kit completo!" : missing ? `Te faltan ${money(missing)} para el mínimo de compra` : "Ya llega al mínimo de compra"}</span>
			</div>
			<div class="lab-slots">${Array.from({ length: n }, (_, i) => {
				const p = KIT.items[i] && byId(KIT.items[i]);
				return p ? `<button class="lab-slot full" data-i="${i}" data-kit-rm="${i}" data-tint="${p.id}" style="${tintStyle(p.id)}" aria-label="Sacar ${esc(p.name)} del kit">
					<span class="pwrap">${photo(p)}</span><i aria-hidden="true">×</i></button>`
					: `<span class="lab-slot" data-i="${i}">${i + 1}</span>`;
			}).join("")}</div>
			<div class="lab-tray-actions">
				<button class="btn" data-kit-cart${k === n ? "" : " disabled"}>Agregar el kit al pedido</button>
				<button class="link" data-kit-cancel>Cancelar el kit</button>
			</div>
		</div>`;
		tray.classList.toggle("done", k === n);
		tintExisting();
	}

	function saveKit() {
		labStore("kit", KIT);
		drawTray();
		$$("[data-kit-add]").forEach((b) => {
			const inKit = KIT.items.includes(b.dataset.kitAdd);
			b.classList.toggle("in", inKit);
			b.textContent = inKit ? "En el kit ✓" : "+ Al kit";
		});
	}

	function startKit(n) {
		if (!KIT_ENABLED) return;
		KIT.size = n;
		KIT.items = KIT.items.slice(0, n);
		saveKit();
		openCatalog({ group: "decant" });
		toast(`Elegí ${n} decants para tu kit`);
	}

	function flyToSlot(fromEl, i) {
		const slotEl = $(`#lab-tray .lab-slot[data-i="${i}"]`);
		if (!fromEl || !slotEl || reduceMotion()) return;
		const a = fromEl.getBoundingClientRect(), b = slotEl.getBoundingClientRect();
		const ghost = fromEl.cloneNode(true);
		ghost.className = "lab-ghost";
		Object.assign(ghost.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
		document.body.appendChild(ghost);
		slotEl.style.opacity = 0;
		ghost.animate([
			{ transform: "none", opacity: 1 },
			{ transform: `translate(${(b.left - a.left) * 0.5}px, ${(b.top - a.top) * 0.5 - 80}px) scale(.7) rotate(-8deg)`, opacity: 1, offset: 0.5 },
			{ transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width})`, opacity: 0.9 },
		], { duration: 700, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => {
			ghost.remove();
			slotEl.style.opacity = "";
			slotEl.animate([{ transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 350, easing: "cubic-bezier(.3,1.6,.5,1)" });
		};
	}

	function addToKit(id, btn) {
		if (KIT.items.includes(id)) return toast("Ese ya está en el kit");
		if (KIT.items.length >= KIT.size) return toast("El kit ya está completo");
		KIT.items.push(id);
		saveKit();
		const holder = btn.closest(".card");
		flyToSlot(holder && $(".pwrap", holder), KIT.items.length - 1);
		if (KIT.items.length === KIT.size) toast("¡Kit completo! Ya podés agregarlo al pedido");
	}

	function kitToCart() {
		const n = KIT.size;
		KIT.items.forEach((id) => addToCart(id, 1, `Kit de ${n}`));
		KIT.size = 0;
		KIT.items = [];
		saveKit();
		render();
		openDrawer();
	}

	// ---------------- Favoritos y "avisame cuando vuelva" ----------------

	const FAV = new Set((labStore("favs") || []).filter((id) => byId(id)));

	function favButton() {
		if ($("#lab-fav-btn")) return;
		const b = document.createElement("button");
		b.className = "icon-btn cart-btn lab-only";
		b.id = "lab-fav-btn";
		b.dataset.favOpen = "";
		b.innerHTML = HEART + '<span class="count" id="lab-fav-count">0</span>';
		$("#cart-btn").before(b);
	}

	function saveFav() {
		labStore("favs", [...FAV]);
		$("#lab-fav-count").textContent = FAV.size;
		$("#lab-fav-btn").classList.toggle("has", FAV.size > 0);
		$("#lab-fav-btn").setAttribute("aria-label", `Favoritos (${FAV.size})`);
		$$("[data-fav]").forEach((b) => b.setAttribute("aria-pressed", FAV.has(b.dataset.fav)));
	}

	function toggleFav(id, btn) {
		if (FAV.has(id)) FAV.delete(id); else FAV.add(id);
		saveFav();
		if (btn && FAV.has(id) && !reduceMotion()) btn.animate([{ transform: "scale(1.4)" }, { transform: "scale(1)" }], { duration: 400, easing: "cubic-bezier(.3,1.6,.5,1)" });
		toast(FAV.has(id) ? "Guardado en favoritos" : "Sacado de favoritos");
	}

	const msgBox = (text) => `<pre class="msg" id="msg">${esc(text)}</pre>
		<div class="msg-actions">
			<button class="btn ghost" data-copy-msg>Copiar mensaje</button>
			<button class="btn" data-wa>Enviar por WhatsApp</button>
		</div>`;

	function openFavs(showMsg = false) {
		const list = [...FAV].map(byId);
		const msg = ["¡Hola! Estos son los perfumes que me interesan:", "", ...list.map((p) => `• ${p.raw}: ${money(p.price)}`)].join("\n");
		$("#modal-body").innerHTML = `<h2 id="modal-title">Tus favoritos</h2>
			${list.length ? `<ul class="lines">${list.map((p) => `<li class="line" data-tint="${p.id}" style="${tintStyle(p.id)}">
				<span class="line-art pwrap">${photo(p)}</span>
				<span class="line-info"><b>${esc(p.name)}</b><span>${esc([p.brand, sizeLabel(p)].filter(Boolean).join(" · ") || CAT[p.cat].short)}</span>
					${p.out ? '<span class="lab-out">Sin stock</span>' : ""}</span>
				<span class="line-end"><b>${money(p.price)}</b><button class="link" data-fav-rm="${p.id}">Quitar</button></span>
			</li>`).join("")}</ul>
			<div class="msg-actions">
				<button class="btn" data-fav-all>Agregar al pedido</button>
				<button class="btn ghost" data-fav-msg>Mandar la lista por WhatsApp</button>
			</div>
			${showMsg ? msgBox(msg) : ""}`
			: `<p class="muted">Todavía no guardaste ninguno. Tocá el corazón de un perfume para guardarlo.</p>`}`;
		openPanel("#modal");
		tintExisting();
	}

	function openNotify(p) {
		$("#modal-body").innerHTML = `<h2 id="modal-title">Avisame cuando vuelva</h2>
			<p class="muted">Mandale este mensaje a la tienda y te avisan cuando entre.</p>
			${msgBox(`¡Hola! ¿Me avisás cuando vuelva a entrar ${p.raw}? Gracias.`)}`;
		openPanel("#modal");
	}

	// ---------------- Test: encontrá tu perfume ----------------

	const QUIZ = [
		["who", "¿Para quién es?", [["hombre", "Para él"], ["mujer", "Para ella"], ["any", "Me da igual"]]],
		["when", "¿Para qué momento?", [["dia", "De día o para la oficina"], ["noche", "Para salir de noche"], ["cita", "Para una cita"], ["todo", "Para todos los días"]]],
		["fam", "¿Qué te gusta más?", [["dulce", "Dulce: vainilla, caramelo"], ["fresco", "Fresco: cítricos, marino"], ["amaderado", "Amaderado: maderas, oud"], ["especiado", "Especiado: pimienta, ámbar"], ["floral", "Floral: rosa, jazmín"]]],
		["budget", "¿Qué querés comprar?", [["d1", "Un decant para probar, hasta $10.000"], ["d2", "Un decant, sin límite"], ["f1", "Un frasco, hasta $60.000"], ["f2", "Un frasco, sin límite"]]],
	];
	const FAM_HINTS = [
		["dulce", /vanill|vainill|caramel|candy|sweet|sugar|pistach|cocoa|choco|honey|miel|gourmand|bourbon|khamr|eclaire|yum|delight|cookie|praline|tonka|cream/],
		["fresco", /aqua|acqua|blue|bleu|marine|sea\b|ocean|fresh|sport|cologne|azzur|glacier|island|ice\b|cool|water|breeze|mint|citrus|summer|pacific|wave|sky|atlantis|thunder|kaiak/],
		["amaderado", /oud|wood|cedar|cedro|leather|cuero|smok|tobacco|tabaco|vetiver|noir|dark|black|obsidian|patchouli|fireplace/],
		["especiado", /spic|saffron|safran|azafr|amber|ambar|9pm|ultra|asad|pepper|elixir|intense|absolu|fire|flame|hawas/],
		["floral", /rose|rosa|flower|flor\b|floral|bloom|blossom|jasmin|jazm|peony|petal|garden|bella|blush|pink|femme|woman|her\b|mujer|girl|lady|queen|princess/],
	];
	const WHEN = {
		dia: { fresco: 3, floral: 2, amaderado: 1 }, noche: { dulce: 3, especiado: 3, amaderado: 2 },
		cita: { dulce: 3, floral: 3, especiado: 2, amaderado: 1, fresco: 1 }, todo: { dulce: 1, fresco: 1, amaderado: 1, especiado: 1, floral: 1 },
	};
	const famOf = (p) => p.fam || (FAM_HINTS.find(([, re]) => re.test(norm(p.raw))) || [""])[0];
	const genderOf = (p) => p.gender || (/woman|femme|for her|\bher\b|mujer|lady|queen|girl/.test(norm(p.raw)) ? "mujer"
		: /homme|\bman\b|\bmen\b|for him|king|\bboy/.test(norm(p.raw)) ? "hombre" : "");
	const BUDGET = {
		d1: (p) => p.ml === 5 && p.price <= 10000, d2: (p) => p.ml === 5,
		f1: (p) => p.group !== "decant" && p.price <= 60000, f2: (p) => p.group !== "decant",
	};
	let quiz = { step: 0, a: {} };

	function quizResults(a, strictGender = true) {
		const scored = PRODUCTS.filter((p) => !p.out && BUDGET[a.budget](p)).map((p) => {
			const g = genderOf(p), f = famOf(p);
			if (a.who !== "any" && strictGender && g && g !== a.who) return null;
			let s = 0;
			if (a.who !== "any" && g === a.who) s += 3;
			if (f === a.fam) s += 5;
			if (f) s += WHEN[a.when][f] || 0;
			if (p.notes) s += 1;
			if (REV.has(p.id)) s += 1;
			return [p, s];
		}).filter(Boolean).sort((x, y) => y[1] - x[1]);
		const perCat = {}, out = [];
		for (const [p] of scored) {
			if ((perCat[p.cat] = (perCat[p.cat] || 0) + 1) > 2) continue;
			out.push(p);
			if (out.length === 6) break;
		}
		return out;
	}

	function drawQuiz(dir = 1) {
		const body = $("#modal-body");
		if (quiz.step >= QUIZ.length) {
			let res = quizResults(quiz.a);
			if (res.length < 3) res = quizResults(quiz.a, false);
			body.innerHTML = `<h2 id="modal-title">Te sugerimos</h2>
				${res.length ? `<div class="grid">${res.map((p) => card(p)).join("")}</div>` : "<p>No encontramos opciones con esas respuestas. Probá con otro presupuesto.</p>"}
				<button class="btn ghost" data-quiz-restart>Volver a empezar</button>`;
			tintExisting();
			return;
		}
		const [key, q, opts] = QUIZ[quiz.step];
		body.innerHTML = `<p class="lab-steps">Pregunta ${quiz.step + 1} de ${QUIZ.length}</p>
			<div class="lab-progress"><i style="width:${(quiz.step / QUIZ.length) * 100}%"></i></div>
			<h2 id="modal-title" class="lab-q" style="--dir:${dir}">${q}</h2>
			<div class="lab-opts" style="--dir:${dir}">${opts.map(([v, t], i) =>
				`<button class="lab-opt" data-quiz-ans="${key}|${v}" style="--i:${i}" aria-pressed="${quiz.a[key] === v}">${t}</button>`).join("")}</div>
			${quiz.step ? '<button class="link" data-quiz-back>← Anterior</button>' : ""}`;
	}

	function openQuiz() {
		quiz = { step: 0, a: {} };
		drawQuiz();
		openPanel("#modal", true);
	}

	// ---------------- Lo que se agrega a cada pantalla ----------------

	// Un perfume por video, en el orden de la lista, para que se vea variedad
	function reviewPicks() {
		const out = [], used = new Set(), seenVid = new Set();
		for (const p of PRODUCTS) {
			const vids = REV.get(p.id);
			if (!vids || p.out || used.has(p.id) || seenVid.has(vids[0][0])) continue;
			used.add(p.id); seenVid.add(vids[0][0]); out.push(p);
			if (out.length === 8) break;
		}
		return out;
	}

	add("home", () => `<section class="sec lab-sec">
		<div class="sec-head"><p class="eyebrow">Te ayudamos a elegir</p><h2>¿No sabés cuál?</h2></div>
		<div class="lab-grid">
			${KIT_ENABLED ? `<div class="lab-card">
				<h3>Armá tu kit de decants</h3>
				<p>Elegí 4 o 6 decants de 5 ml y llevalos juntos, para probar antes de comprar el frasco.</p>
				<div class="cta"><button class="btn" data-kit-start="4">Kit de 4</button><button class="btn ghost" data-kit-start="6">Kit de 6</button></div>
				<a class="link" href="${yt(DECANT_VIDEO[0])}" target="_blank" rel="noopener">Video del canal: ${DECANT_VIDEO[1]} →</a>
			</div>` : ""}
			<div class="lab-card">
				<h3>¿Qué perfume usás hoy?</h3>
				<p>Escribí el que usás y te mostramos los parecidos que hay en la tienda.</p>
				<form class="lab-similar" id="lab-similar">
					<label class="sr" for="lab-similar-q">Perfume que usás</label>
					<input id="lab-similar-q" placeholder="Por ejemplo: Sauvage" autocomplete="off">
					<button class="btn" type="submit">Buscar</button>
				</form>
				<div class="lab-chips">${SUGGEST.map((s) => `<button class="chip" data-similar="${esc(s)}">${esc(s)}</button>`).join("")}</div>
			</div>
			<div class="lab-card">
				<h3>Encontrá tu perfume</h3>
				<p>Cuatro preguntas rápidas y te sugerimos opciones del catálogo.</p>
				<button class="btn" data-quiz>Empezar</button>
			</div>
		</div>
	</section>
	<section class="sec lab-sec">
		<div class="sec-head"><p class="eyebrow">Huelepectacular en YouTube</p><h2>Con reseña en el canal</h2>
			<a class="link" href="${CHANNEL}/videos" target="_blank" rel="noopener">Ir al canal →</a></div>
		<div class="grid">${reviewPicks().map((p) => card(p)).join("")}</div>
	</section>`);

	add("catHead", (c) => KIT_ENABLED && c && c.group === "decant" && !KIT.size ? `<div class="lab-banner">
		<span>¿Querés probar varios? Armá un kit de decants.</span>
		<button class="btn" data-kit-start="4">Kit de 4</button><button class="btn ghost" data-kit-start="6">Kit de 6</button>
	</div>` : "");

	add("card", (p) => {
		let h = `<button class="lab-fav" data-fav="${p.id}" aria-pressed="${FAV.has(p.id)}" aria-label="Guardar ${esc(p.name)} en favoritos">${HEART}</button>`;
		if (REV.has(p.id)) h += '<span class="lab-revbadge">▶ Reseña</span>';
		if (KIT_ENABLED && KIT.size && p.ml === 5 && !p.out) {
			const inKit = KIT.items.includes(p.id);
			h += `<button class="lab-kit-add${inKit ? " in" : ""}" data-kit-add="${p.id}">${inKit ? "En el kit ✓" : "+ Al kit"}</button>`;
		}
		return h;
	});

	// Precio por ml, en una línea: cuánto sale el ml y cuánto más barato es frente al otro tamaño y a su categoría
	add("pdpPrice", (p, sib) => {
		let ml = "";
		if (p.ml) {
			const per = (o) => o.price / o.ml;
			const parts = [`${money(Math.round(per(p)))} el ml`];
			const others = sib.filter((o) => o.ml);
			const cheaper = others.filter((o) => per(o) < per(p)).sort((a, b) => per(a) - per(b))[0];
			const pricier = others.filter((o) => per(o) > per(p)).sort((a, b) => per(b) - per(a))[0];
			if (cheaper) parts.push(`${Math.round((1 - per(cheaper) / per(p)) * 100)}% más barato por ml en ${sizeLabel(cheaper).toLowerCase()}`);
			else if (pricier) parts.push(`${Math.round((1 - per(p) / per(pricier)) * 100)}% más barato por ml que el ${sizeLabel(pricier).toLowerCase()}`);
			const peers = PRODUCTS.filter((o) => o.cat === p.cat && o.ml === p.ml && o.id !== p.id);
			const rank = peers.length >= 5 ? Math.round((peers.filter((o) => o.price > p.price).length / peers.length) * 100) : 0;
			if (rank >= 50) parts.push(`más barato que el ${rank}% de su categoría`);
			ml = `<p class="lab-ppm">${parts.join(" · ")}</p>`;
		}
		return `${ml}<div class="lab-actions">
			<button class="lab-fav-wide" data-fav="${p.id}" aria-pressed="${FAV.has(p.id)}">${HEART}<span>Favorito</span></button>
			${p.out ? `<button class="btn ghost" data-notify="${p.id}">Avisame cuando vuelva</button>` : ""}
		</div>`;
	});

	add("pdpAfter", (p) => {
		const vids = REV.get(p.id) || [];
		const brandV = !vids.length && BRAND_VIDEOS[p.brand];
		return `<div class="lab-review">
			<h2>La reseña de Huelepectacular</h2>
			${vids.map(([id, t]) => videoLink(id, t)).join("")}
			${brandV ? `<p class="lab-sub">Video sobre la marca:</p>${videoLink(...brandV)}` : ""}
			<a class="link" href="${ytSearch(p.name)}" target="_blank" rel="noopener">Buscar ${esc(p.name)} en el canal →</a>
		</div>`;
	});

	// ---------------- Eventos ----------------

	document.addEventListener("click", (e) => {
		const t = e.target.closest("button");
		if (!t) return;
		const d = t.dataset;
		if (d.kitStart) return startKit(+d.kitStart);
		if (d.kitAdd) return addToKit(d.kitAdd, t);
		if (d.kitRm) { KIT.items.splice(+d.kitRm, 1); return saveKit(); }
		if (d.kitCart !== undefined) return kitToCart();
		if (d.kitCancel !== undefined) { KIT.size = 0; KIT.items = []; saveKit(); return render(); }
		if (d.fav) return toggleFav(d.fav, t);
		if (d.favOpen !== undefined) return openFavs();
		if (d.favRm) { FAV.delete(d.favRm); saveFav(); return openFavs(); }
		if (d.favMsg !== undefined) return openFavs(true);
		if (d.favAll !== undefined) {
			[...FAV].map(byId).filter((p) => !p.out).forEach((p) => addToCart(p.id));
			closePanel($("#modal"));
			return openDrawer();
		}
		if (d.notify) return openNotify(byId(d.notify));
		if (d.similar) return showSimilar(d.similar);
		if (d.quiz !== undefined) return openQuiz();
		if (d.quizRestart !== undefined) { quiz = { step: 0, a: {} }; return drawQuiz(); }
		if (d.quizBack !== undefined) { quiz.step--; return drawQuiz(-1); }
		if (d.quizAns) {
			const [k, v] = d.quizAns.split("|");
			quiz.a[k] = v;
			t.setAttribute("aria-pressed", "true");
			setTimeout(() => { quiz.step++; drawQuiz(1); }, reduceMotion() ? 0 : 180);
		}
	});

	document.addEventListener("submit", (e) => {
		if (e.target.id !== "lab-similar") return;
		e.preventDefault();
		showSimilar($("#lab-similar-q").value);
	});

	// ---------------- Inicio ----------------

	favButton();
	saveFav();
	drawTray();
	render();
})();
