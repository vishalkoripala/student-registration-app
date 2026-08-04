# Mini Application (Express + Node)

Simple student registration form with client validation, image preview, server-side validation, and persistence.

Run:

```bash
npm install
npm start
```

Open http://localhost:3000

Optional email confirmation:

Set environment variables before `npm start`:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `FROM_EMAIL` (optional)

Submissions are saved to `submissions.json` in the project root.

Admin page:

- Visit `/admin` to see saved submissions. If `ADMIN_USER` and `ADMIN_PASS` environment variables are set, the page will require HTTP Basic auth with those credentials.

Passwords are hashed with `bcryptjs` before being saved; the hash is stored in `submissions.json` under the `passwordHash` key.

Docker deploy

Build and run locally with Docker:

```bash
docker build -t mini-app .
docker run -p 3000:3000 -e ADMIN_USER=admin -e ADMIN_PASS=changeme mini-app
```

Recommended hosts:

- Render.com: connect your GitHub repo and deploy with automatic builds (supports Docker or Node build).
- Railway.app: quick deploy with GitHub integration.
- Fly.io: good for global deployment using the provided Dockerfile.

Automatic Render deployment:

- This repo includes `render.yaml` — if you connect the repository to Render, Render will detect the manifest and create a web service that builds the Docker image and deploys from the `main` branch.

To deploy on Render:

1. Sign in to https://render.com and click "New +" → "Web Service" → "Connect a repository" and select this repo.
2. Ensure the branch is `main` and that the Dockerfile is selected (Render will use `render.yaml` if present).
3. Set environment variables (`ADMIN_USER`, `ADMIN_PASS`, optional SMTP vars) in Render's dashboard under the Service → Environment.
4. Click "Create Web Service" — Render will build and deploy. Subsequent pushes to `main` will auto-deploy.

If you prefer, I can initiate the deploy for you if you provide a Render API key (set as `RENDER_API_KEY`) and the GitHub repo is connected to your Render account. Do not paste secrets into this chat; instead, if you want me to deploy, follow Render's instructions to create an API key and then paste it when prompted.

Recent changes
--------------

- Renamed the application entrypoint from `seerver.js` to `server.js` and updated `package.json` and `Dockerfile` accordingly.
- Added a `.gitignore` to avoid committing `node_modules`, uploads, and local data files.

Local development
-----------------

1. Install dependencies and start locally:

```bash
npm install
npm start
```

2. Or run with Docker (build and run locally):

```bash
docker build -t mini-app .
docker run -p 3000:3000 -e ADMIN_USER=admin -e ADMIN_PASS=changeme mini-app
```

Notes about hosting
-------------------

- This app writes file uploads to a local `uploads/` directory and stores submissions in `submissions.json`. These are fine for local testing and simple VPS or Docker deployments, but are ephemeral on serverless platforms (Vercel) and will be lost on redeploys.
- For production on serverless platforms, migrate file storage to an external service (S3/Supabase Storage) and move submissions to an external database.

If you want, I can open a PR with these changes, or create a short changelog/release.
