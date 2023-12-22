const fetch = require("node-fetch");

async function api(endpoint, method, data) {
  const { API_URL, API_ANON_KEY } = process.env;

  console.log(API_ANON_KEY);
  console.log(data);

  const response = await fetch(`${API_URL}/functions/${endpoint}`, {
    method,
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${API_ANON_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response;
}

module.exports = {
  api,
};
