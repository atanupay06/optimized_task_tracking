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

