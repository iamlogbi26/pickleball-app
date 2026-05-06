import React, { useState } from "react";
import "./App.css";

export default function App() {
  // ----------------------------
  // STATES
  // ----------------------------
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");

  const [currentMatch, setCurrentMatch] = useState(null);
  const [history, setHistory] = useState([]);

  // ----------------------------
  // ADD PLAYER (FIXED)
  // ----------------------------
  const addPlayer = () => {
    if (!name.trim()) return;

    const newPlayer = {
      id: Date.now(),
      name: name.trim(),
      played: 0,
      wins: 0
    };

    setPlayers(prev => [...prev, newPlayer]); // ✅ FIXED SAFE UPDATE
    setName("");
  };

  // ----------------------------
  // REMOVE PLAYER
  // ----------------------------
  const removePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  // ----------------------------
  // START MATCH (SIMPLE SAFE VERSION)
  // ----------------------------
  const createMatch = () => {
    if (players.length < 4) return alert("Need at least 4 players");

    const shuffled = [...players].sort(() => Math.random() - 0.5);

    const team1 = [shuffled[0], shuffled[1]];
    const team2 = [shuffled[2], shuffled[3]];

    setCurrentMatch({ team1, team2 });
  };

  // ----------------------------
  // HANDLE WINNER
  // ----------------------------
  const handleWinner = (winningTeam) => {
    const match = {
      ...currentMatch,
      winner: winningTeam
    };

    setHistory(prev => [...prev, match]);

    const updated = players.map(p => {
      const inTeam1 = currentMatch.team1.find(x => x.id === p.id);
      const inTeam2 = currentMatch.team2.find(x => x.id === p.id);

      if (inTeam1) {
        return {
          ...p,
          played: p.played + 1,
          wins: p.wins + (winningTeam === "team1" ? 1 : 0)
        };
      }

      if (inTeam2) {
        return {
          ...p,
          played: p.played + 1,
          wins: p.wins + (winningTeam === "team2" ? 1 : 0)
        };
      }

      return p;
    });

    setPlayers(updated);
    setCurrentMatch(null);
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🥒 Pickleball App v1.1 (Fixed)</h1>

      {/* ADD PLAYER */}
      <div style={{ marginBottom: 10 }}>
        <input
          value={name}
          placeholder="Enter player name"
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addPlayer}>Add Player</button>
      </div>

      {/* PLAYER LIST */}
      <h3>Players</h3>
      {players.map(p => (
        <div key={p.id}>
          {p.name} | Played: {p.played} | Wins: {p.wins}
          <button onClick={() => removePlayer(p.id)}>❌</button>
        </div>
      ))}

      {/* START MATCH */}
      <button onClick={createMatch} style={{ marginTop: 10 }}>
        Start Match
      </button>

      {/* CURRENT MATCH */}
      {currentMatch && (
        <div style={{ marginTop: 20 }}>
          <h2>Current Match</h2>

          <h4>Team 1</h4>
          {currentMatch.team1.map(p => (
            <div key={p.id}>{p.name}</div>
          ))}

          <h4>Team 2</h4>
          {currentMatch.team2.map(p => (
            <div key={p.id}>{p.name}</div>
          ))}

          <button onClick={() => handleWinner("team1")}>
            Team 1 Wins
          </button>

          <button onClick={() => handleWinner("team2")}>
            Team 2 Wins
          </button>
        </div>
      )}

      {/* HISTORY */}
      <h3>History</h3>
      {history.map((m, i) => (
        <div key={i}>
          Team1 vs Team2 → Winner: {m.winner}
        </div>
      ))}
    </div>
  );
}
