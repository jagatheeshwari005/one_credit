WARNING: Seeder Safety

This repository includes `seed-admin.js` for creating a development admin account.

Important safety measures (already enforced in `seed-admin.js`):

- The seeder will abort if `NODE_ENV` is `production`.
- The seeder requires an explicit opt-in: set `SEED_ADMIN_ENABLED=true` to run it.
- If `SEED_ADMIN_PASSWORD` is not provided, the seeder generates a secure random password and prints it to the console.

Do NOT commit or publish repositories that contain seeders creating known credentials. Before publishing or deploying:

- Remove `seed-admin.js` or move it to a private repository, OR
- Keep it but ensure it cannot run in production and requires a secure workflow.

Local testing (PowerShell)

Run the seeder locally with an explicit flag. Example (PowerShell):

```powershell
$env:NODE_ENV='development'
$env:SEED_ADMIN_ENABLED='true'
$env:SEED_ADMIN_EMAIL='admin@example.com'      # optional
# Option A: provide a password (only for local test)
$env:SEED_ADMIN_PASSWORD='your-local-strong-pass'
npm run seed-admin

# Option B: let the seeder generate a password and print it
Remove the SEED_ADMIN_PASSWORD env and run the same command; the generated password will be printed to the console.
```

Recommended workflow after seeding

- Immediately log in with the seeded admin and change the password.
- Delete or secure the seeder before sharing the repo publicly.

If you want, I can also remove `seed-admin.js` from the repository or move it under a private folder. Let me know which option you prefer.