# Google Sheets Automation with Apps Script
This project includes a set of Google Apps Scripts designed to automate processes in Google Sheets. The scripts handle tasks such as data importing, updating cells, restricting editing actions, sending email notifications, and more. These functions are triggered by custom menu options and edit actions.
# Problem Statement
 The Old all in one tracker is too bulky with all 22 TMs updating in the same sheet.

 Frequent crashes and slow updates.

 Difficult to track and manage data efficiently.
<details>
  <summary>Click to expand</summary>
# Blue print
├── Master Sheet
│   ├── RAW2
│   │   └── Will update every 1 minute using the `consolidate_summary.gs` script
│   ├── TM1 Sheet
│   │   ├── 2025
│   │   │   ├── Assignment Block ── Filled by TM1
│   │   │   ├── FP Block ── Filled by TM1
│   │   │   ├── SLA Block ── Automatically filled by `timestamp.gs` script
│   │   │   ├── QC Block ── Automatically updates from the `score_update` script (1-hour time-driven trigger, shows only TM1’s data)
│   │   │   ├── Audit Block ── Automatically updates from the `score_update` script (1-hour time-driven trigger, shows only TM1’s data)
│   │   ├── Summary ── Consolidates date-wise productivity, utilization, QC score, downtime, and audit score
│   ├── TM2 Sheet ├── Same structure as TM1
│   ├── TM3 Sheet ├── Same structure as TM1
│   └── TM22 Sheet ├── Same structure as TM1
├── README.md
└── LICENSE
</details>
# Google Sheets Task Management Automation

This project is designed to automate task management and data consolidation in Google Sheets. It includes multiple sheets for individual team members (TM1, TM2, etc.) and a master sheet for consolidated data. Various scripts and time-driven triggers are used to update, calculate, and consolidate data for each team member, including task assignments, SLA tracking, QC, and audit scores.

## Project Structure
## Features

- **Master Sheet (RAW2)**: This sheet consolidates all data from individual team member sheets (TM1, TM2, etc.) every minute using a time-driven trigger and the `consolidate_summary.gs` script.
- **Individual TM Sheets**: Each team member (TM1, TM2, etc.) has their own sheet with various blocks:
  - **Assignment Block**: Filled by the team member.
  - **FP Block**: Filled by the team member.
  - **SLA Block**: Automatically filled with timestamps using the `timestamp.gs` script.
  - **QC Block**: Automatically updated using the `score_update` script, which runs every hour. Displays only the team member's data.
  - **Audit Block**: Automatically updated using the `score_update` script, which runs every hour. Displays only the team member's data.
- **Summary Sheet**: Consolidates daily data such as productivity, utilization, QC scores, downtime, and audit scores for the team.
