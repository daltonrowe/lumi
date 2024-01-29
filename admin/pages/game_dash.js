const ANON_KEY = localStorage.getItem("anon_key");
const API_HOST = localStorage.getItem("api_host");

const { createClient } = window.supabase;

const supabase = createClient(API_HOST, ANON_KEY);

const configPre = document.querySelector("#config");
const logPre = document.querySelector("#log");

const state = {
  scans: [],
};

let config = {};

function updateDash() {
  const { scans } = state;

  configPre.textContent = JSON.stringify(config, null, 2);
  logPre.textContent = JSON.stringify(scans, null, 2);

  scans.forEach((scan) => {
    const color = config.teams[scan.team];
    const zone = config.zones[scan.node_code];
    const el = document.querySelector(`#${zone}`);
    el.style.fill = color;
  });
}

async function startGameDash(gameId) {
  const { data, error } = await supabase.rpc("view_game_v1", {
    game_id: gameId,
  });

  if (!error) {
    state.scans = data;
    updateDash();
  }
}

function handleScanUpdate(payload) {
  if (payload.errors) return;

  const newScan = payload.new;
  const prevNodeScanIndex = state.scans.findIndex(
    (scan) => scan.node_code === newScan.node_code
  );

  if (prevNodeScanIndex !== -1) {
    state.scans.splice(prevNodeScanIndex, 1);
  }

  state.scans.unshift(newScan);
  updateDash();
}

function startGameListener(gameId) {
  return supabase
    .channel("table-filter-changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "scans_v1",
        filter: `game=eq.${gameId}`,
      },
      (payload) => handleScanUpdate(payload)
    )
    .subscribe();
}

async function pullConfig(gameId) {
  const { data, error } = await supabase
    .from("games_v1")
    .select()
    .eq("id", gameId);

  if (!error) config = data[0].config ?? {};
}

document.querySelector("#test").addEventListener("click", async () => {
  const GAME_ID_INPUT = document.querySelector("#gameId").value;
  await pullConfig(GAME_ID_INPUT);
  await startGameDash(GAME_ID_INPUT);
  startGameListener(GAME_ID_INPUT);
});
