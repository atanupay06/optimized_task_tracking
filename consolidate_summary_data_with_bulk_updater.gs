function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔧 Sheet Tools')
    .addItem('Import Data Now', 'updateSummaryData')
    .addItem('Apply Updates', 'applySheetUpdates')
    .addToUi();
}
// Main function to import data
function updateSummaryData() {
  // Get the active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the Team_Details sheet
  var teamDetailsSheet = ss.getSheetByName('Team_Details');
  
  // Get the RAW2 sheet (destination)
  var raw2Sheet = ss.getSheetByName('RAW2');

  // // Clear existing data in RAW2 (preserve header row) line 25-48 Existing
  // var lastRow = raw2Sheet.getLastRow();
  // if (lastRow > 1) {
  //   raw2Sheet.getRange(2, 1, lastRow - 1, raw2Sheet.getLastColumn()).clear();
  // }
  
  // Clear existing data in RAW2 (preserve header row)
  var lastRow = raw2Sheet.getLastRow();
  var existingData = lastRow > 1
    ? raw2Sheet.getRange(2, 1, lastRow - 1, raw2Sheet.getLastColumn()).getValues()
    : [];

  // Function to compare two rows
  function rowsEqual(row1, row2) {
    return JSON.stringify(row1) === JSON.stringify(row2);
  }

  // Add only new or changed rows to outputData
  var outputData = [];
  if (allData && allData.length > 0) {
    allData.forEach(function(row) {
      var match = existingData.find(existing => rowsEqual(existing, row));
      if (!match) outputData.push(row);
    });

    // Append only new data
    if (outputData.length > 0) {
      raw2Sheet.getRange(raw2Sheet.getLastRow() + 1, 1, outputData.length, outputData[0].length).setValues(outputData);
    }
  }

  
  // Get sheet URLs from Team_Details
  var sheetUrls = teamDetailsSheet.getRange('A2:A30').getValues();
  
  // Array to store all data
  var allData = [];
  
  // Process each sheet URL
  sheetUrls.forEach(function(url) {
    if (url[0] !== '') {
      try {
        // Open the spreadsheet from URL
        var sourceSheet = SpreadsheetApp.openByUrl(url[0]);
        var summarySheet = sourceSheet.getSheetByName('Summary');
        
        if (summarySheet) {
          // Get data from Summary sheet
          var data = summarySheet.getRange('A2:S' + summarySheet.getLastRow()).getValues();
          
          // Filter out rows where both first and second columns are blank
          var filteredData = data.filter(function(row) {
            return !(row[0] === '' && row[1] === '');
          });
          
          // Add filtered data to allData array
          allData = allData.concat(filteredData);
        }
      } catch (e) {
        Logger.log('Error processing sheet: ' + url[0] + ' Error: ' + e.toString());
      }
    }
  });
  
  // Write consolidated data to RAW2 sheet
  if (allData.length > 0) {
    raw2Sheet.getRange(2, 1, allData.length, allData[0].length).setValues(allData);
  }
}

// Function to trigger automatic update every minute
function createTrigger() {
  // Delete existing triggers
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  
  // Create new trigger
  ScriptApp.newTrigger('importDataFromSheets')
    .timeBased()
    .everyMinutes(1)
    .create();
}

// Function to remove trigger if needed
function removeTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
}


function applySheetUpdates() {
  const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dataRange = masterSheet.getDataRange();
  const data = dataRange.getValues();

  for (let i = 1; i < data.length; i++) {
    const [sheetUrl, tabName, rangeA1, newValue] = data[i];

    if (!sheetUrl || !tabName || !rangeA1 || newValue === undefined) continue;

    try {
      const sheetId = extractSheetId(sheetUrl);
      const targetSpreadsheet = SpreadsheetApp.openById(sheetId);
      const targetSheet = targetSpreadsheet.getSheetByName(tabName);

      if (!targetSheet) {
        Logger.log(`Tab "${tabName}" not found in ${sheetUrl}`);
        continue;
      }

      const targetRange = targetSheet.getRange(rangeA1);
      targetRange.setValue(newValue);
    } catch (error) {
      Logger.log(`Error processing row ${i + 1}: ${error}`);
    }
  }

  SpreadsheetApp.getUi().alert('Updates applied successfully.');
}

function extractSheetId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

