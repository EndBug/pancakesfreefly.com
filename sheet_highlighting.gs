// Compiled using gas-sheets-highlighting 1.0.0 (TypeScript 4.9.5)
var exports = exports || {};
var module = module || { exports: exports };
exports.enforceType = void 0;
var DEBUG = false;
var WEEKS = 1,
  DAYS_PER_WEEK = 7,
  FIRST_DAY = new Date("2026-11-02");
var editors = [
  "team@pancakesfreefly.com",
  "fgrandi30@gmail.com",
  "me@federicograndi.dev",
];
var themeColors = {
  green: "#34a853",
  yellow: "#fbbc04",
  red: "#ff0000",
  darkPurple: "#540046",
};
var timeModifiers = {
  ">": themeColors.green,
  "~": themeColors.yellow,
  "<": themeColors.red,
  "!": themeColors.darkPurple,
};
/** Gets the array of named ranges relative to the days in the schedule */
function getDayRanges(sheetPrefix) {
  var dayRanges = [];
  for (var w = 0; w < WEEKS; w++) {
    for (var d = 0; d < DAYS_PER_WEEK; d++) {
      var prefix = sheetPrefix ? "'".concat(sheetPrefix, "'!") : "";
      dayRanges.push(prefix + "w".concat(w + 1, "d").concat(d + 1));
    }
  }
  return dayRanges
    .map(function (name) {
      return SpreadsheetApp.getActiveSpreadsheet().getRangeByName(name);
    })
    .filter(function (e) {
      return e !== null;
    });
}
/** Enforces a type by returning always `true`; you need to use this with a type guard
 * @example if (!enforceType<YourType>(parameter)) return;
 */
function enforceType(_parameter) {
  return true;
}
exports.enforceType = enforceType;
/** @returns [backgound, font] */
function getColors(background) {
  var font = getTextContrast(background);
  return [background, font];
}
/**
 * Converts a column number to its A1 notation
 * @param column The column number to convert (1-indexed)
 */
function getColumnA1Notation(column) {
  var div = Math.floor((column - 1) / 26);
  var mod = (column - 1) % 26;
  var letter = String.fromCharCode(65 + mod);
  return div > 0 ? getColumnA1Notation(div) + letter : letter;
}
/**
 * Converts a range to its A1 notation
 * @param startRow The start row of the range
 * @param startColumn The start column of the range
 * @param endRow The end row of the range
 * @param endColumn The end column of the range
 * @returns The A1 notation of the range
 */
function getRangeA1Notation(
  startRow,
  startColumn,
  endRow,
  endColumn,
  constant,
) {
  if (constant === void 0) {
    constant = false;
  }
  return (
    (constant ? "$" : "") +
    getColumnA1Notation(startColumn) +
    (constant ? "" : startRow) +
    ":" +
    (constant ? "$" : "") +
    getColumnA1Notation(endColumn) +
    (constant ? "" : endRow)
  );
}
function getParticipantColors() {
  var _a;
  var values =
    (_a = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Coaching")) ===
      null || _a === void 0
      ? void 0
      : _a
          .getRange("A2:B")
          .getValues()
          .filter(function (_a) {
            var name = _a[0];
            return name;
          });
  if (!values) throw new Error("Can't find color info");
  return Object.fromEntries(
    values.map(function (_a) {
      var name = _a[0],
        background = _a[1];
      return [name, getColors(background)];
    }),
  );
}
function refreshColorRules() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error("Failed to lock");
  var participantColors = getParticipantColors();
  var green = getColors(themeColors.green),
    red = getColors(themeColors.red),
    yellow = getColors(themeColors.yellow);
  var sheets = {
    schedule: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Schedule"),
    confirmedSchedule:
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        "Confirmed Schedule",
      ),
    payments: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Payments"),
    coaching: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Coaching"),
    reserved: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Reserved"),
    slotDiff: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Slot diff"),
  };
  var dayRanges = getDayRanges("Schedule");
  var confirmedDayRanges = getDayRanges("Confirmed Schedule");
  for (var sheet in sheets) {
    if (!sheets[sheet]) throw new Error("Can't find ".concat(sheet, " sheet"));
  }
  var rules = {
    schedule: [],
    confirmedSchedule: [],
    coaching: [],
    payments: [],
    reserved: [],
    slotDiff: [],
  };
  var fullRanges = {};
  for (var sheet in sheets) {
    if (!enforceType(sheet)) throw new Error("Invalid sheet ".concat(sheet));
    fullRanges[sheet] = sheets[sheet].getRange(
      1,
      1,
      sheets[sheet].getMaxRows(),
      sheets[sheet].getMaxColumns(),
    );
  }
  //#region Participant colors
  // First of all, add the filter rule for the schedule
  rules.schedule.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(
        "=AND(NOT(ISBLANK($"
          .concat(
            getColumnA1Notation(sheets.schedule.getMaxColumns() - 3),
            "$2)), NOT(EQ($",
          )
          .concat(
            getColumnA1Notation(sheets.schedule.getMaxColumns() - 3),
            "$2, ",
          )
          .concat(dayRanges[0].getCell(1, 1).getA1Notation(), ")))"),
      )
      .setFontColor("#bdbdbd")
      .setBackground("#fff")
      .setRanges(dayRanges)
      .build(),
  );
  // Add the confirmation rule for the confirmed schedule
  rules.confirmedSchedule.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(
        '=COUNTIF(INDIRECT("Utilities!C2:C"), '.concat(
          confirmedDayRanges[0].getCell(1, 1).getA1Notation(),
          ")=0",
        ),
      )
      .setFontColor("#bdbdbd")
      .setBackground("#fff")
      .setRanges(confirmedDayRanges)
      .build(),
  );
  for (var name in participantColors) {
    var _a = participantColors[name],
      background = _a[0],
      font = _a[1];
    var ruleBase = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(name)
      .setBackground(background)
      .setFontColor(font)
      .setBold(false);
    // Then, add color rules for schedule and coaching
    rules.schedule.push(
      ruleBase.copy().setRanges([fullRanges.schedule]).build(),
    );
    rules.confirmedSchedule.push(
      ruleBase.copy().setRanges([fullRanges.confirmedSchedule]).build(),
    );
    rules.coaching.push(
      ruleBase.copy().setRanges([fullRanges.coaching]).build(),
    );
    rules.payments.push(
      ruleBase.copy().setRanges([fullRanges.payments]).build(),
    );
    rules.coaching.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(background)
        .setBackground(background)
        .setFontColor(background)
        .setRanges([fullRanges.coaching])
        .build(),
    );
  }
  //#endregion
  //#region Planning incomplete warnings
  for (var _i = 0, dayRanges_1 = dayRanges; _i < dayRanges_1.length; _i++) {
    var dayRange = dayRanges_1[_i];
    rules.schedule.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(
          "=EQ(OFFSET(".concat(
            dayRange.getA1Notation(),
            ", -1, -1, 1, 1), FALSE)",
          ),
        )
        .setBackground(yellow[0])
        .setFontColor(yellow[1])
        .setRanges([dayRange.offset(-2, -1, 1, 1)])
        .build(),
    );
  }
  rules.schedule.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenCellNotEmpty()
      .setBackground(yellow[0])
      .setFontColor(yellow[1])
      .setRanges([sheets.schedule.getRange("A2")])
      .build(),
  );
  //#endregion
  //#region Schedule block modifiers
  for (var modifier in timeModifiers) {
    var background = getColors(timeModifiers[modifier])[0];
    var ruleBase = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=A1="'.concat(modifier, '"'))
      .setBackground(background)
      .setFontColor(background);
    rules.schedule.push(
      ruleBase.copy().setRanges([fullRanges.schedule]).build(),
    );
    rules.confirmedSchedule.push(
      ruleBase.copy().setRanges([fullRanges.confirmedSchedule]).build(),
    );
    rules.reserved.push(
      ruleBase.copy().setRanges([fullRanges.reserved]).build(),
    );
    rules.slotDiff.push(
      ruleBase.copy().setRanges([fullRanges.slotDiff]).build(),
    );
  }
  //#endregion
  //#region Slot diffs
  for (var modifier in timeModifiers) {
    var _b = getColors(timeModifiers[modifier]),
      background = _b[0],
      font = _b[1];
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(
        '=INDIRECT("Slot diff!" & ADDRESS(ROW(), COLUMN()))="'.concat(
          modifier,
          '"',
        ),
      )
      .setBackground(background)
      .setFontColor(font)
      .setRanges([fullRanges.schedule])
      .build();
    rules.schedule.push(rule);
  }
  //#endregion
  //#region Booking status
  var bookingRanges = {
    coaching:
      SpreadsheetApp.getActiveSpreadsheet().getRangeByName("Coaching.Booking"),
  };
  for (var sheet in bookingRanges) {
    if (!enforceType(sheet)) throw new Error("Invalid sheet ".concat(sheet));
    var range = bookingRanges[sheet];
    if (!range) throw new Error("Can't find ".concat(sheet, " booking range"));
    var lastCol = getColumnA1Notation(range.getLastColumn());
    rules[sheet].push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied("=$".concat(lastCol, '1="0h"'))
        .setFontColor(green[1])
        .setBackground(green[0])
        .setRanges([range])
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied("=$".concat(lastCol, '1="OVERBOOKED"'))
        .setFontColor(red[1])
        .setBackground(red[0])
        .setRanges([range])
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(
          "=AND(NOT($"
            .concat(lastCol, '1="0h"), NOT($')
            .concat(lastCol, '1="OVERBOOKED"), NOT($')
            .concat(lastCol, '1=""), NOT(ROW()=1))'),
        )
        .setFontColor(yellow[1])
        .setBackground(yellow[0])
        .setRanges([range])
        .build(),
    );
  }
  //#endregion
  //#region Payments
  var paymentRanges = {
    coaching:
      SpreadsheetApp.getActiveSpreadsheet().getRangeByName(
        "Coaching.Remaining",
      ),
  };
  for (var sheet in paymentRanges) {
    if (!enforceType(sheet)) throw new Error("Invalid sheet ".concat(sheet));
    var range = paymentRanges[sheet];
    if (!range) throw new Error("Can't find ".concat(sheet, " payment range"));
    rules[sheet].push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenNumberEqualTo(0)
        .setFontColor(green[1])
        .setBackground(green[0])
        .setRanges([range])
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenNumberGreaterThan(0)
        .setFontColor(yellow[1])
        .setBackground(yellow[0])
        .setRanges([range])
        .build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenNumberLessThan(0)
        .setFontColor(red[1])
        .setBackground(red[0])
        .setRanges([range])
        .build(),
    );
  }
  //#endregion
  for (var sheet in sheets) {
    if (DEBUG) console.log("Applying rules to", sheet, rules[sheet]);
    sheets[sheet].setConditionalFormatRules(rules[sheet]);
  }
  lock.releaseLock();
}
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Custom")
    .addItem("Refresh color rules", "refreshColorRules")
    .addToUi();
}
/**
 * Converts a hex color to an RGB object
 * @param hex The hex color to convert, must be in the format `#RRGGBB`
 * @returns An object with the `r`, `g`, and `b` values of the color, or `null` when not found
 */
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var replaced = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
/**
 * Gets the correct contrast color for the given background color
 * @param hexBackground The hex of the background color to check
 * @returns Either black or white
 */
function getTextContrast(hexBackground) {
  var rgb = hexToRgb(hexBackground);
  if (!rgb) return "#000";
  var r = rgb.r,
    g = rgb.g,
    b = rgb.b;
  var brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000" : "#FFF";
}
function reInitialize() {
  if (DAYS_PER_WEEK < 1 || DAYS_PER_WEEK > 7)
    throw new Error("Invalid days per week");
  if (WEEKS < 1 || WEEKS > 3) throw new Error("Invalid weeks");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Delete schedule sheets, if they exist
  for (
    var _i = 0,
      _a = ["Schedule", "Confirmed Schedule", "Reserved", "Slot diff"];
    _i < _a.length;
    _i++
  ) {
    var name = _a[_i];
    var sheet = ss.getSheetByName(name);
    if (sheet) {
      ss.deleteSheet(sheet);
    }
  }
  // Create base sheet
  var template = ss.getSheetByName("col_template");
  if (!template) throw new Error("Can't find template sheet");
  var scheduleSheet = ss.insertSheet("Schedule", 1, { template: template });
  // Reset coaching sheet
  var coachingSheet = ss.getSheetByName("Coaching");
  if (!coachingSheet) throw new Error("Can't find coaching sheet");
  coachingSheet.getRange("A2:A").clearContent();
  coachingSheet.getRange("C2:C").clearContent();
  coachingSheet.getRange("D2:D").setValue(false);
  coachingSheet.getRange("E2:F").clearContent();
  coachingSheet.getRange("G2:G").setValue(false);
  coachingSheet
    .getRange("H2:H")
    .copyValuesToRange(coachingSheet, 8, 8, 2, coachingSheet.getMaxRows()); // Copy to force recalculation
  // Reduce template
  var targetColumns = 7 * DAYS_PER_WEEK + 1;
  var targetRows = 2 + 52 * WEEKS;
  if (template.getMaxColumns() > targetColumns) {
    scheduleSheet.deleteColumns(
      targetColumns + 1,
      template.getMaxColumns() - targetColumns,
    );
  }
  if (template.getMaxRows() > targetRows) {
    scheduleSheet.deleteRows(
      targetRows + 1,
      template.getMaxRows() - targetRows,
    );
  }
  // Create named ranges
  /**
   * A matrix of day ranges, where the first dimension is the week and the second dimension is the day
   * @example [
   *  [ 'w1d1', 'w1d2', 'w1d3', 'w1d4', 'w1d5', 'w1d6', 'w1d7' ],
   *  [ 'w2d1', 'w2d2', 'w2d3', 'w2d4', 'w2d5', 'w2d6', 'w2d7' ],
   *  [ 'w3d1', 'w3d2', 'w3d3', 'w3d4', 'w3d5', 'w3d6', 'w3d7' ]
   * ]
   */
  var dayRanges = [];
  for (var week = 0; week < WEEKS; week++) {
    dayRanges.push([]);
    for (var day = 0; day < DAYS_PER_WEEK; day++) {
      var name = "w".concat(week + 1, "d").concat(day + 1);
      dayRanges[week].push(name);
      var topLeftRow = 6 + week * 52;
      var topLeftColumn = 3 + 7 * day;
      var bottomRightRow = topLeftRow + 47;
      var bottomRightColumn = topLeftColumn + 1;
      ss.setNamedRange(
        name,
        scheduleSheet.getRange(
          getRangeA1Notation(
            topLeftRow,
            topLeftColumn,
            bottomRightRow,
            bottomRightColumn,
          ),
        ),
      );
    }
  }
  // Set dates
  for (var week = 0; week < WEEKS; week++) {
    for (var day = 0; day < DAYS_PER_WEEK; day++) {
      var date = new Date(
        FIRST_DAY.getTime() +
          week * 7 * 24 * 60 * 60 * 1000 +
          day * 24 * 60 * 60 * 1000,
      );
      scheduleSheet.getRange(4 + week * 52, 2 + 7 * day).setValue(date);
    }
  }
  // Set header rows
  scheduleSheet
    .getRange("1:1")
    .mergeAcross()
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "black",
      SpreadsheetApp.BorderStyle.SOLID,
    );
  scheduleSheet
    .getRange(getRangeA1Notation(2, 1, 2, scheduleSheet.getMaxColumns() - 5))
    .mergeAcross();
  scheduleSheet
    .getRange(
      getRangeA1Notation(
        2,
        scheduleSheet.getMaxColumns() - 3,
        2,
        scheduleSheet.getMaxColumns(),
      ),
    )
    .mergeAcross()
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "black",
      SpreadsheetApp.BorderStyle.SOLID,
    )
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInRange(ss.getSheetByName("Coaching").getRange("A2:A"))
        .setAllowInvalid(false)
        .build(),
    );
  scheduleSheet
    .getRange(
      getRangeA1Notation(
        2,
        scheduleSheet.getMaxColumns() - 4,
        2,
        scheduleSheet.getMaxColumns() - 4,
      ),
    )
    .setValue("Filter by:")
    .setFontWeight("bold")
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "black",
      SpreadsheetApp.BorderStyle.SOLID,
    );
  // Hide planning incomplete rows
  for (var week = 0; week < WEEKS; week++) {
    var row = 5 + week * 52;
    scheduleSheet.hideRows(row);
  }
  // Duplicate sheets
  var confirmedSheet = ss.insertSheet("Confirmed Schedule", 2, {
    template: scheduleSheet,
  });
  confirmedSheet
    .getRange("3:".concat(confirmedSheet.getMaxRows()))
    .clearDataValidations();
  var reservedSheet = ss.insertSheet("Reserved", 3, {
    template: confirmedSheet,
  });
  var slotDiffSheet = ss.insertSheet("Slot diff", 4, {
    template: confirmedSheet,
  });
  // Protect sheets
  scheduleSheet
    .protect()
    .setUnprotectedRanges([
      scheduleSheet.getRange(
        getRangeA1Notation(
          2,
          scheduleSheet.getMaxColumns() - 3,
          2,
          scheduleSheet.getMaxColumns(),
        ),
      ),
    ])
    .addEditors(editors);
  confirmedSheet.protect().addEditors(editors);
  reservedSheet.protect().addEditors(editors);
  slotDiffSheet.protect().addEditors(editors);
  // Add "day planned" formulas to schedule
  for (var week = 0; week < WEEKS; week++) {
    for (var day = 0; day < DAYS_PER_WEEK; day++) {
      scheduleSheet
        .getRange(5 + week * 52, 2 + 7 * day)
        .setFormula("=IS_DAY_PLANNED(".concat(dayRanges[week][day], ")"));
    }
  }
  // Add link from schedule to confirmed schedule
  confirmedSheet
    .getRange("3:".concat(confirmedSheet.getMaxRows()))
    .clearContent();
  confirmedSheet.getRange("A1").setValue("CONFIRMED SCHEDULE");
  confirmedSheet
    .getRange("A3")
    .setFormula(
      "=ARRAYFORMULA(Schedule!A3:"
        .concat(getColumnA1Notation(scheduleSheet.getMaxColumns()))
        .concat(scheduleSheet.getMaxRows(), ")"),
    );
  // Set titles for other sheets
  reservedSheet.getRange("A1").setValue("RESERVED");
  slotDiffSheet.getRange("A1").setValue("SLOT DIFF");
  // Add slot diff rules
  for (var week = 0; week < WEEKS; week++) {
    for (var day = 0; day < DAYS_PER_WEEK; day++) {
      var diffFormulaRange = getRangeA1Notation(
        6 + week * 52,
        3 + 7 * day,
        6 + week * 52,
        4 + 7 * day,
      );
      slotDiffSheet
        .getRange(
          getRangeA1Notation(
            6 + week * 52,
            2 + 7 * day,
            53 + week * 52,
            2 + 7 * day,
          ),
        )
        .setFormula(
          "=IFS(SUM("
            .concat(diffFormulaRange, ')>0, ">", SUM(')
            .concat(diffFormulaRange, ')<0, "!", SUM(')
            .concat(diffFormulaRange, ')=0, "<")'),
        );
      slotDiffSheet
        .getRange(
          getRangeA1Notation(
            6 + week * 52,
            3 + 7 * day,
            53 + week * 52,
            4 + 7 * day,
          ),
        )
        .setFormula("=GET_SLOT_DIFF()");
      slotDiffSheet
        .getRange(
          getRangeA1Notation(
            6 + week * 52,
            7 + 7 * day,
            53 + week * 52,
            7 + 7 * day,
          ),
        )
        .clearContent();
    }
  }
  // Hide slot diff
  slotDiffSheet.hideSheet();
  // Flush, for good measure
  SpreadsheetApp.flush();
  // Refresh color rules
  refreshColorRules();
}

// ---------------------------------------------------------------------------
// Registration emails (Flyspot Gdańsk — Nov 2026)
// Expects an "Iscrizioni" sheet with headers in rows 1–2 and data from row 3:
// Nome | Cognome | Telefono | Email | Minuti volo | Disponibile da |
// Disponibile a | Condivisione | Compagno | Credito | Lingua
// ---------------------------------------------------------------------------

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
    const sheet = ss.getSheetByName("Registrations");
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
        .filter(
          (row) => typeof row[0] === "string" && row[0].length > 0,
        ).length;
      const targetRow = usedRows + 3;

      sheet
        .getRange(`A${targetRow}:K${targetRow}`)
        .setValues([
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
