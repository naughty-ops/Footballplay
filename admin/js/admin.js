document.addEventListener('DOMContentLoaded', () => {
  // Tab navigation
  const navBtns = document.querySelectorAll('.nav-btn');
  const adminSections = document.querySelectorAll('.admin-section');
  
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      adminSections.forEach(s => s.classList.remove('active'));
      
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.getElementById(`${tab}-section`).classList.add('active');
      
      // Load data when switching tabs
      switch(tab) {
        case 'players':
          loadPlayers();
          break;
        case 'fixtures':
          loadFixtures();
          break;
        case 'standings':
          loadStandings();
          break;
      }
    });
  });
  
  // Initialize modals
  const playerModal = document.getElementById('playerModal');
  const fixtureModal = document.getElementById('fixtureModal');
  const confirmModal = document.getElementById('confirmModal');
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === playerModal) playerModal.style.display = 'none';
    if (e.target === fixtureModal) fixtureModal.style.display = 'none';
    if (e.target === confirmModal) confirmModal.style.display = 'none';
  });
  
  // Player management
  const addPlayerBtn = document.getElementById('addPlayerBtn');
  const playerForm = document.getElementById('playerForm');
  
  addPlayerBtn.addEventListener('click', () => {
    document.getElementById('playerModalTitle').textContent = 'Add New Player';
    document.getElementById('playerId').value = '';
    playerForm.reset();
    document.getElementById('playerImagePreviewImg').src = '';
    playerModal.style.display = 'flex';
  });
  
  // Handle player image preview
  document.getElementById('playerImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('playerImagePreviewImg').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Fixture management
  const addFixtureBtn = document.getElementById('addFixtureBtn');
  const fixtureForm = document.getElementById('fixtureForm');
  const generateFixturesBtn = document.getElementById('generateFixturesBtn');
  
  addFixtureBtn.addEventListener('click', () => {
    document.getElementById('fixtureModalTitle').textContent = 'Add New Fixture';
    document.getElementById('fixtureId').value = '';
    fixtureForm.reset();
    document.getElementById('resultFields').style.display = 'none';
    populatePlayerSelects();
    fixtureModal.style.display = 'flex';
  });
  
  // Toggle result fields when completed checkbox is changed
  document.getElementById('fixtureCompleted').addEventListener('change', function() {
    document.getElementById('resultFields').style.display = this.checked ? 'flex' : 'none';
  });
  
  // Generate fixtures button
  generateFixturesBtn.addEventListener('click', () => {
    // This would generate a full round of fixtures for all groups
    // Implementation would depend on your specific requirements
    alert('Fixture generation would be implemented here based on your tournament structure');
  });
  
  // Standings management
  const updateStandingsBtn = document.getElementById('updateStandingsBtn');
  
  updateStandingsBtn.addEventListener('click', () => {
    // This would recalculate standings based on completed matches
    alert('Standings update would recalculate based on completed matches');
  });
  
  // Settings
  const backupBtn = document.getElementById('backupBtn');
  const restoreBtn = document.getElementById('restoreBtn');
  const testNotificationBtn = document.getElementById('testNotificationBtn');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  
  backupBtn.addEventListener('click', createBackup);
  restoreBtn.addEventListener('click', restoreBackup);
  testNotificationBtn.addEventListener('click', sendTestNotification);
  changePasswordBtn.addEventListener('click', changePassword);
  
  // Initial data load
  loadPlayers();
});

// Data loading functions
function loadPlayers() {
  fetch('../data/players.json')
    .then(response => response.json())
    .then(data => {
      const playersTable = document.getElementById('playersTable').getElementsByTagName('tbody')[0];
      playersTable.innerHTML = '';
      
      Object.values(data.players).forEach(player => {
        const row = playersTable.insertRow();
        row.innerHTML = `
          <td>${player.id}</td>
          <td>${player.name}</td>
          <td>${player.position}</td>
          <td>${player.points}</td>
          <td>${player.tournamentStats?.group || '-'}</td>
          <td>
            <button class="action-btn edit" data-id="${player.id}"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" data-id="${player.id}"><i class="fas fa-trash"></i></button>
          </td>
        `;
      });
      
      // Add event listeners to action buttons
      document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => editPlayer(btn.dataset.id));
      });
      
      document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => confirmDeletePlayer(btn.dataset.id));
      });
    })
    .catch(error => {
      console.error('Error loading players:', error);
    });
}

function loadFixtures() {
  fetch('../data/fixtures.json')
    .then(response => response.json())
    .then(data => {
      const fixturesTable = document.getElementById('fixturesTable').getElementsByTagName('tbody')[0];
      fixturesTable.innerHTML = '';
      
      // Process regular fixtures
      data.fixtures.forEach(group => {
        group.matches.forEach(match => {
          const player1 = getPlayerName(match.player1Id || match.player1);
          const player2 = getPlayerName(match.player2Id || match.player2);
          
          const row = fixturesTable.insertRow();
          row.innerHTML = `
            <td>${match.date}</td>
            <td>${player1}</td>
            <td>${player2}</td>
            <td>${group.group}</td>
            <td>${group.round}</td>
            <td><span class="status-upcoming">Upcoming</span></td>
            <td>-</td>
            <td>-</td>
            <td>
              <button class="action-btn edit" data-id="${match.id || ''}"><i class="fas fa-edit"></i></button>
              <button class="action-btn delete" data-id="${match.id || ''}"><i class="fas fa-trash"></i></button>
            </td>
          `;
        });
      });
      
      // Process completed matches
      data.completedMatches.forEach(match => {
        const player1 = getPlayerName(match.player1Id);
        const player2 = getPlayerName(match.player2Id);
        const winner = match.winnerId === 'draw' ? 'Draw' : getPlayerName(match.winnerId);
        
        const row = fixturesTable.insertRow();
        row.innerHTML = `
          <td>${match.date}</td>
          <td>${player1}</td>
          <td>${player2}</td>
          <td>${match.group}</td>
          <td>-</td>
          <td><span class="status-completed">Completed</span></td>
          <td>${match.score}</td>
          <td>${winner}</td>
          <td>
            <button class="action-btn edit" data-id="${match.id || ''}"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" data-id="${match.id || ''}"><i class="fas fa-trash"></i></button>
          </td>
        `;
      });
      
      // Add event listeners to action buttons
      document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => editFixture(btn.dataset.id));
      });
      
      document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => confirmDeleteFixture(btn.dataset.id));
      });
    })
    .catch(error => {
      console.error('Error loading fixtures:', error);
    });
}

function loadStandings() {
  fetch('../data/standings.json')
    .then(response => response.json())
    .then(data => {
      const standingsTable = document.getElementById('standingsTable').getElementsByTagName('tbody')[0];
      standingsTable.innerHTML = '';
      
      data.groups.forEach(group => {
        group.teams.forEach(team => {
          const row = standingsTable.insertRow();
          row.innerHTML = `
            <td>${team.position}</td>
            <td>${team.name}</td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.drawn}</td>
            <td>${team.lost}</td>
            <td>${team.goalsFor}</td>
            <td>${team.goalsAgainst}</td>
            <td>${team.goalsFor - team.goalsAgainst}</td>
            <td>${team.points}</td>
            <td>
              <button class="action-btn edit" data-id="${team.id}"><i class="fas fa-edit"></i></button>
            </td>
          `;
        });
      });
      
      // Add event listeners to action buttons
      document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => editStanding(btn.dataset.id));
      });
    })
    .catch(error => {
      console.error('Error loading standings:', error);
    });
}

// Helper functions
function getPlayerName(identifier) {
  // This would look up the player name from the players data
  // Implementation would depend on your data structure
  return identifier; // Placeholder
}

function populatePlayerSelects() {
  const player1Select = document.getElementById('player1Select');
  const player2Select = document.getElementById('player2Select');
  
  // Clear existing options
  player1Select.innerHTML = '<option value="">Select Player</option>';
  player2Select.innerHTML = '<option value="">Select Player</option>';
  
  // Load players and populate selects
  fetch('../data/players.json')
    .then(response => response.json())
    .then(data => {
      Object.values(data.players).forEach(player => {
        const option1 = document.createElement('option');
        option1.value = player.id;
        option1.textContent = player.name;
        player1Select.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = player.id;
        option2.textContent = player.name;
        player2Select.appendChild(option2);
      });
    });
}

// CRUD operations
function editPlayer(playerId) {
  fetch('../data/players.json')
    .then(response => response.json())
    .then(data => {
      const player = data.players[playerId];
      if (player) {
        document.getElementById('playerModalTitle').textContent = 'Edit Player';
        document.getElementById('playerId').value = player.id;
        document.getElementById('playerName').value = player.name;
        document.getElementById('playerPoints').value = player.points;
        document.getElementById('playerPosition').value = player.position;
        document.getElementById('playerGroup').value = player.tournamentStats?.group || '';
        document.getElementById('playerImagePreviewImg').src = player.img || '';
        
        document.getElementById('playerModal').style.display = 'flex';
      }
    });
}

function confirmDeletePlayer(playerId) {
  const confirmModal = document.getElementById('confirmModal');
  document.getElementById('confirmModalTitle').textContent = 'Delete Player';
  document.getElementById('confirmModalMessage').textContent = `Are you sure you want to delete this player? This action cannot be undone.`;
  
  document.getElementById('confirmBtn').onclick = () => {
    deletePlayer(playerId);
    confirmModal.style.display = 'none';
  };
  
  confirmModal.style.display = 'flex';
}

function deletePlayer(playerId) {
  // In a real implementation, this would send a request to your backend
  console.log(`Deleting player ${playerId}`);
  alert(`Player ${playerId} would be deleted in a real implementation`);
  // Then reload the players list
  loadPlayers();
}

function editFixture(fixtureId) {
  // Similar to editPlayer but for fixtures
  document.getElementById('fixtureModalTitle').textContent = 'Edit Fixture';
  // Populate form with fixture data
  document.getElementById('fixtureModal').style.display = 'flex';
}

function confirmDeleteFixture(fixtureId) {
  const confirmModal = document.getElementById('confirmModal');
  document.getElementById('confirmModalTitle').textContent = 'Delete Fixture';
  document.getElementById('confirmModalMessage').textContent = `Are you sure you want to delete this fixture? This action cannot be undone.`;
  
  document.getElementById('confirmBtn').onclick = () => {
    deleteFixture(fixtureId);
    confirmModal.style.display = 'none';
  };
  
  confirmModal.style.display = 'flex';
}

function deleteFixture(fixtureId) {
  // In a real implementation, this would send a request to your backend
  console.log(`Deleting fixture ${fixtureId}`);
  alert(`Fixture ${fixtureId} would be deleted in a real implementation`);
  // Then reload the fixtures list
  loadFixtures();
}

function editStanding(teamId) {
  // Similar to editPlayer but for standings
  alert(`Editing standing for team ${teamId}`);
}

// Settings functions
function createBackup() {
  // Create a JSON backup of all data
  Promise.all([
    fetch('../data/players.json').then(r => r.json()),
    fetch('../data/fixtures.json').then(r => r.json()),
    fetch('../data/standings.json').then(r => r.json())
  ]).then(([players, fixtures, standings]) => {
    const backupData = {
      players,
      fixtures,
      standings,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `football-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  });
}

function restoreBackup() {
  const fileInput = document.getElementById('restoreFile');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a backup file first');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const backupData = JSON.parse(e.target.result);
      
      // In a real implementation, you would send this to your backend
      console.log('Backup data:', backupData);
      alert('Backup would be restored in a real implementation');
      
      // Then reload all data
      loadPlayers();
      loadFixtures();
      loadStandings();
    } catch (error) {
      console.error('Error parsing backup file:', error);
      alert('Invalid backup file format');
    }
  };
  reader.readAsText(file);
}

function sendTestNotification() {
  // This would send a test notification
  alert('Test notification would be sent in a real implementation');
}

function changePassword() {
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (!newPassword || !confirmPassword) {
    alert('Please enter both password fields');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  // In a real implementation, this would send a request to your backend
  console.log(`Password would be changed to: ${newPassword}`);
  alert('Password would be changed in a real implementation');
  
  // Clear the fields
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
}

// Form submissions
document.getElementById('playerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const playerData = {
    id: document.getElementById('playerId').value || generateId(),
    name: document.getElementById('playerName').value,
    points: parseInt(document.getElementById('playerPoints').value),
    position: parseInt(document.getElementById('playerPosition').value),
    tournamentStats: {
      group: document.getElementById('playerGroup').value
    }
    // Add other fields as needed
  };
  
  // In a real implementation, this would send to your backend
  console.log('Saving player:', playerData);
  alert('Player would be saved in a real implementation');
  
  // Close modal and refresh
  document.getElementById('playerModal').style.display = 'none';
  loadPlayers();
});

document.getElementById('fixtureForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fixtureData = {
    id: document.getElementById('fixtureId').value || generateId(),
    player1Id: document.getElementById('player1Select').value,
    player2Id: document.getElementById('player2Select').value,
    date: document.getElementById('fixtureDate').value,
    time: document.getElementById('fixtureTime').value,
    group: document.getElementById('fixtureGroup').value,
    round: document.getElementById('fixtureRound').value,
    completed: document.getElementById('fixtureCompleted').checked,
    score: document.getElementById('fixtureScore').value,
    winner: document.getElementById('fixtureWinner').value
  };
  
  // In a real implementation, this would send to your backend
  console.log('Saving fixture:', fixtureData);
  alert('Fixture would be saved in a real implementation');
  
  // Close modal and refresh
  document.getElementById('fixtureModal').style.display = 'none';
  loadFixtures();
});

function generateId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}