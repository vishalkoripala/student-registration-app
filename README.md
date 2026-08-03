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
