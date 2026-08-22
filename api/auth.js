// GitHub OAuth step 1: redirect the Decap CMS login popup to GitHub's consent screen.
// Deployed by Vercel as a serverless function (top-level /api is auto-detected).
export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send("Missing OAUTH_GITHUB_CLIENT_ID environment variable.");
    return;
  }

  const protocol = req.headers["x-forwarded-proto"] || "https";
  const redirectUri = `${protocol}://${req.headers.host}/api/callback`;

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "repo,user");

  res.writeHead(302, { Location: url.toString() });
  res.end();
}
