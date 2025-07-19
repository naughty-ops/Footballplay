<?php
require_once 'includes/auth.php';
require_once 'includes/config.php';
require_once 'includes/header.php';

// Check for logout action
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    logout();
}
?>

<div class="admin-container">
    <aside class="admin-sidebar">
        <div class="admin-profile">
            <img src="../images/admin-avatar.png" alt="Admin">
            <h3><?= htmlspecialchars($_SESSION['admin_username']) ?></h3>
            <a href="?action=logout" class="btn btn-sm btn-logout">Logout</a>
        </div>
        
        <nav class="admin-nav">
            <ul>
                <li class="active"><a href="dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="players.php"><i class="fas fa-users"></i> Players</a></li>
                <li><a href="fixtures.php"><i class="fas fa-calendar-alt"></i> Fixtures</a></li>
                <li><a href="standings.php"><i class="fas fa-table"></i> Standings</a></li>
                <li><a href="settings.php"><i class="fas fa-cog"></i> Settings</a></li>
            </ul>
        </nav>
    </aside>
    
    <main class="admin-main">
        <header class="admin-header">
            <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
            <div class="admin-breadcrumb">
                <span>Admin</span> / <span class="active">Dashboard</span>
            </div>
        </header>
        
        <div class="admin-stats">
            <div class="stat-card">
                <div class="stat-value">24</div>
                <div class="stat-label">Active Players</div>
                <div class="stat-icon"><i class="fas fa-users"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-value">18</div>
                <div class="stat-label">Upcoming Matches</div>
                <div class="stat-icon"><i class="fas fa-calendar"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-value">42</div>
                <div class="stat-label">Completed Matches</div>
                <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-value">4</div>
                <div class="stat-label">Active Groups</div>
                <div class="stat-icon"><i class="fas fa-layer-group"></i></div>
            </div>
        </div>
        
        <section class="admin-section">
            <h2><i class="fas fa-bell"></i> Recent Activity</h2>
            <div class="activity-log">
                <div class="activity-item">
                    <div class="activity-icon"><i class="fas fa-user-plus"></i></div>
                    <div class="activity-content">
                        <p>New player <strong>Rahul Sharma</strong> was added</p>
                        <small>2 hours ago</small>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon"><i class="fas fa-edit"></i></div>
                    <div class="activity-content">
                        <p>Match result updated: <strong>Rahul vs Athul (3-1)</strong></p>
                        <small>5 hours ago</small>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon"><i class="fas fa-cog"></i></div>
                    <div class="activity-content">
                        <p>System settings were updated</p>
                        <small>Yesterday, 4:30 PM</small>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>

<?php require_once 'includes/footer.php'; ?>