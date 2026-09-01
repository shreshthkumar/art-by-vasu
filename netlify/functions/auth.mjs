function randomState() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default async () => {
  const state = randomState();

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', process.env.GITHUB_OAUTH_ID);
  authorizeUrl.searchParams.set('scope', 'repo,user');
  authorizeUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      'Set-Cookie': `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
};
