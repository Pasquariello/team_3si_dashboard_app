// used same way as fetch, just includes the auth header and single token value for you
export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = window.localStorage.getItem('auth_token');

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
