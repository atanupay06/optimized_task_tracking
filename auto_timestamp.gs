function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  
  // Apply restrictions only to sheet "2025"
  if (sheet.getName() !== "2025") return;

  var range = e.range;
  var row = range.getRow();
  var column = range.getColumn();
  var numRows = range.getNumRows();

  // Restricted Columns: A:F and J
  var restrictedColumns = [6, 9];

  // Detect Dragging or Copy-Pasting and Reset Entire Rows
  if (restrictedColumns.includes(column) && detectCopyPasteOrDrag(e, sheet)) {
    Browser.msgBox("Copy-pasting and dragging are not allowed in columns A to F and J. Please enter data manually.");
    
    // Reset ALL affected rows to blank
    sheet.getRange(row, column, numRows).clearContent(); 
    return;
  }

  // Ensure A:E are filled before allowing email selection in F
  if (column === 6) { // Email Column (F)
    for (var i = 1; i <= 5; i++) {
      if (!sheet.getRange(row, i).getValue()) {
        Browser.msgBox("Please fill in the tracker properly before entering an email.");
        sheet.getRange(row, column).setValue(""); // Reset email entry
        return;
      }
    }

    // Assign Timestamp when email is entered
    var currentEmail = range.getValue();
    var previousEmail = e.oldValue;
    var currentTime = new Date();

    if (currentEmail !== "" && currentEmail !== previousEmail) {
      sheet.getRange(row, 12).setValue(currentTime); // Assignment Timestamp (M)
      sendEmailNotification(currentEmail);
    }
  }
  var threshold1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User").getRange("C1").getValue();
  // Auto-fill Time Taken & SLA when J = "Done", "Invalid", or "Tool Issue"
  var validStatuses = ["done", "invalid"];
  if (column === 9 && validStatuses.includes(range.getValue().toLowerCase())) {
    var fixedTimeTaken = threshold1; // Fixed time in minutes

    sheet.getRange(row, 10).setValue(fixedTimeTaken.toFixed(2));
    sheet.getRange(row, 11).setValue(fixedTimeTaken.toFixed(2)); // FP Total Time Taken (L)
    sheet.getRange(row, 13).setValue(calculateSLA(fixedTimeTaken)); // SLA (N)
  }
}

// Detect Copy-Paste & Dragging
function detectCopyPasteOrDrag(e, sheet) {
  var range = e.range;
  var validation = range.getDataValidation();
  
  // Allow dropdown selections in J
  if (range.getColumn() === 9 && validation) return false;

  // Detect copy-pasting (multi-cell selection)
  var sourceData = e.source.getActiveRangeList();
  if (sourceData && sourceData.getRanges().length > 1) return true;

  // Detect dragging (if multiple rows edited at once)
  if (range.getNumRows() > 1 || range.getNumColumns() > 1) return true;

  return false;
}

// Send Email Notification
function sendEmailNotification(email) {
  var subject = "New Task Assigned";
  var body = "A new task has been assigned to you.";
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    cc: ["subhojit.banerjee@imerit.net"]
  });
}

// Calculate SLA (15-minute threshold)
function calculateSLA(timeTaken) {
  // Get the value from 'User' tab, cell C1
  var threshold = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User").getRange("C1").getValue();
  
  // Compare the timeTaken with the threshold
  return timeTaken <= threshold ? "Met" : "Missed";
}

