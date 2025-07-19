// Current filter state
let currentGroup = 'all';
let currentRound = 'all';

// Load and display today's matches
fetch('data/fixtures.json')
  .then(response => response.json())
  .then(data => {
    displayTodaysMatches(data);
    generateStandings(data);
  })
  .catch(error => {
    console.error('Error loading fixture data:', error);
  });

function displayTodaysMatches(data) {
  const container = document.getElementById('todaysMatchesContainer');
  container.innerHTML = '';
  
  // Get today's date in the same format as your JSON
  const today = new Date().toISOString().split('T')[0];
  
  // Find matches scheduled for today
  const todaysMatches = [];
  
  // Check regular fixtures
  data.fixtures.forEach(group => {
    group.matches.forEach(match => {
      if (match.date === today) {
        todaysMatches.push({
          ...match,
          group: group.group
        });
      }
    });
  });
  
  // Check completed matches
  data.completedMatches.forEach(match => {
    if (match.date === today) {
      todaysMatches.push({
        ...match,
        group: match.group,
        completed: true,
        winnerId: match.winnerId
      });
    }
  });
  
  // Display matches
  todaysMatches.forEach(match => {
    const player1 = playersData[match.player1Id];
    const player2 = playersData[match.player2Id];
    
    const matchCard = document.createElement('div');
    matchCard.className = `match-card ${match.completed ? 'completed' : ''}`;
    
    if (match.completed && match.winnerId) {
      const winner = playersData[match.winnerId];
      if (winner) {
        matchCard.innerHTML += `
          <div class="winner-badge">
            Winner: ${winner.name.split(' ')[0]}
          </div>
        `;
      }
    }
    
    matchCard.innerHTML += `
      <div class="teams">
        <div class="team">
          <img src="images/${player1 ? player1.img : 'default-player.jpg'}" 
               alt="${player1 ? player1.name : 'Player 1'}" 
               onclick="showPlayerDetails('${match.player1Id}')" 
               class="clickable-player">
          <span onclick="showPlayerDetails('${match.player1Id}')" class="clickable-player">${player1 ? player1.name : 'Player 1'}</span>
        </div>
        <div class="vs">
          VS
          ${match.score ? `<div class="match-score ${getScoreClass(match, match.player1Id)}">${match.score}</div>` : ''}
        </div>
        <div class="team">
          <img src="images/${player2 ? player2.img : 'default-player.jpg'}" 
               alt="${player2 ? player2.name : 'Player 2'}" 
               onclick="showPlayerDetails('${match.player2Id}')" 
               class="clickable-player">
          <span onclick="showPlayerDetails('${match.player2Id}')" class="clickable-player">${player2 ? player2.name : 'Player 2'}</span>
        </div>
      </div>
      <div class="match-info">
        <span class="league">${match.group}</span>
        ${match.completed ? 
          `<span class="match-status status-completed">Completed</span>` :
          `<span class="match-status status-upcoming">${match.time}</span>`
        }
      </div>
    `;
    
    container.appendChild(matchCard);
  });
}

function generateStandings(data) {
  const container = document.getElementById('standingsContainer');
  container.innerHTML = '';
  
  // Get all groups from fixtures
  const groups = [...new Set(data.fixtures.map(f => f.group))];
  
  groups.forEach(group => {
    // Create group standings element
    const groupElement = document.createElement('div');
    groupElement.className = 'group-standings';
    groupElement.innerHTML = `
      <div class="group-title">${group}</div>
      <table class="group-standings-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Player</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody id="standings-${group.replace(' ', '')}">
          <!-- Will be populated -->
        </tbody>
      </table>
    `;
    
    container.appendChild(groupElement);
    
    // Get players in this group
    const groupPlayers = Object.values(playersData).filter(player => 
      player.tournamentStats && player.tournamentStats.group === group.replace('Group ', '')
    );
    
    // Sort by position
    groupPlayers.sort((a, b) => a.tournamentStats.groupPosition - b.tournamentStats.groupPosition);
    
    // Populate table
    const tbody = document.getElementById(`standings-${group.replace(' ', '')}`);
    groupPlayers.forEach(player => {
      const row = document.createElement('tr');
      row.className = 'clickable-player';
      row.onclick = () => showPlayerDetails(player.id);
      
      row.innerHTML = `
        <td>${player.tournamentStats.groupPosition}</td>
        <td class="team-cell">
          <img src="images/${player.img}" alt="${player.name}"> 
          <span>${player.name}</span>
        </td>
        <td>${player.tournamentStats.matchesPlayed || 0}</td>
        <td>${player.tournamentStats.wins || 0}</td>
        <td>${player.tournamentStats.draws || 0}</td>
        <td>${player.tournamentStats.losses || 0}</td>
        <td>${player.tournamentStats.goalsFor || 0}</td>
        <td>${player.tournamentStats.goalsAgainst || 0}</td>
        <td>${(player.tournamentStats.goalsFor || 0) - (player.tournamentStats.goalsAgainst || 0)}</td>
        <td>${player.tournamentStats.points || 0}</td>
      `;
      
      tbody.appendChild(row);
    });
  });
}

// Generate fixture cards
async function generateFixtureCards() {
  const fixtureContainer = document.getElementById('fixtureList');
  fixtureContainer.innerHTML = '';
  
  try {
    // Load fixture data from JSON file
    const response = await fetch('data/fixtures.json');
    const data = await response.json();
    
    // Process the fixture data
    const fixtures = data.fixtures || [];
    const completedMatches = data.completedMatches || [];
    
    // Add completed matches as a special group
    if (completedMatches.length > 0) {
      fixtures.push({
        group: "Completed Matches",
        round: "Recent Results",
        matches: completedMatches.map(match => {
          const player1 = playersData[match.player1Id];
          const player2 = playersData[match.player2Id];
          return {
            player1: player1 ? player1.name : 'Player 1',
            player2: player2 ? player2.name : 'Player 2',
            player1Id: match.player1Id,
            player2Id: match.player2Id,
            time: match.date,
            status: 'Completed',
            score: match.score,
            completed: true,
            winnerId: match.winnerId
          };
        })
      });
    }
    
    // Generate fixture cards
    fixtures.forEach(fixtureGroup => {
      const roundElement = document.createElement('div');
      roundElement.className = 'fixture-round';
      roundElement.dataset.group = fixtureGroup.group.replace('Group ', '');
      roundElement.dataset.round = fixtureGroup.round.replace('Round ', '');
      roundElement.dataset.status = fixtureGroup.group === 'Completed Matches' ? 'completed' : 'upcoming';
      
      roundElement.innerHTML = `
        <h3 class="fixture-date">
          <i class="fas fa-${fixtureGroup.group === 'Completed Matches' ? 'history' : 'calendar'}"></i>
          ${fixtureGroup.group} - ${fixtureGroup.round}
        </h3>
      `;
      
      fixtureGroup.matches.forEach(match => {
        const player1Id = match.player1Id || playerNameToIdMap[match.player1];
        const player2Id = match.player2Id || playerNameToIdMap[match.player2];
        const player1 = playersData[player1Id];
        const player2 = playersData[player2Id];
        
        const player1Initials = player1 ? player1.name.split(' ').map(n => n[0]).join('') : 'P1';
        const player2Initials = player2 ? player2.name.split(' ').map(n => n[0]).join('') : 'P2';
        
        const matchCard = document.createElement('div');
        matchCard.className = `match-card ${match.completed ? 'completed' : ''}`;
        
        if (match.completed && match.winnerId) {
          const winner = playersData[match.winnerId];
          if (winner) {
            matchCard.innerHTML += `
              <div class="winner-badge">
                Winner: ${winner.name.split(' ')[0]}
              </div>
            `;
          }
        }
        
        matchCard.innerHTML += `
          <div class="teams">
            <div class="team">
              <img src="images/${player1 ? player1.img : `default-player.jpg`}" 
                   alt="${match.player1}" 
                   onclick="showPlayerDetails('${player1Id}')" 
                   class="clickable-player">
              <span onclick="showPlayerDetails('${player1Id}')" class="clickable-player">${match.player1}</span>
            </div>
            <div class="vs">
              VS
              ${match.score ? `<div class="match-score ${getScoreClass(match, player1Id)}">${match.score}</div>` : ''}
            </div>
            <div class="team">
              <img src="images/${player2 ? player2.img : `default-player.jpg`}" 
                   alt="${match.player2}" 
                   onclick="showPlayerDetails('${player2Id}')" 
                   class="clickable-player">
              <span onclick="showPlayerDetails('${player2Id}')" class="clickable-player">${match.player2}</span>
            </div>
          </div>
          <div class="match-info">
            <span class="league">${fixtureGroup.group}</span>
            ${match.completed ? 
              `<span class="match-status status-completed">Completed</span>` :
              `<span class="match-status status-upcoming">${match.time}</span>`
            }
          </div>
        `;
        roundElement.appendChild(matchCard);
      });
      
      fixtureContainer.appendChild(roundElement);
    });
    
  } catch (error) {
    console.error('Error loading fixture data:', error);
    fixtureContainer.innerHTML = '<p>Error loading fixtures. Please try again later.</p>';
  }
}

function filterFixtures(group, round) {
  const fixtures = document.querySelectorAll('.fixture-round');
  
  fixtures.forEach(fixture => {
    const fixtureGroup = fixture.dataset.group;
    const fixtureRound = fixture.dataset.round;
    
    const showFixture = 
      (group === 'all' || 
       (group === 'completed' && fixture.dataset.status === 'completed') || 
       fixtureGroup === group) &&
      (round === 'all' || fixtureRound === round);
    
    fixture.style.display = showFixture ? 'block' : 'none';
  });
}

function getScoreClass(match, playerId) {
  if (!match.score || !match.winnerId) return '';
  
  if (match.winnerId === 'draw') return 'draw';
  return match.winnerId === playerId ? 'win' : 'loss';
}