# zylesruth.com

Personal site — story, achievements, travel, businesses, books, and blog. Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com), deployed on [Vercel](https://vercel.com).

## Project structure

```
src/
├── data/site.ts        # name, tagline, email, social links — edit this first
├── pages/              # one file per route (story, achievements, travel, ...)
├── content/blog/        # blog posts as Markdown
├── components/, layouts/
public/
├── admin/              # Decap CMS admin UI (see below)
api/                    # Vercel serverless functions for the CMS's GitHub login
```

## Commands

| Command           | Action                                   |
| :----------------- | :---------------------------------------- |
| `npm install`       | Install dependencies                       |
| `npm run dev`       | Start local dev server at `localhost:4321` |
| `npm run build`     | Build the production site to `./dist/`     |
| `npm run preview`   | Preview the production build locally       |

## Contact form

The [Contact](src/pages/contact.astro) page posts to [Web3Forms](https://web3forms.com), a free form-submission service — no server code required.

1. Go to https://web3forms.com and enter your email to get a free access key (no account/password needed).
2. Set `PUBLIC_WEB3FORMS_ACCESS_KEY` in `.env` (local) and in Vercel's Project Settings → Environment Variables (production).
3. Until that variable is set, the page falls back to showing a plain `mailto:` link instead of the form.

## Blog CMS (`/admin`)

The blog is edited as Markdown files in `src/content/blog/`, but you don't have to touch code to publish — [Decap CMS](https://decapcms.org) at `/admin` gives you a write-in-the-browser editor that commits directly to this GitHub repo.

Setup (one-time):

1. Push this repo to GitHub.
2. Edit [public/admin/config.yml](public/admin/config.yml): set `repo` to `your-github-username/your-repo-name` and `base_url` to your live domain.
3. Create a GitHub OAuth App at https://github.com/settings/developers → *New OAuth App*:
   - Homepage URL: your live domain (e.g. `https://www.zylesruth.com`)
   - Authorization callback URL: `https://www.zylesruth.com/api/callback`
4. Set `OAUTH_GITHUB_CLIENT_ID` and `OAUTH_GITHUB_CLIENT_SECRET` (from the OAuth App) in Vercel's Project Settings → Environment Variables. Keep the secret out of the repo.
5. Visit `https://www.zylesruth.com/admin`, log in with GitHub, and start writing. Each save opens a commit on the `main` branch.

The two files under [api/](api) (`auth.js`, `callback.js`) implement the GitHub login handshake Decap expects; Vercel runs them automatically as serverless functions, no extra config needed.

## Deploying

Push to GitHub, then import the repo in Vercel. Framework preset: Astro (auto-detected). Add the environment variables above before the first deploy that needs them.
