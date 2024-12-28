export const fetchWithErrorHandling = async (url, options = {}) => {
  const { method = "GET", headers = {}, body } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: method !== "GET" ? body : null,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`Error en la solicitud a ${url}:`, error);
    throw error;
  }
};
