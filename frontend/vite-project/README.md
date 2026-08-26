# Yada Yada frontend

React client for the Yada Yada notes and checklist API.

## Local development

```bash
npm install
npm run dev
```

Vite proxies `/user`, `/notes`, `/checklists`, and `/checklist_items` to `http://localhost:8000` during local development.

For a separate-origin deployment, copy `.env.example` to `.env` and set:

```dotenv
VITE_API_URL=https://api.example.com
```

The backend must allow requests from the frontend origin in that deployment setup.

## Checks

```bash
npm run lint
npm run build
```
