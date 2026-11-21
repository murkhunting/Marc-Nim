/**
 * RSVP → Google Sheets
 *
 * 1. Crea una hoja de cálculo nueva en Google Sheets.
 * 2. Extensiones → Apps Script → pega este archivo.
 * 3. Implementar → Nueva implementación → Tipo "Aplicación web"
 *      Ejecutar como: Yo
 *      Quién tiene acceso: Cualquier usuario
 * 4. Copia la URL que acaba en /exec y ponla en el archivo .env del proyecto:
 *      PUBLIC_RSVP_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
 * 5. Vuelve a hacer build/deploy de la web.
 */
const COLUMNS = [
  'fecha', 'expediente', 'nombre', 'email', 'telefono', 'asistencia',
  'acompanante', 'acompanante_nombre', 'ninos', 'menu', 'alergias',
  'origen', 'transporte', 'llegada', 'cancion', 'mensaje',
];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow(COLUMNS.map((c) => data[c] ?? ''));
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
