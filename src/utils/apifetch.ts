const apiFetch = async <Response>(url = '', method = 'POST', data = {}): Promise<Response> => {
  // Default options are marked with *
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export default apiFetch;
