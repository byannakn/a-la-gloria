/* ============================================
   A LA GLORIA — agenda (próximas fechas)
   Lee el Google Sheet publicado como CSV y lo
   convierte en una lista de eventos usable por
   Inicio (próximo evento confirmado) y por
   Próximas fechas (lista completa).
   ============================================ */

(function () {
  // Publicado desde Google Sheets: Archivo > Compartir > Publicar en la Web > CSV
  const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTAf9NUqe9iEtFTUrar6fyyI4roq53ui4lV9Zz-LXPn27vM2Fw3Ygz1y6u52aDErurKdV6VXrE_h27/pub?gid=0&single=true&output=csv";

  // Parser de CSV sencillo, soporta campos entre comillas con comas dentro
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += c;
      }
    }
    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }
    return rows.filter((r) => r.some((c) => c.trim() !== ""));
  }

  function rowsToObjects(rows) {
    if (!rows.length) return [];
    const headers = rows[0].map((h) => h.trim().toLowerCase());
    return rows.slice(1).map((r) => {
      const obj = {};
      headers.forEach((h, idx) => (obj[h] = (r[idx] || "").trim()));
      return obj;
    });
  }

  async function fetchAgenda() {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo leer la hoja de cálculo");
    const text = await res.text();
    const items = rowsToObjects(parseCSV(text));

    return items
      .map((it) => ({
        evento: it["evento"] || "",
        fecha: it["fecha"] || "", // formato esperado: AAAA-MM-DD
        lugar: it["lugar"] || "",
        estado: (it["estado"] || "").toLowerCase(),
        ubicacion: it["ubicación"] || it["ubicacion"] || "",
        imagenUrl: it["imagen_url"] || "",
        imagenAlt: it["imagen_alt"] || "",
      }))
      .filter((it) => it.fecha)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  function nextConfirmed(items) {
    const today = new Date().toISOString().slice(0, 10);
    return items.find((it) => it.estado === "confirmado" && it.fecha >= today) || null;
  }

  window.AlGloriaAgenda = { fetchAgenda, nextConfirmed };
})();
