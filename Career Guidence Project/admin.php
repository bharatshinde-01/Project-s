<?php
/**
 * Admin Dashboard
 * Displays all student records
 * Protected - requires admin login
 */
 
// Start session
session_start(); 

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // Not logged in - redirect to login page
    header("Location: login.php");
    exit();
}

// Include database connection
require_once 'db.php';

// Fetch all student records
$sql = "SELECT id, name, email, stream, interest, suggested_career, created_at 
        FROM students 
        ORDER BY created_at DESC";
$result = mysqli_query($conn, $sql);

// Get total count
$countResult = mysqli_query($conn, "SELECT COUNT(*) as total FROM students");
$totalStudents = mysqli_fetch_assoc($countResult)['total'];

// Get stream-wise statistics
$statsQuery = "SELECT stream, COUNT(*) as count FROM students GROUP BY stream";
$statsResult = mysqli_query($conn, $statsQuery);
$streamStats = [];
while ($row = mysqli_fetch_assoc($statsResult)) {
    $streamStats[$row['stream']] = $row['count'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - CareerPath</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: #f1f5f9;
            min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 260px;
            background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 20px;
            z-index: 100;
        }

        .sidebar-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px 10px;
            margin-bottom: 30px;
        }

        .sidebar-brand i {
            font-size: 2rem;
            color: #2563eb;
        }

        .sidebar-brand h2 {
            font-size: 1.3rem;
        }

        .sidebar-menu {
            list-style: none;
        }

        .sidebar-menu li {
            margin-bottom: 5px;
        }

        .sidebar-menu a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            color: #94a3b8;
            text-decoration: none;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .sidebar-menu a:hover,
        .sidebar-menu a.active {
            background: rgba(37, 99, 235, 0.2);
            color: white;
        }

        .sidebar-menu a.active {
            background: #2563eb;
        }

        .sidebar-menu i {
            width: 20px;
        }

        /* Main Content */
        .main-content {
            margin-left: 260px;
            padding: 20px 30px;
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            background: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .header h1 {
            font-size: 1.5rem;
            color: #0f172a;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .admin-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .admin-avatar {
            width: 40px;
            height: 40px;
            background: #2563eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }

        .btn-logout {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .btn-logout:hover {
            background: #dc2626;
            transform: translateY(-2px);
        }

        /* Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .stat-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
        }

        .stat-icon.blue { background: #dbeafe; color: #2563eb; }
        .stat-icon.green { background: #dcfce7; color: #16a34a; }
        .stat-icon.purple { background: #f3e8ff; color: #9333ea; }
        .stat-icon.orange { background: #ffedd5; color: #ea580c; }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #0f172a;
        }

        .stat-label {
            color: #64748b;
            font-size: 0.9rem;
        }

        /* Data Table */
        .table-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }

        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid #e2e8f0;
        }

        .table-header h2 {
            font-size: 1.2rem;
            color: #0f172a;
        }

        .search-box {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #f8fafc;
            padding: 8px 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .search-box input {
            border: none;
            background: none;
            outline: none;
            font-family: inherit;
            font-size: 0.9rem;
            width: 200px;
        }

        .search-box i {
            color: #64748b;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 15px 20px;
            text-align: left;
        }

        th {
            background: #f8fafc;
            font-weight: 600;
            color: #475569;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
        }

        tr:hover {
            background: #f8fafc;
        }

        .stream-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .stream-badge.science { background: #dbeafe; color: #1d4ed8; }
        .stream-badge.commerce { background: #dcfce7; color: #16a34a; }
        .stream-badge.arts { background: #fef3c7; color: #d97706; }

        .no-data {
            text-align: center;
            padding: 60px 20px;
            color: #64748b;
        }

        .no-data i {
            font-size: 4rem;
            color: #cbd5e1;
            margin-bottom: 15px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .sidebar {
                width: 80px;
                padding: 15px 10px;
            }

            .sidebar-brand h2,
            .sidebar-menu span {
                display: none;
            }

            .sidebar-brand {
                justify-content: center;
            }

            .sidebar-menu a {
                justify-content: center;
                padding: 15px;
            }

            .main-content {
                margin-left: 80px;
            }
        }

        @media (max-width: 768px) {
            .sidebar {
                display: none;
            }

            .main-content {
                margin-left: 0;
                padding: 15px;
            }

            .header {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            table {
                display: block;
                overflow-x: auto;
            }
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <i class="fas fa-graduation-cap"></i>
            <h2>CareerPath</h2>
        </div>
        <ul class="sidebar-menu">
            <li>
                <a href="admin.php" class="active">
                    <i class="fas fa-chart-pie"></i>
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="index.html">
                    <i class="fas fa-globe"></i>
                    <span>View Website</span>
                </a>
            </li>
            <li>
                <a href="logout.php">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            </li>
        </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Header -->
        <div class="header">
            <h1>Student Records Dashboard</h1>
            <div class="header-right">
                <div class="admin-info">
                    <div class="admin-avatar">
                        <?php echo strtoupper(substr($_SESSION['admin_username'], 0, 1)); ?>
                    </div>
                    <span><?php echo htmlspecialchars($_SESSION['admin_username']); ?></span>
                </div>
                <a href="logout.php" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </a>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-card-header">
                    <div>
                        <div class="stat-value"><?php echo $totalStudents; ?></div>
                        <div class="stat-label">Total Students</div>
                    </div>
                    <div class="stat-icon blue">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-card-header">
                    <div>
                        <div class="stat-value"><?php echo isset($streamStats['Science']) ? $streamStats['Science'] : 0; ?></div>
                        <div class="stat-label">Science Students</div>
                    </div>
                    <div class="stat-icon green">
                        <i class="fas fa-flask"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-card-header">
                    <div>
                        <div class="stat-value"><?php echo isset($streamStats['Commerce']) ? $streamStats['Commerce'] : 0; ?></div>
                        <div class="stat-label">Commerce Students</div>
                    </div>
                    <div class="stat-icon purple">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-card-header">
                    <div>
                        <div class="stat-value"><?php echo isset($streamStats['Arts']) ? $streamStats['Arts'] : 0; ?></div>
                        <div class="stat-label">Arts Students</div>
                    </div>
                    <div class="stat-icon orange">
                        <i class="fas fa-palette"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Data Table -->
        <div class="table-container">
            <div class="table-header">
                <h2>All Student Records</h2>
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Search students..." onkeyup="filterTable()">
                </div>
            </div>
            
            <?php if ($result && mysqli_num_rows($result) > 0): ?>
            <table id="studentsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Stream</th>
                        <th>Interest</th>
                        <th>Suggested Career</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while ($row = mysqli_fetch_assoc($result)): ?>
                    <tr>
                        <td><?php echo $row['id']; ?></td>
                        <td><strong><?php echo htmlspecialchars($row['name']); ?></strong></td>
                        <td><?php echo htmlspecialchars($row['email'] ?: '-'); ?></td>
                        <td>
                            <span class="stream-badge <?php echo strtolower($row['stream']); ?>">
                                <?php echo htmlspecialchars($row['stream']); ?>
                            </span>
                        </td>
                        <td><?php echo htmlspecialchars($row['interest']); ?></td>
                        <td><?php echo htmlspecialchars($row['suggested_career']); ?></td>
                        <td><?php echo date('d M Y, h:i A', strtotime($row['created_at'])); ?></td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
            <?php else: ?>
            <div class="no-data">
                <i class="fas fa-inbox"></i>
                <h3>No Student Records Yet</h3>
                <p>Student data will appear here once they submit the career form on the website.</p>
            </div>
            <?php endif; ?>
        </div>
    </main>

    <script>
        // Search/Filter functionality
        function filterTable() {
            const input = document.getElementById('searchInput');
            const filter = input.value.toLowerCase();
            const table = document.getElementById('studentsTable');
            
            if (!table) return;
            
            const rows = table.getElementsByTagName('tr');

            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName('td');
                let found = false;

                for (let j = 0; j < cells.length; j++) {
                    if (cells[j].textContent.toLowerCase().includes(filter)) {
                        found = true;
                        break;
                    }
                }

                rows[i].style.display = found ? '' : 'none';
            }
        }
    </script>
</body>
</html>
<?php
// Close database connection
mysqli_close($conn);
?>
