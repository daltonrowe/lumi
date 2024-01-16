const ANON_KEY = localStorage.getItem("anon_key");
const API_HOST = localStorage.getItem("api_host");

async function testFunction() {
  const GAME_ID_INPUT = document.querySelector("#gameId").value;

  const response = await fetch(`${API_HOST}/functions/v1/game_stats`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameId: GAME_ID_INPUT,
    }),
  });

  console.log("res", response);

  const responseJson = await response.json();
  console.log("json", responseJson);
}

document.querySelector("#test").addEventListener("click", testFunction);
