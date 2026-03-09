# Killhouse Locker System

This repository contains the source code for a simple API‑driven locker management system.  The goal of the project is to control a bank of physical lockers (e.g. for an airsoft site or event) using a web application and Raspberry Pi controllers.  The solution is designed to be inexpensive, easy to deploy, and scalable.

## Monorepo Structure

```
killhouse-locker-system/
│
├── api/              # TypeScript API service (runs on Vercel serverless functions or Node server)
│   ├── src/
│   │   ├── index.ts            # Express entrypoint exposing API routes
│   │   ├── supabaseClient.ts   # Helper for connecting to Supabase
│   │   └── routes/             # Individual route handlers
│   │       ├── getLockersList.ts   # Lists all lockers
│   │       ├── getLockerStatus.ts  # Returns the status of a single locker
│   │       ├── reserveLocker.ts    # Starts a new session for a locker
│   │       ├── unlockLocker.ts     # Opens a locker using a PIN code
│   │       └── releaseLocker.ts    # Ends a session and frees the locker
│   ├── package.json
│   └── tsconfig.json
│
├── pi-controller/     # Python script for controlling the physical locker hardware
│   ├── controller.py  # Communicates with GPIO pins to drive relays and LEDs
│   └── README.md
│
├── database/         # Database schema and seed data
│   ├── schema.sql
│   └── README.md
│
├── web-app/          # Front‑end web UI for interacting with the API
│   ├── index.html    # Simple browser-based control panel
│   └── README.md
│
└── docs/             # Architectural documentation
    ├── architecture.md
    └── endpoints.md
```

## Getting Started

1. **Install dependencies:**
   The API service uses Node.js.  From the `api/` directory, install packages:

   ```bash
   cd api
   npm install
   ```

2. **Environment variables:**
   Copy `.env.example` to `.env` and fill in the values (Supabase URL, Supabase API key, etc.).

3. **Run locally:**
   Start the API server locally using `npm run dev`.  This will launch an Express server on port 3000 for testing.

4. **Deploy to Vercel:**
   The API is designed to be deployed as Vercel serverless functions.  When pushing to GitHub and linking the repo to Vercel, each file under `api/src/routes` will be built into its own serverless endpoint.

## About

This project is maintained by the Killhouse team.  Contributions are welcome!  Please submit issues or pull requests via the GitHub repository.
