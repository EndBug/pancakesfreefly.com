/**
 * Flyspot Gdańsk Nov 2026 — interest form backend
 *
 * Canonical copies:
 * - sheet_highlighting.gs — paste this into the bound spreadsheet
 *   (schedule highlighting + doPost + confirmation emails)
 * - email_script.gs — email/registration portion on its own
 *
 * Setup:
 * 1. Paste sheet_highlighting.gs into the sheet's Apps Script project.
 * 2. Create an "Iscrizioni" tab with headers in rows 1–2 (data from row 3):
 *    Nome | Cognome | Telefono | Email | Minuti volo | Disponibile da |
 *    Disponibile a | Condivisione | Compagno | Credito | Lingua
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL into FLYSPOT_GDANSK_NOV26_REGISTRATION_ENDPOINT
 * 5. Run `test()` once to authorize GmailApp
 */
