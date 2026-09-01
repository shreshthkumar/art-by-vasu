function getCookie(req, name) {
  const header = req.headers.get('cookie') || '';
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

function renderResult(status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const html = `<!DOCTYPE html><html><body><script>
    (function() {
      function receiveMessage() {
        window.opener.postMessage(${JSON.stringify(message)}, window.location.origin);
        window.removeEventListener('message', receiveMessage, false);
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', window.location.origin);
    })();
  </script></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

export default async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = getCookie(req, 'decap_oauth_state');

  if (!code || !state || !expectedState || state !== expectedState) {
    return renderResult('error', { message: 'Invalid or missing OAuth state' });
  }

  let tokenResponse;
  try {
    tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_OAUTH_ID,
        client_secret: process.env.GITHUB_OAUTH_SECRET,
        code,
      }),
    });
  } catch (err) {
    console.error('GitHub token exchange failed', err);
    return renderResult('error', { message: 'Could not reach GitHub' });
  }

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.access_token) {
    console.error('GitHub token exchange error', tokenData);
    return renderResult('error', { message: tokenData.error_description || 'GitHub authorization failed' });
  }

  return renderResult('success', { token: tokenData.access_token, provider: 'github' });
};
