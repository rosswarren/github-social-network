export function json(response) {
  return response.json();
}

export function validateStatus(response) {
  if (response.status !== 200) {
    throw new Error('non 200 status');
  }

  return response;
}
