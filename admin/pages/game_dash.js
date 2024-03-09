const ANON_KEY = localStorage.getItem("anon_key");
const API_HOST = localStorage.getItem("api_host");

const { createClient } = window.supabase;

const supabase = createClient(API_HOST, ANON_KEY);

const configPre = document.querySelector("#config");
const logPre = document.querySelector("#log");
const leadersPre = document.querySelector("#leaders");

const state = {
  scans: [],
  leaders: [],
};

let config = {};

function updateDash() {
  const { scans, leaders } = state;

  configPre.textContent = JSON.stringify(config, null, 2);
  logPre.textContent = JSON.stringify(scans, null, 2);

  scans.forEach((scan) => {
    const color = config.teams[scan.team];
    const zone = config.zones[scan.node_code];
    const el = document.querySelector(`#${zone}`);
    el.style.fill = color;
  });

  const leadersMarkup = document.createElement("DIV");

  leaders.forEach((leader) => {
    const leaderDiv = document.createElement("DIV");
    leaderDiv.textContent = `${leader.card_id}: ${leader.count}\n`;
    leaderDiv.dataset.card_id = leader.card_id;

    leadersMarkup.appendChild(leaderDiv);
  });

  leadersPre.innerHTML = leadersMarkup.innerHTML;
}

async function startGameDash(gameId) {
  const { data, error } = await supabase.rpc("view_game_v1", {
    game_id: gameId,
  });

  if (!error) state.scans = data;

  const { data: leadersData, error: leadersError } = await supabase.rpc(
    "get_leaders_v1",
    {
      game_id: gameId,
    }
  );

  if (!leadersError) state.leaders = leadersData;

  updateDash();
}

function sortLeaders() {
  state.leaders.sort((a, b) => b.count - a.count);
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

  const leaderEntry = state.leaders.find(
    (leader) => leader.card_id === newScan.card_id
  );

  if (leaderEntry) {
    leaderEntry.count += 1;
    sortLeaders();
  }

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
