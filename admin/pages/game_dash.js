const ANON_KEY = localStorage.getItem("anon_key");
const API_HOST = localStorage.getItem("api_host");

const { createClient } = window.supabase;

const supabase = createClient(API_HOST, ANON_KEY);

const mapPre = document.querySelector("#map");
const logPre = document.querySelector("#log");

const map = {
  zones: {
    pizzatime: "NY",
    kfc: "KY",
    ohyeah: "TX",
    tree: "CA",
  },
  teams: {
    A: "red",
    B: "blue",
    C: "purple",
    D: "yellow",
  },
};

function updateDash(scans) {
  mapPre.textContent = JSON.stringify(map, null, 2);
  logPre.textContent = JSON.stringify(scans, null, 2);

  scans.forEach((scan) => {
    const color = map.teams[scan.team];
    const zone = map.zones[scan.node_code];
    const el = document.querySelector(`#${zone}`);
    el.style.fill = color;
  });
}

async function testFunction() {
  const GAME_ID_INPUT = document.querySelector("#gameId").value;

  const { data, error } = await supabase.rpc("view_game_v1", {
    game_id: GAME_ID_INPUT,
  });

  if (!error) updateDash(data);
}

let int = null;
document.querySelector("#test").addEventListener("click", () => {
  if (int) clearInterval(int);

  testFunction();
  int = setInterval(testFunction, 2000);
});
