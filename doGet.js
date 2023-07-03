function doGet(request) {
  // Open Google Sheet using ID
  var sheet = SpreadsheetApp.openById("18zixbjbJl8wOB_lCbZWWPHLxuQyKE4TebkgODHaiF1k");

  // Get all values in active sheet
  //var values = sheet.getActiveSheet().getDataRange().getValues();

  var headerRowNumber = 0;
  //var values = sheet.getDataRange().offset(headerRowNumber, 0, sheet.getLastRow() - headerRowNumber).getValues();

  //Primeiro para ultimo
  var values = sheet.getSheetByName('repeaters').getDataRange().offset(headerRowNumber, 0, sheet.getLastRow()).getValues();

  //Ultimo para o primeiro;
  //var values = sheet.getSheetByName('repeaters').getDataRange().offset(headerRowNumber, 0, sheet.getLastRow() - headerRowNumber).getValues();

  var data = [];

  //(var i = 1; i < data.length; i++) //Primeiro para Ultimo;
  //(var i = values.length - 1; i >= 0; i--)
  for (var i = 1; i < values.length; i++) {

    // Get each row
    var row = values[i];

    // Create object
    var feedback = {};

    feedback['callsign'] = row[0];
    feedback['tx'] = row[1];

    // Push each row object in data
    data.push(feedback);
  }

  // Return result
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
