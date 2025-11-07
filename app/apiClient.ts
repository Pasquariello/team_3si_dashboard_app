// used same way as fetch, just includes the auth header and single token value for you
function getWindow() {
  return typeof window === 'undefined' ? undefined : window;
}

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = getWindow()?.localStorage?.getItem('auth_token') || null;

  const headers = {
    ...init.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
    'Content-Type': 'application/json',
  };
  let response = null;
  try {
    const data = await fetch(input, { ...init, headers });

    if (!data.ok) {
      const error = new Error('failed to fetch');
      throw error;
    }

    response = await data.json();
  } catch (error) {
    throw error;
  }

  return response;
}
