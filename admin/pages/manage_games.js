const ANON_KEY = localStorage.getItem("anon_key");
const API_HOST = localStorage.getItem("api_host");

const { createClient } = window.supabase;

const supabase = createClient(API_HOST, ANON_KEY);

// Create Game

const createGameNameInput = document.querySelector("#create-game-name-input");
const createGameDescInput = document.querySelector("#create-game-desc-input");
const createGameSubmit = document.querySelector("#create-game-submit");

createGameSubmit.addEventListener("click", async () => {
  const name = createGameNameInput.value;
  const desc = createGameDescInput.value;

  const { error } = await supabase.from("games_v1").insert({ name, desc });

  if (!error) {
    console.log("game created!");
  }
});

// List Games

const listGamesButton = document.querySelector("#list-games");
const gamesList = document.querySelector("#games-list");

listGamesButton.addEventListener("click", async () => {
  const { data, error } = await supabase.from("games_v1").select();

  if (!error && Array.isArray(data)) {
    gamesList.innerHTML = "";

    data.forEach((row) => {
      const item = document.createElement("LABEL");
      item.dataset.id = row.id;

      const itemInput = document.createElement("INPUT");
      itemInput.type = "radio";
      itemInput.name = "game-list";

      const itemSpan = document.createElement("SPAN");
      itemSpan.textContent = `${row.name} - ${row.desc}`;

      item.appendChild(itemInput);
      item.appendChild(itemSpan);
      gamesList.appendChild(item);
    });
  }
});

// List Nodes

const listNodesButton = document.querySelector("#list-nodes");
const nodesList = document.querySelector("#nodes-list");

listNodesButton.addEventListener("click", async () => {
  const { data, error } = await supabase.from("nodes_v1").select();

  if (!error && Array.isArray(data)) {
    nodesList.innerHTML = "";

    data.forEach((row) => {
      const item = document.createElement("LABEL");
      item.dataset.id = row.id;

      const itemInput = document.createElement("INPUT");
      itemInput.type = "checkbox";
      itemInput.name = "node-list";

      const itemSpan = document.createElement("SPAN");
      itemSpan.textContent = `${row.code}`;

      item.appendChild(itemInput);
      item.appendChild(itemSpan);
      nodesList.appendChild(item);
    });
  }
});

// Assign Nodes to Game

const assignNodesButton = document.querySelector("#assign-nodes");

assignNodesButton.addEventListener("click", async () => {
  const nodeInputs = document.querySelectorAll("#nodes-list input:checked");
  const gameInput = document.querySelector("#games-list input:checked");

  if (!gameInput || nodeInputs.length <= 0) {
    console.log("Game or Nodes not selected!");
    return;
  }

  const gameId = gameInput.parentElement.dataset.id;

  console.log(nodeInputs);

  const nodeIds = Array.from(nodeInputs).map((nodeInput) => {
    return nodeInput.parentElement.dataset.id;
  });

  console.log(nodeIds);

  const { data, error } = await supabase
    .from("nodes_v1")
    .update({ game: gameId })
    .in("id", nodeIds);

  if (!error) {
    console.log("Nodes updated!");
  }
});
