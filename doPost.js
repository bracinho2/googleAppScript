function doPost(request) {
  // Open Google Sheet using ID
  var sheet = SpreadsheetApp.openById("18zixbjbJl8wOB_lCbZWWPHLxuQyKE4TebkgODHaiF1k");

  try {

    var values = JSON.parse(request.postData.contents);

    var sheetName = values.sheet;

    var callsign = values.data.callsign;
    var tx = values.data.tx;

    // Append data on Google Sheet
    sheet.getSheetByName(sheetName).appendRow([callsign, tx]);

  } catch (exc) {

    result = { "status": "FAILED", "message": exc };
  }

  // Return result
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);

  var result = { "status": "SUCESS" };
}