function importAndFilterData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName('User');
  const qcTaskSheet = ss.getSheetByName('QC Task');
  const auditScoreSheet = ss.getSheetByName('Audit Score');

  if (!userSheet || !qcTaskSheet || !auditScoreSheet) {
    console.error('One or more required sheets are missing.');
    return;
  }

  // Get filter criteria from the 'User' sheet
  const userData = userSheet.getDataRange().getValues();
  const qcFilterCriteria = userData.map(row => row[0]).filter(String); // Column A values
  const auditFilterCriteria = userData.map(row => row[1]).filter(String); // Column B values

  // Import and filter data for QC Task
  importFilteredData('11-UJCuq-KYfUNTiFC8LxhSnzvdJbEEQ_ChyaKwFU19c', 'QC Raw Data', qcTaskSheet, qcFilterCriteria, 0);

  // Import and filter data for Audit Score
  importFilteredData('1OsWLgFhqZ7KVLLSMAM0dmrlsgnohbduJzRu-VdaLdYA', 'Review', auditScoreSheet, auditFilterCriteria, 2);
}

function importFilteredData(sourceSpreadsheetId, sourceSheetName, destinationSheet, filterCriteria, filterColumnIndex) {
  const sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetId);
  const sourceSheet = sourceSpreadsheet.getSheetByName(sourceSheetName);

  if (!sourceSheet) {
    console.error(`Sheet ${sourceSheetName} not found in the source spreadsheet.`);
    return;
  }

  const sourceData = sourceSheet.getDataRange().getValues();
  const headers = sourceData[0];
  const filteredData = sourceData.filter((row, index) => {
    if (index === 0) return false; // Skip header row
    return filterCriteria.includes(row[filterColumnIndex]);
  });

  // Clear existing data and set new data
  destinationSheet.clearContents();
  destinationSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (filteredData.length > 0) {
    destinationSheet.getRange(2, 1, filteredData.length, headers.length).setValues(filteredData);
  }
}

