// Ordena el catálogo real (catalog.js): grupos, nombres cortos, marca, tamaño y "otros tamaños".

const STORE = {
	name: "Huelepectacular",
	whatsapp: "+54 9 11 2520-4376",
	place: "Villa Devoto, CABA",
	notice: "Respondo en el día. ¡Paciencia y gracias!",
	minOrder: 20000,
	instagram: "https://instagram.com/huelepectacular",
	youtube: "https://www.youtube.com/@huelepectacular4212",
	site: "https://huele.com.ar",
	// Formas de entrega, como figuran en la tienda de Pedix
	meet: [
		["devoto", "Encuentro en Devoto", "Av. Lope de Vega y Beiro"],
		["ramos", "Encuentro en Ramos Mejía", "Plaza del Cañón, Formosa y Villegas"],
	],
	ship: "Envío por Correo Argentino, a sucursal",
	decantVideo: ["636MD8Q2xPQ", "Cómo decantar perfumes (fácil y sin perder ni una gota)"],
};

const GROUPS = {
	decant: { name: "Decants de 5 ml", hint: "Para probar antes de comprar el frasco" },
	frasco: { name: "Frascos", hint: "De 30 a 100 ml" },
	oferta: { name: "Ofertas", hint: "Precios especiales" },
};

// Nombre que se muestra y grupo de cada categoría (en el mismo orden que la tienda).
// Los nombres se entienden solos, sin depender del grupo, y los decants dicen "5 ml" como en la tienda.
const CAT_META = {
	"PypkckaWyv6pWwCku3L3": ["Perfumes Huelepectacular", "frasco"],
	"WaLMilAMEprICNjjUJra": ["Decants 5 ml árabes hombre", "decant", "hombre"],
	"DI0FUuoaRooGHMTJJaHm": ["Decants 5 ml diseñador", "decant"],
	"Zrl7xm5EJsGujMqsOjpF": ["Perfumes árabes", "frasco"],
	"BHEoy3KGtm7SpLNlrzw2": ["Mykonos 50 y 100 ml", "frasco"],
	"qwTH3hZO3UnJ4WH4SHad": ["Decants 5 ml Mykonos", "decant"],
	"jgUFwVCM7qVbU3DSk3Re": ["Árabes de 30 ml", "frasco"],
	"PD6L0slj1gRStRLBsWvA": ["Decants 5 ml árabes mujer", "decant", "mujer"],
	"kpW2AdSmdV0CtKIRtboI": ["Decants 5 ml Jo Milano", "decant"],
	"eL52cEQkAZw7Jq1eHxht": ["Decants 5 ml Bharara", "decant"],
	"ZrzCxoGZZq7ovd2q7nf6": ["Ofertas", "oferta"],
	"BcwyPUYWzzBeVhVDhXNZ": ["Extracto importado", "frasco"],
	"d6sbjjyzBqRWAID2LqRu": ["Multimarcas", "frasco"],
	"lXSERc6gWEkep0FqGXdn": ["Yves d'Orgeval", "frasco"],
	"BfaukmQVDBDv8nJhlbWr": ["Decants 5 ml low y mid cost", "decant"],
	"96RmOEIA4IW98xBL2FW5": ["Decants 5 ml nicho", "decant"],
	"84wkaE2kLSsgpwjyjufx": ["Perfumes Milano", "frasco"],
};

// Marcas: [nombre que se muestra, cómo aparece en los nombres]. Las más largas van primero.
const BRANDS = [
	["Maison Alhambra", /maison alhambra/i], ["Jean Paul Gaultier", /jean paul gaultier|\bjpg\b/i], ["French Avenue", /french avenue/i],
	["Yves d'Orgeval", /yves d.orgeval/i], ["Parfums de Marly", /parfums? de marly|marly/i], ["Lorenzo Pazzaglia", /lorenzo pazzaglia|pazzaglia/i], ["Maison Margiela", /maison margiela|margiela|replica/i],
	["Narciso Rodriguez", /narciso/i], ["Carolina Herrera", /carolina herrera|\bch\b/i], ["Antonio Banderas", /antonio banderas|banderas/i], ["Karina Rabolini", /rabolini/i],
	["Fragrance World", /fragr?ance world/i], ["Paris Corner", /par[ií]s corner/i], ["Town Scent", /town ?s?cent/i], ["Ramón Monegal", /ram[oó]n monegal|monegal/i],
	["Stella Dustin", /stella dustin|^stella\b/i], ["Al Haramain", /haramain/i], ["Tom Ford", /tom ford/i], ["Paco Rabanne", /rabanne/i],
	["Hugo Boss", /hugo boss|^boss\b/i], ["Giorgio Armani", /armani|acqua di gi[oò]/i], ["Yves Saint Laurent", /saint laurent|\bysl\b/i],
	["Dolce & Gabbana", /dolce ?(&|y) ?gabbana|\bd&g\b/i], ["Wayne & Co", /wayne/i], ["Game of Spades", /game of spades/i], ["Jo Milano", /jo milano/i],
	["Lattafa", /lat+af+a/i], ["Armaf", /armaf|club de nuit/i], ["Rayhaan", /rayhaan/i], ["Khadlaj", /khadlaj/i], ["Afnan", /afnan/i], ["Rasasi", /rasasi|hawas/i],
	["Versace", /versace|\beros\b/i], ["Dior", /christian dior|dior|sauvage/i], ["Chanel", /chanel/i], ["Xerjoff", /xerjoff/i], ["Nishane", /nishane/i], ["Creed", /creed/i],
	["Mancera", /mancera/i], ["Montale", /montale/i], ["Lagerfeld", /lagerfeld/i], ["Coach", /\bcoach\b/i], ["Mugler", /mugler/i], ["Solonoi", /solonoi/i], ["Riiffs", /riiffs/i],
	["Natura", /natura\b/i], ["Bharara", /bharara/i], ["Bensimon", /bensimon/i], ["Anfar", /anfar/i], ["Kevingston", /kevingston/i], ["Tascani", /tascani/i],
	["Giesso", /giesso/i], ["Parismania", /parismania/i], ["Mykonos", /mykonos/i], ["Azzaro", /azzaro/i], ["Montblanc", /montblanc|mont blanc/i],
	["Valentino", /valentino/i], ["Givenchy", /givenchy/i], ["Prada", /prada/i], ["Bvlgari", /bvlgari|bulgari/i], ["Lacoste", /lacoste/i],
	["Calvin Klein", /calvin klein|\bck\b/i], ["Ralph Lauren", /ralph lauren/i], ["Moschino", /moschino/i], ["Kenzo", /kenzo/i], ["Gucci", /gucci/i],
	["Milano", /milano/i], ["Huelepectacular", /black poison|you are mine|sexy fever|in ?your prime/i],
];

// Ficha de ejemplo para algunos perfumes conocidos (se muestra marcada como ejemplo):
// [salida, corazón, fondo, duración 1-5, estela 1-5, familia, descripción]
const NOTES = {
	"black poison": [["pimienta negra", "cardamomo"], ["lavanda", "cuero"], ["oud", "ámbar", "vainilla"], 5, 4, "especiado",
		"La firma de la casa: arranca picante con pimienta y cardamomo, y termina oscuro y envolvente con oud y vainilla. Para la noche."],
	"you are mine": [["lavanda", "menta"], ["vainilla", "benjuí"], ["miel", "haba tonka", "tabaco"], 5, 5, "dulce",
		"Dulce y aromático: la lavanda fresca se va fundiendo en miel, tonka y tabaco. Un perfume de abrazo, ideal para salir de noche."],
	"sexy fever": [["pimienta rosa", "cereza", "azafrán"], ["rosa", "peonía"], ["almizcle", "cachemira", "ámbar"], 4, 4, "floral",
		"Frutal y floral con un fondo cálido: cereza y azafrán sobre rosa y peonía, con un almizcle suave. Femenino, elegante y con presencia."],
	"in your prime": [["bergamota", "jengibre"], ["lavanda", "salvia"], ["ámbar gris", "cedro"], 4, 3, "fresco",
		"Fresco y limpio, con jengibre y bergamota que despiertan y un fondo de cedro. Va bien de día, para la oficina o el calor."],
	"le male elixir": [["lavanda", "menta"], ["vainilla", "benjuí"], ["miel", "haba tonka", "tabaco"], 5, 5, "dulce",
		"Lavanda y menta frescas sobre un corazón de vainilla y miel. Dulce, intenso y muy duradero: un clásico de la noche."],
	"eros edp": [["menta", "limón", "manzana verde"], ["haba tonka", "geranio"], ["vainilla", "cedro", "vetiver"], 4, 4, "fresco",
		"Menta y manzana verde al comienzo, vainilla y maderas al final. Fresco y dulce a la vez, con muy buena proyección."],
	"eros flame": [["mandarina", "pimienta negra"], ["romero", "rosa"], ["haba tonka", "pachulí"], 4, 4, "especiado",
		"Cítrico y especiado: mandarina y pimienta negra que se apoyan en tonka y pachulí. Cálido, para otoño e invierno."],
	"layton": [["manzana", "lavanda", "bergamota"], ["geranio", "violeta", "jazmín"], ["vainilla", "cardamomo", "sándalo"], 5, 5, "especiado",
		"Manzana y lavanda al principio, vainilla y cardamomo de fondo. Elegante y versátil, de los nicho más conocidos."],
	"naxos": [["lavanda", "bergamota", "limón"], ["miel", "canela", "jazmín"], ["tabaco", "haba tonka", "vainilla"], 5, 4, "dulce",
		"Miel, tabaco y tonka con un toque de lavanda: dulce, cálido y refinado. Muy buscado para las noches frescas."],
	"by the fireplace": [["pimienta rosa", "azahar", "clavo"], ["castaña", "guayaco", "enebro"], ["vainilla", "bálsamo de Perú", "cashmeran"], 4, 3, "amaderado",
		"Huele a hogar a leña: castañas tostadas, clavo y vainilla con un humo suave de maderas. Acogedor y otoñal."],
	"hacivat": [["ananá", "pomelo", "bergamota"], ["pachulí", "cedro", "jazmín"], ["musgo de roble", "maderas"], 5, 4, "fresco",
		"Ananá y pomelo chispeantes sobre musgo y maderas. Fresco, frutal y con carácter; muy usado en primavera y verano."],
	"carmina": [["pimienta rosa", "cereza", "azafrán"], ["rosa", "peonía"], ["almizcle", "cachemira", "ámbar"], 4, 4, "floral",
		"Cereza, azafrán y rosa con un fondo de cachemira y almizcle. Femenino y sofisticado."],
	"eclaire pistache": [["pistacho", "caramelo"], ["leche", "azúcar"], ["vainilla", "almizcle"], 4, 4, "dulce",
		"Gourmand: pistacho, caramelo y leche con vainilla. Dulce y cremoso."],
	"karus secret musk": [["bergamota", "pimienta rosa"], ["almizcle", "rosa"], ["ámbar", "vainilla", "pachulí"], 4, 3, "especiado",
		"Almizcle limpio y rosa sobre un fondo de ámbar y vainilla. Suave, cercano a la piel y muy agradable."],
	"club de nuit imperiale": [["mandarina", "pera"], ["rosa", "jazmín"], ["vainilla", "almizcle"], 4, 4, "floral",
		"Mandarina y pera sobre rosa y jazmín, con vainilla de fondo. Floral y frutal, luminoso y femenino."],
	"yum yum": [["frutilla", "algodón de azúcar"], ["jazmín"], ["vainilla", "almizcle"], 3, 4, "dulce",
		"Frutilla y algodón de azúcar: dulce de feria, alegre y juvenil, con un fondo de vainilla."],
	"bleu noir edp": [["cardamomo", "nuez moscada"], ["almizcle"], ["ébano", "vetiver"], 4, 3, "amaderado",
		"Cardamomo y nuez moscada sobre almizcle y maderas oscuras. Sobrio, elegante y nocturno."],
	"scandal edt": [["mandarina", "naranja sanguina"], ["miel", "gardenia"], ["pachulí", "cera de abeja"], 4, 4, "dulce",
		"Miel y gardenia con un fondo de pachulí: dulce, floral y seductor."],
};

// Acordes principales de cada perfume de ejemplo: [acorde, intensidad 0-100]. Se muestran como barras.
const ACCORDS_BY = {
	"black poison": [["cálido especiado", 100], ["amaderado", 88], ["oud", 80], ["avainillado", 70], ["cuero", 62], ["aromático", 50], ["ámbar", 44]],
	"you are mine": [["avainillado", 100], ["dulce", 90], ["lavanda", 82], ["miel", 72], ["aromático", 64], ["tabaco", 55], ["atalcado", 40]],
	"sexy fever": [["frutos rojos", 100], ["floral", 86], ["rosa", 80], ["cálido especiado", 66], ["almizclado", 58], ["ámbar", 48], ["atalcado", 40]],
	"in your prime": [["fresco", 100], ["cítrico", 88], ["aromático", 78], ["especiado fresco", 65], ["amaderado", 55], ["ámbar gris", 45]],
	"le male elixir": [["avainillado", 100], ["dulce", 90], ["lavanda", 82], ["miel", 72], ["aromático", 64], ["tabaco", 55], ["atalcado", 40]],
	"eros edp": [["dulce", 100], ["fresco", 85], ["avainillado", 78], ["aromático", 70], ["verde", 60], ["amaderado", 50], ["cítrico", 42]],
	"eros flame": [["cálido especiado", 100], ["cítrico", 85], ["amaderado", 72], ["dulce", 62], ["aromático", 55], ["pachulí", 45]],
	"layton": [["avainillado", 100], ["aromático", 88], ["frutal", 78], ["cálido especiado", 70], ["amaderado", 62], ["lavanda", 55], ["floral", 45]],
	"naxos": [["miel", 100], ["tabaco", 90], ["dulce", 84], ["avainillado", 76], ["aromático", 62], ["lavanda", 55], ["cálido especiado", 48]],
	"by the fireplace": [["ahumado", 100], ["amaderado", 90], ["avainillado", 80], ["cálido especiado", 70], ["dulce", 58], ["balsámico", 50]],
	"hacivat": [["frutal", 100], ["amaderado", 86], ["cítrico", 80], ["musgoso", 70], ["tropical", 62], ["fresco", 52]],
	"carmina": [["frutos rojos", 100], ["floral", 86], ["rosa", 80], ["cálido especiado", 66], ["almizclado", 58], ["ámbar", 48], ["atalcado", 40]],
	"eclaire pistache": [["dulce", 100], ["pistacho", 90], ["avainillado", 84], ["caramelo", 76], ["lácteo", 68], ["almizclado", 48]],
	"karus secret musk": [["almizclado", 100], ["rosa", 82], ["avainillado", 72], ["ámbar", 64], ["cálido especiado", 55], ["pachulí", 44]],
	"club de nuit imperiale": [["frutal", 100], ["floral blanco", 88], ["dulce", 80], ["avainillado", 70], ["rosa", 60], ["almizclado", 48]],
	"yum yum": [["dulce", 100], ["frutal", 92], ["frutos rojos", 84], ["avainillado", 72], ["floral blanco", 50], ["almizclado", 42]],
	"bleu noir edp": [["almizclado", 100], ["amaderado", 88], ["cálido especiado", 74], ["atalcado", 60], ["aromático", 50]],
	"scandal edt": [["miel", 100], ["dulce", 90], ["floral blanco", 80], ["pachulí", 70], ["cítrico", 58], ["balsámico", 48]],
};
const ACCORD_COLORS = {
	"avainillado": "#fbf1b0", "dulce": "#e8678f", "frutal": "#f39a4a", "frutos rojos": "#c92b45", "floral": "#f2a7c3",
	"floral blanco": "#e6ecf3", "rosa": "#ea7f9c", "cálido especiado": "#c0390f", "especiado fresco": "#7fc08f", "aromático": "#4f9a76",
	"lavanda": "#a98bd2", "cítrico": "#d3dc4f", "fresco": "#8fd3ec", "verde": "#5f9e3a", "amaderado": "#6b3f1f", "oud": "#3e2a1f",
	"ahumado": "#77706a", "cuero": "#4b2e22", "tabaco": "#8b5a2b", "miel": "#e5a83a", "ámbar": "#b1531b", "ámbar gris": "#b9c2c8",
	"balsámico": "#9a7452", "pachulí": "#556b2f", "almizclado": "#e3d7ea", "atalcado": "#efe0d6", "musgoso": "#4f6b3a",
	"tropical": "#f7b32b", "pistacho": "#a9b86b", "caramelo": "#c9772f", "lácteo": "#f4ecdc",
};

// Mood de cada perfume de ejemplo (se muestra con un puntito de color)
const MOODS_BY = {
	"black poison": ["Nocturno", "Intenso", "Seductor"], "you are mine": ["Seductor", "Nocturno", "Dulce"],
	"sexy fever": ["Romántico", "Elegante", "Afrutado"], "in your prime": ["Fresco", "De día", "Oficina"],
	"le male elixir": ["Seductor", "Nocturno", "Intenso"], "eros edp": ["Juvenil", "Fresco", "Seductor"],
	"eros flame": ["Cálido", "Seductor", "Invierno"], "layton": ["Elegante", "Versátil", "Seductor"],
	"naxos": ["Elegante", "Cálido", "Invierno"], "by the fireplace": ["Acogedor", "Cálido", "Invierno"],
	"hacivat": ["Fresco", "Afrutado", "Verano"], "carmina": ["Romántico", "Elegante", "Lujoso"],
	"eclaire pistache": ["Goloso", "Dulce", "Juvenil"], "karus secret musk": ["Limpio", "Suave", "Versátil"],
	"club de nuit imperiale": ["Romántico", "Afrutado", "Luminoso"], "yum yum": ["Divertido", "Dulce", "Juvenil"],
	"bleu noir edp": ["Elegante", "Nocturno", "Sobrio"], "scandal edt": ["Seductor", "Dulce", "Nocturno"],
};
const MOOD_COLORS = {
	"Nocturno": "#3b3f73", "Intenso": "#b0301f", "Seductor": "#c2185b", "Dulce": "#e8678f", "Romántico": "#e57f9b",
	"Elegante": "#6d5c8f", "Afrutado": "#f08a4b", "Fresco": "#4fb3d9", "De día": "#f2c94c", "Oficina": "#8a9aa8",
	"Juvenil": "#7cc443", "Cálido": "#d7792b", "Invierno": "#7ea7c9", "Versátil": "#5aa16f", "Acogedor": "#a8673c",
	"Verano": "#f4b740", "Lujoso": "#b8912f", "Goloso": "#c98a4b", "Limpio": "#9fd3e6", "Suave": "#cbb8d8",
	"Luminoso": "#f6d55c", "Divertido": "#ff8fb1", "Sobrio": "#6b6b6b",
};

// Qué es cada nota y a qué familia pertenece
const NOTE_TYPES = {
	citrico: ["Cítrico", "#e3b234"], frutal: ["Frutal", "#e5725a"], floral: ["Floral", "#df86ab"], aromatico: ["Aromático", "#76ab63"],
	especiado: ["Especiado", "#c5552f"], dulce: ["Dulce", "#c08448"], amaderado: ["Amaderado", "#866548"], almizclado: ["Almizclado", "#a497c0"],
	resinoso: ["Resinoso", "#b37c2b"], cuero: ["Cuero y tabaco", "#6a4836"],
};
const NOTE_INFO = {
	"bergamota": ["citrico", "Cítrico italiano, fresco y apenas amargo."], "limón": ["citrico", "Ácido y luminoso, da sensación de limpieza."],
	"mandarina": ["citrico", "Cítrico dulce y jugoso."], "pomelo": ["citrico", "Chispeante, con un toque amargo."],
	"naranja sanguina": ["citrico", "Naranja roja, jugosa y algo picante."], "cereza": ["frutal", "Fruta roja, dulce y un poco almendrada."],
	"manzana": ["frutal", "Fresca y crocante."], "manzana verde": ["frutal", "Ácida y vibrante."], "ananá": ["frutal", "Tropical, dulce y fresco."],
	"pera": ["frutal", "Jugosa, suave y luminosa."], "frutilla": ["frutal", "Dulce y alegre, de golosina."],
	"rosa": ["floral", "La reina de las flores: elegante y romántica."], "peonía": ["floral", "Floral fresco y suave, casi frutal."],
	"violeta": ["floral", "Empolvada y delicada."], "jazmín": ["floral", "Flor blanca, intensa y sensual."],
	"azahar": ["floral", "La flor del naranjo: limpia y luminosa."], "geranio": ["floral", "Floral verde, entre rosa y menta."],
	"gardenia": ["floral", "Blanca, cremosa y opulenta."], "lavanda": ["aromatico", "Fresca y limpia, clásica de la perfumería masculina."],
	"menta": ["aromatico", "Refrescante, casi helada."], "salvia": ["aromatico", "Herbal, seca y elegante."],
	"romero": ["aromatico", "Herbal y resinoso, bien mediterráneo."], "enebro": ["aromatico", "Fresco y resinoso: el aroma del gin."],
	"pimienta negra": ["especiado", "Picante y seca, despierta la mezcla."], "pimienta rosa": ["especiado", "Picante suave con un toque frutal."],
	"cardamomo": ["especiado", "Especia fresca y aromática, muy usada en Oriente."], "azafrán": ["especiado", "Cálido, con algo de cuero, muy lujoso."],
	"canela": ["especiado", "Dulce y cálida, de horno."], "clavo": ["especiado", "Especia intensa y cálida."],
	"jengibre": ["especiado", "Picante, fresco y vivaz."], "nuez moscada": ["especiado", "Especia cálida y algo amaderada."],
	"vainilla": ["dulce", "Dulce, cremosa y reconfortante."], "haba tonka": ["dulce", "Entre vainilla, almendra y caramelo."],
	"miel": ["dulce", "Dulce, densa y un poco animal."], "caramelo": ["dulce", "Azúcar tostada, golosa."],
	"pistacho": ["dulce", "Fruto seco cremoso, entre dulce y salado."], "leche": ["dulce", "Cremosa y suave."],
	"azúcar": ["dulce", "Dulzor puro, de repostería."], "algodón de azúcar": ["dulce", "Dulce de feria, aireado."],
	"castaña": ["dulce", "Fruto seco tostado y cálido."], "praliné": ["dulce", "Almendra caramelizada."],
	"cedro": ["amaderado", "Madera seca y limpia, como un lápiz."], "vetiver": ["amaderado", "Raíz terrosa y ahumada."],
	"sándalo": ["amaderado", "Madera cremosa y suave."], "guayaco": ["amaderado", "Madera ahumada y algo dulce."],
	"maderas": ["amaderado", "Fondo seco y cálido."], "ébano": ["amaderado", "Madera oscura y densa."],
	"oud": ["amaderado", "Madera de agar: intensa, oscura y muy árabe."], "musgo de roble": ["amaderado", "Verde, terroso y húmedo."],
	"pachulí": ["amaderado", "Terroso, oscuro y persistente."], "cachemira": ["almizclado", "Suave y envolvente como un tejido."],
	"cashmeran": ["almizclado", "Amaderado suave, como una manta."], "almizcle": ["almizclado", "Limpio y cercano a la piel."],
	"ámbar": ["resinoso", "Cálido, dulce y resinoso."], "ámbar gris": ["resinoso", "Salino, mineral, se expande en el aire."],
	"benjuí": ["resinoso", "Resina dulce, parecida a la vainilla."], "bálsamo de Perú": ["resinoso", "Resina dulce y especiada."],
	"cera de abeja": ["resinoso", "Dulce, como miel espesa."], "incienso": ["resinoso", "Humo de templo, místico."],
	"cuero": ["cuero", "Cuero curtido, sofisticado."], "tabaco": ["cuero", "Hoja seca de tabaco, dulce y cálida."],
};

const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
// Nombre para la dirección de cada página: "Black Poison 5 ml" → "black-poison-5-ml"
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const KEEP_UPPER = /^(EDP|EDT|EDC|XS|II|III|IV|NYC|USA|UV|DG|YSL|CK|VIP|212|L'?EAU)$/;

function prettyName(raw, brand, brandRe) {
	let n = raw;
	let inspired = "";
	const par = n.match(/\((.*?)\)/);
	if (par) {
		const t = par[1].trim();
		if (/inspirad|tipo/i.test(t)) inspired = t.replace(/^(perfume \w+ )?inspirado en /i, "").replace(/^tipo /i, "");
		n = n.replace(par[0], " ");
	}
	n = n.replace(/\bdecant(s)?\b/ig, " ").replace(/\b\d+\s?ml\b/ig, " ");
	if (brandRe && brand !== "Huelepectacular") {
		n = n.replace(new RegExp("\\s(de|by)\\s+(" + brandRe.source + ")[^]*$", "i"), " ");
		n = n.replace(new RegExp("\\s+(" + brandRe.source + ")\\s*$", "i"), " ");
		const plain = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, ".");
		n = n.replace(new RegExp("^\\s*" + plain + "\\s+", "i"), " ");
	}
	n = n.replace(/\s+/g, " ").trim().replace(/^de\s+/i, "");
	// Las palabras en mayúsculas se pasan a "Tipo Título" salvo siglas conocidas
	n = n.split(" ").map((w) => (w.length > 3 && w === w.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(w) && !KEEP_UPPER.test(w))
		? w[0] + w.slice(1).toLowerCase() : w).join(" ");
	return { name: n || raw, inspired };
}

const CATS = RAW_CATS.map(([id, full, total]) => {
	const [short, group, gender] = CAT_META[id] || [full, "frasco"];
	return { id, full, short, group, gender: gender || "", total, img: `img/c/${id}.webp`, slug: slug(short) };
});
const CAT = Object.fromEntries(CATS.map((c) => [c.id, c]));

const PRODUCTS = RAW_PRODS.map(([id, cat, raw, price, out]) => {
	const c = CAT[cat];
	// La marca se busca fuera del "(Inspirado en ...)", que nombra a otra marca
	const bare = raw.replace(/\(.*?\)/g, " ");
	const hit = BRANDS.find(([, re]) => re.test(bare));
	const brand = hit ? hit[0] : "";
	const { name, inspired } = prettyName(raw, brand, hit && hit[1]);
	const mlMatch = raw.match(/(\d+)\s?ml/i);
	const ml = /decant/i.test(raw) || c.group === "decant" ? 5 : mlMatch ? +mlMatch[1] : c.short === "Árabes de 30 ml" ? 30 : 0;
	const key = norm(name).replace(/[^a-z0-9]+/g, " ").trim();
	const n = NOTES[key];
	return {
		id, cat, raw, name, brand, inspired, price, out: !!out, ml, key,
		gender: c.gender, group: c.group, img: `img/p/${id}.webp`,
		notes: n ? { top: n[0], heart: n[1], base: n[2] } : null, dur: n ? n[3] : 0, est: n ? n[4] : 0,
		fam: n ? n[5] : "", desc: n ? n[6] : "",
		accords: ACCORDS_BY[key] || null, moods: MOODS_BY[key] || [],
	};
});
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const allNotes = (p) => (p.notes ? [...p.notes.top, ...p.notes.heart, ...p.notes.base] : []);

// Dirección propia de cada perfume (huele.com.ar/perfume/black-poison-lattafa-5-ml); si se repite, lleva un número
{
	const used = new Set();
	PRODUCTS.forEach((p) => {
		const brand = p.brand === STORE.name ? "" : p.brand;
		const base = slug(`${p.name} ${brand} ${p.ml ? p.ml + " ml" : ""}`) || p.id.toLowerCase();
		let s = base;
		for (let i = 2; used.has(s); i++) s = `${base}-${i}`;
		used.add(s);
		p.slug = s;
	});
}

// Mismo perfume en otro tamaño (por ejemplo, el decant y el frasco de 100 ml)
const SIBLINGS = {};
PRODUCTS.forEach((p) => { if (p.key.length >= 4) (SIBLINGS[p.key + "|" + p.brand] ||= []).push(p); });
const siblingsOf = (p) => (SIBLINGS[p.key + "|" + p.brand] || []).filter((o) => o.id !== p.id && o.ml !== p.ml);

// Destacados: los primeros de las categorías principales, en el orden que eligió la tienda
const FEATURED = ["PypkckaWyv6pWwCku3L3", "WaLMilAMEprICNjjUJra", "DI0FUuoaRooGHMTJJaHm", "96RmOEIA4IW98xBL2FW5"]
	.flatMap((c) => PRODUCTS.filter((p) => p.cat === c && !p.out).slice(0, 2)).map((p) => p.id);
