# CMPT370 Team 1 - Pocket Pills

A web-based medication management system designed to assist users in organizing and taking their medications safely and consistently. Features include pill reminders, threshold alerts for low pill counts, multi-profile management with secure login, and section to export stored medication data for printing or sharing with healthcare professionals.

## Tech Stack

### Frontend:
 - React: Client side UI
 - Next.js: Server side rendering, routing, and site generation
 - Material UI: Customizable UI components
### Backend:
 - Node.js: Javascript runtime
 - Postgres SQL: All data stored in relational DB
 - Supabase: Authentication provider and DB host service
 - Vercel: Host service for live version of the website

## Pre-Requisites for Local Hosting

1. Linux or MacOS is required

2. Node.js and NPM must be installed on the host PC. 
```
sudo apt update
sudo apt install nodejs
node -v
sudo apt install npm
npm -v
```

## Installation
#### Note: All steps must be completed in the directory where the Git repo is cloned

1. Install node package

```bash
npm install
```
2. Copy ```.env``` file
```bash
cp .env.example .env.local
```
3. Run development script
```bash
npm run dev
```
4. Navigate to provided URL. Likely http://localhost:3000


## Usage Notes

### Database
This project hosts an SQL database using a supabase.
This prevents users with slow or low memory computers from having to host a cloned database to compile the site locally.

### Signup
To signup for the application, users simply need to navigate to the URL and click the signup button. Locally created profiles will also be available in the remote-hosted version of the site. Users will be unable to access interior links if they have not yet signed in.

### Reminders
In it's current working state, users must register their phone number directly with Twilio to receive text messages. This is a future issue we would like to address. A working demo of a text message being received by one of our registered phone numbers is available in the demo video.

## Authors
- Brayden Johnson, BCJ089, 11293593
- Noah Phonsavath, NOP028, 11298021
- David Baik, DAB904, 11297514
- Rhet Bernard, RHB607, 11305610
- Tyrell Beauchamp, TRB962, 11299543