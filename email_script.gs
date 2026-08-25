function test() {
  const { html, plain, subject } = getEmailBody("it", {
    firstName: "Federico",
    lastName: "Grandi",
    email: "fgrandi30@gmail.com",
    phone: "00391234567890",
    flyingMinutes: 60,
    availableFrom: "2026-11-03",
    availableTo: "2026-11-07",
    sharingWithSomeone: true,
    companionName: "Pier",
    creditHandling: "share_with_friends",
  });

  GmailApp.sendEmail(
    "fgrandi30@gmail.com",
    subject,
    plain, // plain-text fallback
    {
      htmlBody: html,
      name: "PanCakes Freefly",
    },
  );
}

const EVENT_NAME = {
  it: "Skill Camp Flyspot Gdańsk — Novembre 2026",
  en: "Flyspot Gdańsk Skill Camp — November 2026",
};

const CREDIT_LABELS = {
  it: {
    self_purchase:
      "Acquisterò tutto il credito io. Se acquisto più di quanto intendo volare in questo camp, terrò il credito.",
    share_with_friends:
      "Ho intenzione di condividere il credito con uno o più amici: acquisteremo un pacchetto da 5 o 10 ore e lo useremo tra di noi, non abbiamo bisogno di aiuto per organizzare un acquisto con altri partecipanti.",
    need_help:
      "Vorrei aiuto per acquistare il tempo, e non mi interessa avere credito aggiuntivo sul mio account.",
  },
  en: {
    self_purchase:
      "I'll purchase all the credit myself. If I purchase more than I intend to fly in this camp, I'll keep the credit.",
    share_with_friends:
      "I'm planning on sharing my credit with one or more friends: we'll buy a 5 or 10 hours package and use it between ourselves, we don't need help with organizing a purchase with other participants.",
    need_help:
      "I'd like help purchasing the time, and I'm not interested in additional credit on my account.",
  },
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatFlyingMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return mins + "m";
  if (mins === 0) return hours + "h";
  return hours + "h " + mins + "m";
}

function formatIsoDate(iso, language) {
  const parts = String(iso || "").split("-");
  if (parts.length !== 3) return iso || "";
  const year = parts[0];
  const monthIndex = Number(parts[1]) - 1;
  const day = String(Number(parts[2]));
  const months =
    language === "it"
      ? [
          "gennaio",
          "febbraio",
          "marzo",
          "aprile",
          "maggio",
          "giugno",
          "luglio",
          "agosto",
          "settembre",
          "ottobre",
          "novembre",
          "dicembre",
        ]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
  const month = months[monthIndex];
  if (!month) return iso;
  return language === "it"
    ? day + " " + month + " " + year
    : month + " " + day + ", " + year;
}

function getCreditLabel(language, creditHandling) {
  const labels = CREDIT_LABELS[language] || CREDIT_LABELS.it;
  return labels[creditHandling] || creditHandling;
}

function getEmailBody(language, info) {
  if (language !== "it" && language !== "en") {
    throw new Error(`Language ${language} not supported.`);
  }

  const flyingTime = formatFlyingMinutes(Number(info.flyingMinutes) || 0);
  const creditLabel = getCreditLabel(language, info.creditHandling);
  const dateRange =
    formatIsoDate(info.availableFrom, language) +
    " → " +
    formatIsoDate(info.availableTo, language);
  const fullName = [info.firstName, info.lastName].filter(Boolean).join(" ");
  const sharingLine =
    language === "it"
      ? info.sharingWithSomeone
        ? "Sì — " + (info.companionName || "—")
        : "No"
      : info.sharingWithSomeone
        ? "Yes — " + (info.companionName || "—")
        : "No";

  const copy =
    language === "it"
      ? {
          subject: EVENT_NAME.it,
          greeting: "Ciao",
          registrationLine:
            "Questa mail conferma la ricezione della tua registrazione a " +
            EVENT_NAME.it +
            ".",
          summaryHeading: "Riepilogo",
          name: "Nome",
          email: "Email",
          phone: "Numero di telefono WhatsApp",
          flyingTime: "Ore di volo richieste",
          availableDates: "Date disponibili",
          sharing: "Condivisione con qualcun altro",
          credit: "Gestione credito",
          followUp:
            "Tutte le info servono a esprimere il tuo interesse. Verrai ricontattato in seguito da Pier o Fede per confermare il tuo programma e organizzare il pagamento.",
          thanks: "Grazie!",
          signature: "Pier, Fede",
        }
      : {
          subject: EVENT_NAME.en,
          greeting: "Hi",
          registrationLine:
            "This email confirms we have received your registration for " +
            EVENT_NAME.en +
            ".",
          summaryHeading: "Summary",
          name: "Name",
          email: "Email",
          phone: "WhatsApp phone number",
          flyingTime: "Requested flying time",
          availableDates: "Available dates",
          sharing: "Sharing with someone else",
          credit: "Credit handling",
          followUp:
            "All the info here is to express your interest. You'll be contacted later by either Pier or Fede to confirm your schedule and organize the payment.",
          thanks: "Thanks!",
          signature: "Pier, Fede",
        };

  const summaryLines = [
    copy.name + ": " + fullName,
    copy.email + ": " + info.email,
    copy.phone + ": " + info.phone,
    copy.flyingTime + ": " + flyingTime,
    copy.availableDates + ": " + dateRange,
    copy.sharing + ": " + sharingLine,
    copy.credit + ": " + creditLabel,
  ];

  return {
    subject: copy.subject,
    html: `
<!DOCTYPE html>
<html lang="${language}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Email</title>
  </head>
  <body bgcolor="#0a0a0a" style="margin:0; padding:0; background-color:#0a0a0a;">

    <!-- Full width wrapper -->
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      bgcolor="#0a0a0a"
      style="background-color:#0a0a0a;"
    >
      <tr>
        <td
          align="center"
          bgcolor="#0a0a0a"
          style="background-color:#0a0a0a;"
        >

          <!-- Main container -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="max-width:600px;"
          >
            <!-- Header -->
            <tr>
              <td align="center">
              <img
                src="https://www.pancakesfreefly.com/mail_assets/gdansk-nov26/email_banner.png"
                width="600"
                style="display:block; max-width:600px; width:100%;"
                alt="${escapeHtml(EVENT_NAME[language])}"
              />
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:24px 24px 80px 24px; margin:0 0 16px 0; color:#fff; font-family:'Space Grotesk', Arial, sans-serif; font-size:16px; line-height:1.5;">
                <p>
                  ${copy.greeting} ${escapeHtml(info.firstName)}!<br>
                  ${escapeHtml(copy.registrationLine)}<br><br>
                  <strong>${escapeHtml(copy.summaryHeading)}</strong><br>
                  ${summaryLines.map((line) => escapeHtml(line)).join("<br>")}<br><br>
                  ${escapeHtml(copy.followUp)}<br><br>
                  ${escapeHtml(copy.thanks)}<br>
                  ${escapeHtml(copy.signature)}
                </p>
                <img
                  src="https://www.pancakesfreefly.com/mail_assets/email_signature_white.png"
                  width="120"
                  style="display:block; max-width:150px; width:100%;"
                  alt="Signature"
                />
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

  </body>
</html>`,
    plain: `${copy.greeting} ${info.firstName}!

${copy.registrationLine}

${copy.summaryHeading}
${summaryLines.join("\n")}

${copy.followUp}

${copy.thanks}
${copy.signature}`,
  };
}

function doPost(e) {
  try {
    if (!e) throw new Error("No event provided: " + e);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Iscrizioni");
    if (!sheet) throw new Error("Sheet not found");

    const {
      firstName,
      lastName,
      phone,
      email,
      flyingMinutes,
      availableFrom,
      availableTo,
      sharingWithSomeone,
      companionName,
      creditHandling,
      language,
    } = e.parameter;

    if (!firstName || !lastName || !email || !phone) {
      return generateResponse({
        status: "Error",
        error: "Missing required fields",
      });
    }

    // The code runs pretty fast, so it's very hard to run into concurrency issues.
    // I've added this script lock just for extra safety
    const lock = LockService.getScriptLock();
    const lockAcquired = lock.tryLock(15000);
    if (!lockAcquired) {
      return generateResponse({
        status: "Error",
        error: "Could not acquire lock after 15 seconds.",
      });
    }

    const wantsToShare =
      sharingWithSomeone === true || sharingWithSomeone === "true";

    try {
      const usedRows = sheet
        .getRange("A3:A")
        .getValues()
        .filter((row) => typeof row[0] === "string" && row[0].length > 0).length;
      const targetRow = usedRows + 3;

      sheet.getRange(`A${targetRow}:K${targetRow}`).setValues([
        [
          firstName,
          lastName,
          phone,
          email,
          Number(flyingMinutes) || 0,
          availableFrom,
          availableTo,
          wantsToShare ? "Sì" : "No",
          wantsToShare ? companionName || "" : "",
          creditHandling,
          language === "en" ? "en" : "it",
        ],
      ]);
    } finally {
      lock.releaseLock();
    }

    const userLanguage = language === "en" ? "en" : "it";
    const emailBody = getEmailBody(userLanguage, {
      firstName,
      lastName,
      email,
      phone,
      flyingMinutes: Number(flyingMinutes) || 0,
      availableFrom,
      availableTo,
      sharingWithSomeone: wantsToShare,
      companionName,
      creditHandling,
    });
    GmailApp.sendEmail(
      email,
      emailBody.subject,
      emailBody.plain, // plain-text fallback
      {
        htmlBody: emailBody.html,
        name: "PanCakes Freefly",
      },
    );

    return generateResponse({ status: "OK" });
  } catch (error) {
    return generateResponse({ status: "Error", error: error + "" });
  }
}

function generateResponse(obj) {
  return ContentService.createTextOutput(
    JSON.stringify(obj, null, 2),
  ).setMimeType(ContentService.MimeType.JSON);
}
