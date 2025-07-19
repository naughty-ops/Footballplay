// Player data - will be loaded from JSON
let playersData = {};
let playerNameToIdMap = {};

// Load player data
fetch('data/players.json')
  .then(response => response.json())
  .then(data => {
    playersData = data.players;
    // Create name to ID mapping
    playerNameToIdMap = {};
    Object.keys(playersData).forEach(id => {
      const player = playersData[id];
      playerNameToIdMap[player.name] = id;
      // Also create comma-separated version
      const nameParts = player.name.split(' ');
      if (nameParts.length > 1) {
        playerNameToIdMap[`${nameParts[0]}, ${nameParts.slice(1).join(' ')}`] = id;
      }
    });
    
    // Populate top players grid
    populateTopPlayers();
  })
  .catch(error => {
    console.error('Error loading player data:', error);
  });

function populateTopPlayers() {
  const topPlayersGrid = document.getElementById('topPlayersGrid');
  topPlayersGrid.innerHTML = '';
  
  // Convert players object to array and sort by position
  const playersArray = Object.values(playersData);
  playersArray.sort((a, b) => a.position - b.position);
  
  // Display top 6 players
  playersArray.slice(0, 6).forEach(player => {
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.onclick = () => showPlayerDetails(player.id);
    
    playerCard.innerHTML = `
      <div class="player-position">${player.position}</div>
      <img src="${player.img}" alt="${player.name}" class="player-img">
      <div class="player-name">${player.name}</div>
      <div class="player-id">eFootball ID: ${player.id}</div>
    `;
    
    topPlayersGrid.appendChild(playerCard);
  });
}

function showPlayerDetails(identifier) {
  // Show loading state
  const modal = document.getElementById('playerModal');
  modal.style.display = 'block';
  modal.querySelector('.player-modal-content').classList.add('loading');
  
  // Check if identifier is ID or name
  const playerId = playerNameToIdMap[identifier] || identifier;
  const player = playersData[playerId];
  
  if (!player) {
    closePlayerModal();
    return;
  }
  
  // Set player info
  document.getElementById('modalPlayerName').textContent = player.name;
  document.getElementById('modalPlayerImg').src = player.img;
  document.getElementById('modalPlayerId').textContent = `eFootball ID: ${playerId}`;
  document.getElementById('modalPlayerPosition').textContent = `Position: ${player.position}${getOrdinalSuffix(player.position)}`;
  document.getElementById('modalPlayerPoints').textContent = `Points: ${player.points}`;
  document.getElementById('modalPlayerRank').textContent = `#${player.position}`;
  
  // Set stats
  document.getElementById('matchesPlayed').textContent = player.matchesPlayed;
  document.getElementById('matchesWon').textContent = player.matchesWon;
  document.getElementById('winRate').textContent = `${Math.round((player.matchesWon / player.matchesPlayed) * 100)}%`;
  document.getElementById('goalsScored').textContent = player.goalsScored;
  
  // Set tournament stats
  if (player.tournamentStats) {
    document.getElementById('currentGroup').textContent = player.tournamentStats.group;
    document.getElementById('groupPosition').textContent = `${player.tournamentStats.groupPosition}${getOrdinalSuffix(player.tournamentStats.groupPosition)}`;
    document.getElementById('groupPoints').textContent = player.tournamentStats.groupPoints;
    document.getElementById('groupGoals').textContent = player.tournamentStats.groupGoals;
  }
  
  // Set next match
  if (player.nextMatch) {
    document.getElementById('nextMatchPlayerImg').src = player.img;
    document.getElementById('nextMatchPlayerName').textContent = player.name;
    document.getElementById('nextMatchOpponentImg').src = player.nextMatch.opponentImg;
    document.getElementById('nextMatchOpponentName').textContent = player.nextMatch.opponentName;
    document.getElementById('nextMatchDate').textContent = player.nextMatch.date;
    document.getElementById('nextMatchTime').textContent = player.nextMatch.time;
  }
  
  // Set advanced stats
  if (player.advancedStats) {
    document.getElementById('avgGoals').textContent = player.advancedStats.avgGoals;
    document.getElementById('cleanSheets').textContent = player.advancedStats.cleanSheets;
    document.getElementById('passAccuracy').textContent = `${player.advancedStats.passAccuracy}%`;
    document.getElementById('shotsOnTarget').textContent = `${player.advancedStats.shotsOnTarget}%`;
  }
  
  // Set recent matches
  const recentMatchesContainer = document.getElementById('recentMatches');
  recentMatchesContainer.innerHTML = '';
  
  if (player.recentMatches && player.recentMatches.length > 0) {
    player.recentMatches.forEach(match => {
      const matchElement = document.createElement('div');
      matchElement.className = 'match-item';
      matchElement.innerHTML = `
        <div class="match-teams">
          <div class="match-team">
            <img src="${player.img}" alt="${player.name}">
            <span>${player.name}</span>
          </div>
          <div class="match-result ${match.result === 'W' ? 'win' : match.result === 'L' ? 'loss' : 'draw'}">${match.score}</div>
          <div class="match-team">
            <img src="${match.opponentImg}" alt="${match.opponentName}">
            <span>${match.opponentName}</span>
          </div>
        </div>
        <div class="match-info">
          <span>${match.date}</span>
        </div>
      `;
      recentMatchesContainer.appendChild(matchElement);
    });
  } else {
    recentMatchesContainer.innerHTML = '<p>No recent matches found</p>';
  }
  
  // Remove loading state
  setTimeout(() => {
    modal.querySelector('.player-modal-content').classList.remove('loading');
  }, 300);
}

function closePlayerModal() {
  document.getElementById('playerModal').style.display = 'none';
}

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}