type CsrfResponse = {
  headerName: string;
  parameterName: string;
  token: string;
};

const CSRF_TOKEN_KEY = "XSRF_TOKEN";

export function getStoredCsrfToken() {
  return localStorage.getItem(CSRF_TOKEN_KEY);
}

export async function refreshCsrfToken() {
  const response = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/api/v1/auth/csrf`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch CSRF token");
  }

  const data = (await response.json()) as CsrfResponse;

  localStorage.setItem(CSRF_TOKEN_KEY, data.token);
  return data.token;
}

export function clearCsrfToken() {
  localStorage.removeItem(CSRF_TOKEN_KEY);
}