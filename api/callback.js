// GitHub OAuth step 2: exchange the temporary code for an access token, then hand it
// back to the Decap CMS popup window via postMessage, per Decap's OAuth provider protocol.
export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  const code = req.query.code;

  if (!clientId || !clientSecret) {
    res.status(500).send("Missing OAUTH_GITHUB_CLIENT_ID or OAUTH_GITHUB_CLIENT_SECRET.");
    return;
  }
  if (!code) {
    res.status(400).send("Missing OAuth code.");
    return;
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const tokenData = await tokenRes.json();

  if (tokenData.error || !tokenData.access_token) {
    res.status(400).send(`GitHub OAuth error: ${tokenData.error_description || tokenData.error || "unknown error"}`);
    return;
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: "github" }).replace(/</g, "\\u003c");

  res.setHeader("Content-Type", "text/html");
  res.end(`<!doctype html>
<html><body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:${payload}',
        e.origin
      );
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
</body></html>`);
}
