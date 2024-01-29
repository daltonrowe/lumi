const ANON_KEY = localStorage.getItem("anon_key");
const API_HOST = localStorage.getItem("api_host");

const { createClient } = window.supabase;

const supabase = createClient(API_HOST, ANON_KEY);

const mapPre = document.querySelector("#map");
const logPre = document.querySelector("#log");

const state = {
  scans: [],
};

const map = {
  zones: {
    PIZZATIME: "NY",
    KFC: "KY",
    OHYEAH: "TX",
    TREE: "CA",
  },
  teams: {
    A: "blue",
    B: "red",
    C: "purple",
    D: "yellow",
  },
};

function updateDash() {
  const { scans } = state;

  mapPre.textContent = JSON.stringify(map, null, 2);
  logPre.textContent = JSON.stringify(scans, null, 2);

  scans.forEach((scan) => {
    const color = map.teams[scan.team];
    const zone = map.zones[scan.node_code];
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

document.querySelector("#test").addEventListener("click", () => {
  const GAME_ID_INPUT = document.querySelector("#gameId").value;
  startGameDash(GAME_ID_INPUT);
  startGameListener(GAME_ID_INPUT);
});
