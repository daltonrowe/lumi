const ANON_KEY = localStorage.getItem("anon_key");
const API_HOST = localStorage.getItem("api_host");

const { createClient } = window.supabase;

const supabase = createClient(API_HOST, ANON_KEY);

async function testFunction() {
  const GAME_ID_INPUT = document.querySelector("#gameId").value;

  console.log(GAME_ID_INPUT);

  const { data, error } = await supabase.rpc("view_game_v1", {
    game_id: GAME_ID_INPUT,
  });

  console.log(data, error);
}

document.querySelector("#test").addEventListener("click", testFunction);
