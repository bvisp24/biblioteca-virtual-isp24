function doGet(e) {
  const sheet = SpreadsheetApp.openById('1tTfCtb0SJMPtB3diWgYDCV4nfBqWKeQPKdXNM7e31rA').getSheetByName('Hoja1');
  const data = sheet.getDataRange().getValues();
  
  // Organizar los datos en un objeto
  const jsonData = [];
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    const rowObj = {};
    for (let j = 0; j < headers.length; j++) {
      rowObj[headers[j]] = data[i][j];
    }
    jsonData.push(rowObj);
  }
  
  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}