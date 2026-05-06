import React, { useState } from "react";
import "./App.css";

export default function App() {
  // ----------------------------
  // STATE
  // ----------------------------
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");

  const [queue, setQueue] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [history, setHistory] = useState([]);

  const [phase, setPhase] = useState("rotation"); 
  // rotation | finals

  // ----------------------------
  // ADD PLAYER
  // ----------------------------
  const addPlayer = () => {
    if (!name.trim()) return;

    const newPlayer = {
      id: Date.now(),
      name: name.trim(),
      played: 0,
      partners: []
    };

    setPlayers([...players, newPlayer]);
    setQueue([...queue, newPlayer]);
    setName("");
  };

  // ----------------------------
  // REMOVE PLAYER
  // ----------------------------
  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
    setQueue(queue.filter(p => p.id !== id));
  };

  // ----------------------------
  // CREATE MATCH (NO REPEAT PARTNER LOGIC - SIMPLE VERSION)
  // ----------------------------
  const createMatch = () => {
    if (queue.length < 4) return;

    const available = [...queue];

    const pick = () => {
      return available.splice(0, 1)[0];
    };

    const p1 = pick();
    const p2 = pick();
    const p3 = pick();
    const p4 = pick();

    const team1 = [p1, p2];
    const team2 = [p3, p4];

    setQueue(available);

    setCurrentMatch({
      team1,
      team2
    });
  };

  // ----------------------------
  // HANDLE WINNER
  // ----------------------------
  const handleWinner = (winningTeam) => {
    const match = {
      ...currentMatch,
      winner: winningTeam
    };

    setHistory([...history, match]);

    // update stats
    const updatePlayers = (team, win) => {
      return team.map(p => ({
        ...p,
        played: p.played + 1,
        wins: p.wins || 0 + (win ? 1 : 0)
      }));
    };

    const updatedPlayers = players.map(p => {
      const inTeam1 = currentMatch.team1.find(x => x.id === p.id);
      const inTeam2 = currentMatch.team2.find(x => x.id === p.id);

      if (inTeam1) {
        const win = winningTeam === "team1";
        return {
          ...p,
          played: p.played + 1,
          wins: (p.wins || 0) + (win ? 1 : 0)
        };
      }

      if (inTeam2) {
        const win = winningTeam === "team2";
        return {
          ...p,
          played: p.played + 1,
          wins: (p.wins || 0) + (win ? 1 : 0)
        };
      }

      return p;
    });

    setPlayers(updatedPlayers);

    setCurrentMatch(null);

    // check if all played
    const allPlayed = updatedPlayers.every(p => p.played > 0);

    if (allPlayed && phase === "rotation") {
      generateFinalPhase(history.concat(match));
      setPhase("finals");
    }
  };

  // ----------------------------
  // FINAL PHASE LOGIC
  // winners vs winners / losers vs losers
  // ----------------------------
  const generateFinalPhase = (allMatches) => {
    const winners = [];
    const losers = [];

    allMatches.forEach(m => {
      if (m.winner === "team1") {
        winners.push(...m.team1);
        losers.push(...m.team2);
      } else {
        winners.push(...m.team2);
        losers.push(...m.team1);
      }
    });

    const pair = (arr) => {
      const result = [];
      for (let i = 0; i < arr.length; i += 4) {
        if (arr[i + 3]) {
          result.push({
            team1: [arr[i], arr[i + 1]],
            team2: [arr[i + 2], arr[i + 3]]
          });
        }
      }
      return result;
    };

    const finalMatches = {
      winnerBracket: pair(winners),
      loserBracket: pair(losers)
    };

    setQueue([]);
    setCurrentMatch(finalMatches.winnerBracket[0] || null);
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🥒 Pickleball Rotation App</h1>

      {/* ADD PLAYER */}
      <div>
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
          {p.name} (Played: {p.played})
          <button onClick={() => removePlayer(p.id)}>X</button>
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
      <h3>Match History</h3>
      {history.map((m, i) => (
        <div key={i}>
          Team1 vs Team2 → Winner: {m.winner}
        </div>
      ))}
    </div>
  );
}
