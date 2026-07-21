function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function doGet(e) {
  const sheetCitas = getOrCreateSheet('Citas', ['id', 'controlNumber', 'title', 'targetDate', 'actualDate', 'paymentAmount', 'notes', 'status']);
  const sheetCepillos = getOrCreateSheet('Cepillos', ['id', 'name', 'purchaseDate', 'lifespanMonths']);
  
  const readData = (sheet) => {
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    const headers = data[0];
    return data.slice(1).map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
  };
  
  const result = {
    citas: readData(sheetCitas),
    cepillos: readData(sheetCepillos)
  };
  
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const action = payload.action; 
  const data = payload.data;
  
  const sheetCitas = getOrCreateSheet('Citas', ['id', 'controlNumber', 'title', 'targetDate', 'actualDate', 'paymentAmount', 'notes', 'status']);
  const sheetCepillos = getOrCreateSheet('Cepillos', ['id', 'name', 'purchaseDate', 'lifespanMonths']);
  
  if (action === 'seed') {
     data.forEach(item => sheetCitas.appendRow([item.id, item.controlNumber, item.title, item.targetDate, item.actualDate, item.paymentAmount, item.notes, item.status]));
  } else if (action === 'add_cita') {
     sheetCitas.appendRow([data.id, data.controlNumber, data.title, data.targetDate, data.actualDate, 0, '', 'scheduled']);
  } else if (action === 'complete_cita') {
     const rows = sheetCitas.getDataRange().getValues();
     for(let i = 1; i < rows.length; i++) {
        if(rows[i][0] == data.id) {
           sheetCitas.getRange(i + 1, 6).setValue(data.paymentAmount); // F: paymentAmount
           sheetCitas.getRange(i + 1, 7).setValue(data.notes);         // G: notes
           sheetCitas.getRange(i + 1, 8).setValue('completed');        // H: status
           break;
        }
     }
  } else if (action === 'add_cepillo') {
     sheetCepillos.appendRow([data.id, data.name, data.purchaseDate, data.lifespanMonths]);
  } else if (action === 'delete_cepillo') {
     const rows = sheetCepillos.getDataRange().getValues();
     for(let i = 1; i < rows.length; i++) {
        if(rows[i][0] == data.id) {
           sheetCepillos.deleteRow(i + 1);
           break;
        }
     }
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
}