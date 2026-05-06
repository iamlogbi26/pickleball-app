let queue = [];
let active = [];
let leaderboard = {};

function addPlayer(){
  let name = document.getElementById("name").value;
  if(!name) return;

  queue.push(name);
  leaderboard[name] = leaderboard[name] || 0;

  document.getElementById("name").value = "";
  render();
}

function startMatch(){
  if(queue.length < 4){
    alert("Need 4 players");
    return;
  }

  queue.sort(()=>Math.random()-0.5);

  active = queue.splice(0,4);

  document.getElementById("match").innerText =
    active[0]+" & "+active[1]+" VS "+active[2]+" & "+active[3];

  render();
}

function endMatch(){
  if(active.length === 0) return;

  // random winner (you can replace later)
  let winner = active[Math.floor(Math.random()*active.length)];
  leaderboard[winner]++;

  queue.push(...active);
  active = [];

  document.getElementById("match").innerText = "None";

  render();
}

function render(){
  document.getElementById("queue").innerHTML =
    queue.map(p=>`<li>${p}</li>`).join("");

  document.getElementById("board").innerHTML =
    Object.entries(leaderboard)
    .map(([p,w])=>`<li>${p} - ${w}</li>`).join("");
}