<?php
require_once __DIR__ . '/config.php';

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            initDB($pdo);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database Connection Failed: " . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}

function initDB($pdo) {
    // Create Categories Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE
    ) ENGINE=InnoDB;");

    // Create Products Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sku VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price DECIMAL(12,2) NOT NULL,
        compare_price DECIMAL(12,2) DEFAULT NULL,
        metal_type VARCHAR(50) DEFAULT '18K Gold',
        gemstone VARCHAR(50) DEFAULT 'Diamond',
        carat_weight DECIMAL(4,2) DEFAULT 1.00,
        ring_size VARCHAR(10) DEFAULT '7',
        stock_qty INT DEFAULT 10,
        is_active TINYINT(1) DEFAULT 1,
        is_featured TINYINT(1) DEFAULT 0,
        is_new_arrival TINYINT(1) DEFAULT 0,
        is_best_seller TINYINT(1) DEFAULT 0,
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;");

    // Create Product Images Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        url TEXT NOT NULL,
        is_primary TINYINT(1) DEFAULT 0,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;");

    // Create Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(30),
        role VARCHAR(20) DEFAULT 'customer',
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");

    // Create Orders Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        user_id VARCHAR(36) NULL,
        customer_name VARCHAR(200) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        shipping_address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        notes TEXT,
        payment_method VARCHAR(50) DEFAULT 'cod',
        payment_status VARCHAR(50) DEFAULT 'pending',
        order_status VARCHAR(50) DEFAULT 'processing',
        subtotal DECIMAL(12,2) NOT NULL,
        tax_amount DECIMAL(12,2) DEFAULT 0,
        shipping_fee DECIMAL(12,2) DEFAULT 250,
        total_amount DECIMAL(12,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");

    // Create Order Items Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT,
        product_name VARCHAR(255) NOT NULL,
        metal_type VARCHAR(50),
        unit_price DECIMAL(12,2) NOT NULL,
        quantity INT NOT NULL,
        line_total DECIMAL(12,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;");

    // Create Site Settings Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT NOT NULL,
        label VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB;");

    // Seed initial data if empty
    seedData($pdo);
}

function seedData($pdo) {
    // Check if seeded
    $stmt = $pdo->query("SELECT COUNT(*) FROM categories");
    if ($stmt->fetchColumn() > 0) {
        return;
    }

    // Insert Admin User
    $adminPasswordHash = password_hash('admin123', PASSWORD_DEFAULT);
    $pdo->prepare("INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, role) 
                   VALUES ('11111111-1111-1111-1111-111111111111', 'admin@senka.com', ?, 'Senka', 'Admin', '03320409268', 'admin')")
        ->execute([$adminPasswordHash]);

    // Insert Categories
    $categories = [
        ['Solitaire Rings', 'rings'],
        ['Necklaces & Pendants', 'necklaces'],
        ['Earrings & Studs', 'earrings'],
        ['Bangles & Bracelets', 'bracelets'],
        ['Bridal Sets', 'bridal'],
        ['Bespoke & Custom', 'custom']
    ];
    $catStmt = $pdo->prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
    foreach ($categories as $cat) {
        $catStmt->execute($cat);
    }

    // Insert Products
    $products = [
        [1, 'RN-SOL-001', 'Royal Solitaire Halo Ring', 'royal-solitaire-halo-ring', 'Exquisite 2-carat VVS1 clarity diamond surrounded by a micro-pave halo set in 18K yellow gold.', 249000.00, 280000.00, '18K Gold', 'Diamond', 2.00, '7', 1, 1, 1],
        [2, 'NC-EMR-002', 'Pearl Emerald Pendant Set', 'pearl-emerald-pendant-set', 'Handcrafted 18K white gold pendant featuring a 3.5ct Colombian emerald accented with cultured South Sea pearls.', 185000.00, 210000.00, '18K Gold', 'Emerald', 3.50, 'N/A', 1, 1, 0],
        [3, 'ER-DRP-003', 'Celestial Diamond Drop Earrings', 'celestial-diamond-drop-earrings', 'Cascading drop earrings featuring round brilliant cut diamonds totaling 1.8 carats in platinum setting.', 310000.00, 350000.00, 'Platinum', 'Diamond', 1.80, 'N/A', 1, 0, 1],
        [4, 'BR-GLD-004', 'Art Deco Gold Cuff Bangle', 'art-deco-gold-cuff-bangle', 'Intricately engraved 22K solid gold cuff bangle inspired by vintage royal heritage.', 420000.00, NULL, '22K Gold', 'None', 0.00, 'N/A', 1, 0, 0],
        [5, 'SET-BDL-005', 'Imperial Heritage Bridal Set', 'imperial-heritage-bridal-set', 'Complete bridal ensemble including choker necklace, drop earrings, maang tikka, and bangles in 22K gold with uncut diamonds (Polki).', 1250000.00, 1400000.00, '22K Gold', 'Polki / Uncut Diamond', 12.50, 'N/A', 1, 1, 1],
        [6, 'RN-SAP-006', 'Sapphire & Diamond Band', 'sapphire-diamond-band', 'Alternating blue sapphires and round diamonds set in a timeless 18K rose gold eternity band.', 145000.00, NULL, '18K Gold', 'Sapphire', 1.20, '6.5', 1, 0, 0]
    ];

    $prodStmt = $pdo->prepare("INSERT INTO products (category_id, sku, name, slug, description, price, compare_price, metal_type, gemstone, carat_weight, ring_size, is_featured, is_new_arrival, is_best_seller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $imgStmt = $pdo->prepare("INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, 1)");

    $images = [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1611591475143-4f8a7739e878?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80"
    ];

    foreach ($products as $index => $prod) {
        $prodStmt->execute($prod);
        $prodId = $pdo->lastInsertId();
        $imgStmt->execute([$prodId, $images[$index]]);
    }

    // Insert Default Site Settings
    $settings = [
        ['contact_email', 'Senkajewellers@gmail.com', 'Contact Email'],
        ['contact_phone', '03320409268', 'Contact Phone'],
        ['contact_address', 'G9 Islamabad, Pakistan', 'Studio Address'],
        ['delivery_charge', '250', 'Delivery Charge (PKR)'],
        ['banner_text', 'Worldwide Insured Express Delivery | Complimentary Luxury Gift Box With Every Order', 'Announcement Banner']
    ];
    $settStmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value, label) VALUES (?, ?, ?)");
    foreach ($settings as $s) {
        $settStmt->execute($s);
    }
}
