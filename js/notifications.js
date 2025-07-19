// Notification system
function showNotification(type, title, message, duration = 5000) {
  const container = document.getElementById('notificationContainer');
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  let icon;
  switch(type) {
    case 'win':
      icon = '<i class="fas fa-trophy notification-icon"></i>';
      break;
    case 'loss':
      icon = '<i class="fas fa-times-circle notification-icon"></i>';
      break;
    case 'draw':
      icon = '<i class="fas fa-equals notification-icon"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle notification-icon"></i>';
  }
  
  notification.innerHTML = `
    ${icon}
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <div class="notification-close" onclick="this.parentElement.remove()">&times;</div>
    <div class="notification-progress">
      <div class="notification-progress-bar" style="animation-duration: ${duration/1000}s"></div>
    </div>
  `;
  
  container.appendChild(notification);
  
  // Trigger the animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto remove after duration
  if (duration) {
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  }
}

function showMatchCompletionNotifications() {
  // Load completed matches from fixtures.json
  fetch('data/fixtures.json')
    .then(response => response.json())
    .then(data => {
      const completedMatches = data.completedMatches || [];
      completedMatches.forEach(match => {
        const player1 = playersData[match.player1Id];
        const player2 = playersData[match.player2Id];
        
        if (player1 && player2) {
          const winner = match.winnerId === match.player1Id ? player1 : player2;
          const loser = match.winnerId === match.player1Id ? player2 : player1;
          const isDraw = match.winnerId === 'draw';
          
          if (isDraw) {
            showNotification(
              'draw', 
              'Match Ended in Draw', 
              `${player1.name} ${match.score} ${player2.name}`,
              6000
            );
          } else {
            showNotification(
              'win', 
              'Match Completed', 
              `${winner.name} defeated ${loser.name} ${match.score}`,
              6000
            );
          }
        }
      });
    })
    .catch(error => {
      console.error('Error loading completed matches:', error);
    });
}