# PolicyCore Insurance Backend

Standalone REST API for the [Insurance Policy Administration System](../public/projects/insurance-policy-admin/index.html) demo. Implements the same endpoints shown in the app's API Studio tab, backed by real (file-persisted) server-side state instead of mocked responses.

## Run locally

```bash
cd insurance-backend
npm install
npm start
```

Server listens on `http://localhost:4100` by default (override with `PORT`).

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/policies` | List policies (supports `?lob=` and `?status=` filters) |
| POST | `/policies` | Create a policy (rates coverages via the bureau rating engine) |
| GET | `/policies/:id` | Fetch a policy by policy number |
| PUT | `/policies/:id` | Update a policy and re-rate its coverages |
| DELETE | `/policies/:id` | Cancel/remove a policy |
| POST | `/policies/:id/rate` | Re-rate a policy with a given experience modification |
| GET | `/forms` | List ISO/ACORD bureau forms |
| GET | `/forms/:formNumber` | Fetch a single form's metadata |
| POST | `/forms/validate` | Validate a submitted form payload |
| GET | `/health` | Health check |

## Data persistence

Policies are stored in `db.json` (created automatically on first run, seeded with sample policies). This file is gitignored — delete it to reset to the seed data.

## Tests

```bash
npm test
```
