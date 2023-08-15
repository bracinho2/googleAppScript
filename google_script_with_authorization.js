const json_read_example = {
    "folder": "1gJw9AvayANjsHq4Z-WSvgpIsX9TzmBSHFiTpLHila14",
    "sheet": "autos",
    "password": "password",
    "action": "read_autos"
}

const json_save_example = {
    "folder": "1gJw9AvayANjsHq4Z-WSvgpIsX9TzmBSHFiTpLHila14",
    "sheet": "autos",
    "password": "password",
    "action": "save_autos",
    "data": [
        {
            "manufacturer": "Volkswagen",
            "model": "Fusca",
            "year": "1977"
        }
    ]
}

const Action = {
    READ_AUTOS: 'read_autos',
    SAVE_AUTOS: 'save_autos',
};


function doPost(request) {

    var json = JSON.parse(request.postData.contents);

    if (authentication(json.password)) {

        result = { "status": "FAILED", "message": "Unauthorized" };

        console.log(result);

        return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

    }

    if (Action.READ_AUTOS == json.action) {
        var result = doGet(json);

        return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

    } else if (Action.SAVE_AUTOS == json.action) {

        saveCar(json);

        result = { "status": "SUCCESS", "message": "Authorized" };

        console.log(result);

        return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

    } else {
        //New method;
    }
}

function authentication(password, method) {

    const AUTH_KEY = 'password';

    return AUTH_KEY != password;
}

/// SAVE CAR

function saveCar(json) {
    console.log(json);
    var sheetId = SpreadsheetApp.openById(json.folder);
    var sheetName = json.sheet;

    var values = json.data;

    for (var i = 0; i < values.length; i++) {
        var value = values[i];

        var manufacturer = value.manufacturer;
        var model = value.model;
        var year = value.year;

        sheetId.getSheetByName(sheetName).appendRow([manufacturer, model, year]);
    }
}

/// SAVE CAR

/// GET CAR FILTERS;
function doGet(json) {
    var sheetId = SpreadsheetApp.openById(json.folder);

    var headerRowNumber = 1;

    var data = sheetId.getSheetByName(json.sheet).getDataRange().offset(headerRowNumber, 0, sheetId.getLastRow()).getValues();
    var jsonData = [];

    var currentManufacturer = null;
    var currentModels = [];

    for (var i = 0; i < data.length; i++) {
        var manufacturer = data[i][0];
        var model = data[i][1];
        var year = data[i][2];

        if (manufacturer !== "") {
            if (currentManufacturer !== null) {
                jsonData.push({
                    manufacturer: currentManufacturer,
                    models: currentModels
                });
            }

            currentManufacturer = manufacturer;
            currentModels = [];
        }

        if (model !== "") {
            var existingModel = currentModels.find(function (m) {
                return m.model === model;
            });

            if (existingModel) {
                existingModel.years.push(year);
            } else {
                currentModels.push({
                    model: model,
                    years: [year]
                });
            }
        }
    }

    if (currentManufacturer !== null) {
        jsonData.push({
            manufacturer: currentManufacturer,
            models: currentModels
        });
    }

    var groupedData = groupData(jsonData);

    var jsonString = JSON.stringify(groupedData, null, 2);

    return groupedData;

}

function groupData(data) {
    var grouped = [];
    var manufacturers = [];

    data.forEach(function (item) {
        var manufacturerIndex = manufacturers.indexOf(item.manufacturer);
        if (manufacturerIndex === -1) {
            manufacturerIndex = manufacturers.push(item.manufacturer) - 1;
            grouped.push({
                manufacturer: item.manufacturer,
                models: []
            });
        }

        var modelsArray = grouped[manufacturerIndex].models;

        item.models.forEach(function (modelItem) {
            var existingModel = modelsArray.find(function (m) {
                return m.model === modelItem.model;
            });

            if (existingModel) {
                existingModel.years = existingModel.years.concat(modelItem.years);
            } else {
                modelsArray.push({
                    model: modelItem.model,
                    years: modelItem.years
                });
            }
        });
    });
    console.log(JSON.stringify(grouped, null, 2));
    return grouped;
}

//GET CAR FILTERS;
