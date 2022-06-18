const apiFetch = async <Response>(url = '', method = 'POST', data: any = {}, headers = {}, json = true): Promise<Response> => {
  // Default options are marked with *
  const response = await fetch(url, {
    method,
    headers: {
      ...json && { 'Content-Type': 'application/json' },
      ...headers,
    },
    ...method !== 'GET' && (json ? { body: JSON.stringify(data) } : { body: data }),
  });
  return response.json();
};

export default apiFetch;
