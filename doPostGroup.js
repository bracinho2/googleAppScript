function doPost(request) {
    // Open Google Sheet using ID
    var sheet = SpreadsheetApp.openById("18zixbjbJl8wOB_lCbZWWPHLxuQyKE4TebkgODHaiF1k");

    var json = JSON.parse(request.postData.contents);

    if (json.password != 'sulina') {

        result = { "status": "FAILED", "message": "Unauthorized" };

        return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
    } else {
        try {

            var sheetName = json.sheet;

            var values = json.data;

            for (var i = 0; i < values.length; i++) {
                var value = values[i];

                var callsign = value.callsign;
                var tx = value.tx;

                // Append data on Google Sheet
                sheet.getSheetByName(sheetName).appendRow([callsign, tx]);

            }

        } catch (exc) {

            result = { "status": "FAILED", "message": exc };
        }


        var result = { "status": "SUCCESS" };
        // Return result
        return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
    }

}