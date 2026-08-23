<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$pdo = getDB();

$uri = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
if (empty($uri)) $uri = '/api';

$method = $_SERVER['REQUEST_METHOD'];

function getJsonBody() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?: [];
}

// ─────────────────────────────────────────────
// 1. HEALTH & ROOT
// ─────────────────────────────────────────────
if ($uri === '/api/health' || $uri === '/api') {
    echo json_encode([
        "status" => "ok",
        "service" => "senka-api",
        "version" => "2.0.0",
        "database" => "MySQL (Native PHP PDO)"
    ]);
    exit;
}

// ─────────────────────────────────────────────
// 2. CATEGORIES (GET, POST)
// ─────────────────────────────────────────────
if ($uri === '/api/categories') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM categories ORDER BY id ASC");
        echo json_encode($stmt->fetchAll());
        exit;
    }
    if ($method === 'POST') {
        $body = getJsonBody();
        $name = trim($body['name'] ?? '');
        $slug = trim($body['slug'] ?? strtolower(str_replace(' ', '-', $name)));
        
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(["detail" => "Category name is required"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
        $stmt->execute([$name, $slug]);
        $id = $pdo->lastInsertId();

        echo json_encode(["id" => $id, "name" => $name, "slug" => $slug]);
        exit;
    }
}

// ─────────────────────────────────────────────
// 3. PRODUCTS (GET List/Single, POST, PUT, DELETE)
// ─────────────────────────────────────────────
if (preg_match('#^/api/products(?:/([a-zA-Z0-9_-]+))?$#', $uri, $matches)) {
    $param = isset($matches[1]) ? $matches[1] : null;

    if ($method === 'GET') {
        if ($param) {
            // Get single product
            $stmt = $pdo->prepare("SELECT p.*, c.name as category_name, c.slug as category_slug 
                                   FROM products p 
                                   LEFT JOIN categories c ON p.category_id = c.id 
                                   WHERE p.id = ? OR p.slug = ?");
            $stmt->execute([$param, $param]);
            $product = $stmt->fetch();

            if (!$product) {
                http_response_code(404);
                echo json_encode(["detail" => "Product not found"]);
                exit;
            }

            $imgStmt = $pdo->prepare("SELECT url, is_primary FROM product_images WHERE product_id = ? ORDER BY sort_order ASC");
            $imgStmt->execute([$product['id']]);
            $images = $imgStmt->fetchAll();

            $product['images'] = array_column($images, 'url');
            $product['image_url'] = !empty($images) ? $images[0]['url'] : null;

            echo json_encode($product);
            exit;
        } else {
            // Product list search & filters
            $where = ["p.is_active = 1"];
            $params = [];

            if (!empty($_GET['search'])) {
                $searchTerm = '%' . trim($_GET['search']) . '%';
                $where[] = "(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ? OR c.name LIKE ?)";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            if (!empty($_GET['category'])) {
                $where[] = "(c.slug = ? OR c.name = ?)";
                $params[] = trim($_GET['category']);
                $params[] = trim($_GET['category']);
            }

            if (!empty($_GET['metal'])) {
                $where[] = "p.metal_type = ?";
                $params[] = trim($_GET['metal']);
            }

            $orderBy = "ORDER BY p.id DESC";
            if (isset($_GET['sort'])) {
                if ($_GET['sort'] === 'price_asc') $orderBy = "ORDER BY p.price ASC";
                if ($_GET['sort'] === 'price_desc') $orderBy = "ORDER BY p.price DESC";
                if ($_GET['sort'] === 'newest') $orderBy = "ORDER BY p.id DESC";
            }

            $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug 
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id 
                    WHERE " . implode(" AND ", $where) . " " . $orderBy;

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $products = $stmt->fetchAll();

            foreach ($products as &$p) {
                $imgStmt = $pdo->prepare("SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC LIMIT 1");
                $imgStmt->execute([$p['id']]);
                $img = $imgStmt->fetch();
                $p['image_url'] = $img ? $img['url'] : null;
                $p['images'] = $img ? [$img['url']] : [];
            }

            echo json_encode($products);
            exit;
        }
    }

    if ($method === 'POST') {
        $body = getJsonBody();
        $stmt = $pdo->prepare("INSERT INTO products (sku, name, slug, description, price, compare_price, metal_type, gemstone, carat_weight, ring_size, stock_qty, category_id, is_featured, is_new_arrival, is_best_seller) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $slug = $body['slug'] ?? strtolower(str_replace(' ', '-', $body['name']));
        $stmt->execute([
            $body['sku'] ?? ('SKU-' . time()),
            $body['name'],
            $slug,
            $body['description'] ?? '',
            $body['price'],
            $body['compare_price'] ?? null,
            $body['metal_type'] ?? '18K Gold',
            $body['gemstone'] ?? 'Diamond',
            $body['carat_weight'] ?? 1.0,
            $body['ring_size'] ?? '7',
            $body['stock_qty'] ?? 10,
            $body['category_id'] ?? 1,
            $body['is_featured'] ?? 1,
            $body['is_new_arrival'] ?? 0,
            $body['is_best_seller'] ?? 0
        ]);
        $prodId = $pdo->lastInsertId();

        if (!empty($body['image_url'])) {
            $pdo->prepare("INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, 1)")->execute([$prodId, $body['image_url']]);
        }

        echo json_encode(["id" => $prodId, "message" => "Product created successfully"]);
        exit;
    }

    if ($method === 'PUT' && $param) {
        $body = getJsonBody();
        $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, compare_price = ?, description = ?, metal_type = ?, is_featured = ? WHERE id = ?");
        $stmt->execute([
            $body['name'], $body['price'], $body['compare_price'] ?? null,
            $body['description'] ?? '', $body['metal_type'] ?? '18K Gold',
            $body['is_featured'] ?? 1, $param
        ]);
        echo json_encode(["message" => "Product updated successfully"]);
        exit;
    }

    if ($method === 'DELETE' && $param) {
        $pdo->prepare("DELETE FROM products WHERE id = ?")->execute([$param]);
        echo json_encode(["message" => "Product deleted successfully"]);
        exit;
    }
}

// ─────────────────────────────────────────────
// 4. ORDERS & CUSTOMER HISTORY
// ─────────────────────────────────────────────
if ($uri === '/api/orders/my') {
    if ($method === 'GET') {
        $email = trim($_GET['email'] ?? '');
        if (empty($email)) {
            echo json_encode([]);
            exit;
        }
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE LOWER(customer_email) = LOWER(?) ORDER BY id DESC");
        $stmt->execute([$email]);
        $orders = $stmt->fetchAll();
        foreach ($orders as &$ord) {
            $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $itemStmt->execute([$ord['id']]);
            $ord['items'] = $itemStmt->fetchAll();
        }
        echo json_encode($orders);
        exit;
    }
}

if ($uri === '/api/orders') {
    if ($method === 'POST') {
        $body = getJsonBody();

        $orderNumber = "SNK-" . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));
        $customerName = trim(($body['customer_name'] ?? 'Guest') . ' ' . ($body['customer_last_name'] ?? ''));
        $customerEmail = trim($body['customer_email'] ?? '');
        $customerPhone = trim($body['customer_phone'] ?? '');
        $shippingAddress = trim($body['shipping_address'] ?? '');
        $city = trim($body['city'] ?? 'Islamabad');
        $notes = trim($body['notes'] ?? '');
        $items = $body['items'] ?? [];

        $shippingFee = 250.00;
        $subtotal = 0.00;

        foreach ($items as $item) {
            $subtotal += floatval($item['unit_price'] ?? 0) * intval($item['quantity'] ?? 1);
        }

        $totalAmount = $subtotal + $shippingFee;

        $stmt = $pdo->prepare("INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, city, notes, subtotal, shipping_fee, total_amount, payment_method, order_status)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cod', 'processing')");
        $stmt->execute([
            $orderNumber, $customerName, $customerEmail, $customerPhone, 
            $shippingAddress, $city, $notes, $subtotal, $shippingFee, $totalAmount
        ]);

        $orderId = $pdo->lastInsertId();

        $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, metal_type, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($items as $item) {
            $lineTotal = floatval($item['unit_price'] ?? 0) * intval($item['quantity'] ?? 1);
            $itemStmt->execute([
                $orderId, 
                $item['product_id'] ?? null, 
                $item['name'] ?? 'Jewelry Item', 
                $item['metal'] ?? '18K Gold', 
                $item['unit_price'] ?? 0, 
                $item['quantity'] ?? 1, 
                $lineTotal
            ]);
        }

        // Email dispatch
        sendOrderEmail($customerEmail, $customerName, $orderNumber, $totalAmount, $shippingFee, $items);

        echo json_encode([
            "id" => $orderId,
            "order_number" => $orderNumber,
            "status" => "processing",
            "message" => "Order placed successfully! Confirmation email sent."
        ]);
        exit;
    }
}

// ─────────────────────────────────────────────
// 5. AUTH & USER MANAGEMENT
// ─────────────────────────────────────────────
if ($uri === '/api/auth/login') {
    if ($method === 'POST') {
        $body = getJsonBody();
        $email = strtolower(trim($body['username'] ?? $body['email'] ?? ''));
        $password = $body['password'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            echo json_encode([
                "access_token" => "senka-token-" . md5($user['id'] . time()),
                "token_type" => "bearer",
                "role" => $user['role'],
                "user" => [
                    "id" => $user['id'],
                    "email" => $user['email'],
                    "first_name" => $user['first_name'],
                    "last_name" => $user['last_name'],
                    "phone" => $user['phone'],
                    "role" => $user['role']
                ]
            ]);
            exit;
        }

        http_response_code(401);
        echo json_encode(["detail" => "Invalid email or password"]);
        exit;
    }
}

if ($uri === '/api/auth/register') {
    if ($method === 'POST') {
        $body = getJsonBody();
        $email = strtolower(trim($body['email'] ?? ''));
        $password = $body['password'] ?? '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["detail" => "Email and password are required"]);
            exit;
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $userId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000, mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff));

        $stmt = $pdo->prepare("INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role) VALUES (?, ?, ?, ?, ?, ?, 'customer')");
        $stmt->execute([$userId, $email, $hash, $body['first_name'] ?? '', $body['last_name'] ?? '', $body['phone'] ?? '']);

        echo json_encode(["message" => "Account registered successfully", "id" => $userId]);
        exit;
    }
}

// ─────────────────────────────────────────────
// 6. ADMIN MANAGEMENT & ORDER STATUS & EMAIL DISPATCH
// ─────────────────────────────────────────────
if ($uri === '/api/admin/settings') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM site_settings");
        echo json_encode($stmt->fetchAll());
        exit;
    }
    if ($method === 'PUT' || $method === 'POST') {
        $body = getJsonBody();
        $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value, label) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        foreach ($body as $setting) {
            $stmt->execute([$setting['key'], $setting['value'], $setting['label'] ?? $setting['key']]);
        }
        echo json_encode(["message" => "Settings updated"]);
        exit;
    }
}

if ($uri === '/api/admin/orders') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM orders ORDER BY id DESC");
        $orders = $stmt->fetchAll();
        foreach ($orders as &$ord) {
            $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $itemStmt->execute([$ord['id']]);
            $ord['items'] = $itemStmt->fetchAll();
        }
        echo json_encode($orders);
        exit;
    }
}

if (preg_match('#^/api/admin/orders/([0-9]+)/status$#', $uri, $matches)) {
    if ($method === 'PUT' || $method === 'POST') {
        $orderId = intval($matches[1]);
        $body = getJsonBody();
        $newStatus = trim($body['order_status'] ?? $body['status'] ?? 'processing');

        $stmt = $pdo->prepare("UPDATE orders SET order_status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $orderId]);

        echo json_encode(["message" => "Order status updated to $newStatus"]);
        exit;
    }
}

if ($uri === '/api/admin/email/send') {
    if ($method === 'POST') {
        $body = getJsonBody();
        $toEmail = trim($body['to_email'] ?? $body['recipient'] ?? '');
        $subject = trim($body['subject'] ?? 'Senka Atelier Notice');
        $content = trim($body['body'] ?? $body['message'] ?? '');

        if (empty($toEmail) || empty($content)) {
            http_response_code(400);
            echo json_encode(["detail" => "Recipient email and body message are required"]);
            exit;
        }

        $headers = "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: Senka Atelier <" . SMTP_EMAIL . ">\r\n";
        @mail($toEmail, $subject, "<div style='font-family:Arial,sans-serif;padding:20px;'>" . nl2br(htmlspecialchars($content)) . "</div>", $headers, "-f" . SMTP_EMAIL);

        echo json_encode(["message" => "Custom email sent successfully to $toEmail"]);
        exit;
    }
}

// 404 Fallback
http_response_code(404);
echo json_encode(["detail" => "Endpoint not found: " . $uri]);


// ─────────────────────────────────────────────
// EMAIL SENDING FUNCTION (Gmail SMTP)
// ─────────────────────────────────────────────
function sendOrderEmail($toEmail, $toName, $orderNumber, $totalAmount, $shippingFee, $items) {
    if (!SMTP_ENABLED || empty($toEmail)) return;

    $subject = "Senka Atelier — Order Confirmation ($orderNumber)";
    
    $itemRows = "";
    foreach ($items as $item) {
        $itemRows .= "<tr>
            <td style='padding: 10px; border-bottom: 1px solid #eee;'>" . htmlspecialchars($item['name'] ?? 'Jewelry Item') . "</td>
            <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>" . intval($item['quantity'] ?? 1) . "</td>
            <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>PKR " . number_format($item['unit_price'] ?? 0) . "</td>
        </tr>";
    }

    $body = "
    <html>
    <body style='font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #d4af37; border-radius: 8px; padding: 30px;'>
            <div style='text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 15px;'>
                <h1 style='color: #d4af37; letter-spacing: 4px; font-size: 26px; margin: 0;'>SENKA ATELIER</h1>
                <p style='color: #888; text-transform: uppercase; font-size: 11px; margin-top: 5px;'>High Fine Jewelry & Craftsmanship</p>
            </div>
            
            <p style='font-size: 16px; margin-top: 25px;'>Dear <strong>" . htmlspecialchars($toName) . "</strong>,</p>
            <p>Thank you for choosing Senka Atelier. Your order <strong>$orderNumber</strong> has been successfully placed!</p>
            
            <table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>
                <thead>
                    <tr style='background-color: #faf5eb; color: #d4af37;'>
                        <th style='padding: 10px; text-align: left;'>Item</th>
                        <th style='padding: 10px; text-align: center;'>Qty</th>
                        <th style='padding: 10px; text-align: right;'>Price</th>
                    </tr>
                </thead>
                <tbody>
                    $itemRows
                </tbody>
            </table>

            <div style='margin-top: 20px; text-align: right; font-size: 14px;'>
                <p style='margin: 5px 0;'>Delivery Charge: <strong>PKR " . number_format($shippingFee) . "</strong></p>
                <p style='font-size: 18px; color: #d4af37; font-weight: bold; margin-top: 10px;'>Total Amount: PKR " . number_format($totalAmount) . "</p>
            </div>

            <div style='margin-top: 30px; padding: 15px; background-color: #faf5eb; border-left: 4px solid #d4af37;'>
                <p style='margin: 0; font-size: 13px; color: #555;'>
                    <strong>Payment Method:</strong> Cash on Delivery (COD)<br>
                    <strong>Studio Phone / WhatsApp:</strong> 0332 0409268<br>
                    <strong>Email:</strong> Senkajewellers@gmail.com
                </p>
            </div>
        </div>
    </body>
    </html>
    ";

    try {
        $socket = @fsockopen("tls://" . SMTP_HOST, 465, $errno, $errstr, 8);
        if (!$socket) {
            $socket = @fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, 8);
        }
        if ($socket) {
            fgets($socket, 512);
            fputs($socket, "EHLO " . SMTP_HOST . "\r\n");
            fgets($socket, 512);
            fputs($socket, "AUTH LOGIN\r\n");
            fgets($socket, 512);
            fputs($socket, base64_encode(SMTP_EMAIL) . "\r\n");
            fgets($socket, 512);
            fputs($socket, base64_encode(str_replace(' ', '', SMTP_PASSWORD)) . "\r\n");
            fgets($socket, 512);
            fputs($socket, "MAIL FROM: <" . SMTP_EMAIL . ">\r\n");
            fgets($socket, 512);
            fputs($socket, "RCPT TO: <" . $toEmail . ">\r\n");
            fgets($socket, 512);
            fputs($socket, "DATA\r\n");
            fgets($socket, 512);

            $msg = "Subject: $subject\r\n";
            $msg .= "To: $toEmail\r\n";
            $msg .= "From: Senka Atelier <" . SMTP_EMAIL . ">\r\n";
            $msg .= "MIME-Version: 1.0\r\n";
            $msg .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
            $msg .= $body;

            fputs($socket, $msg . "\r\n.\r\n");
            fgets($socket, 512);
            fputs($socket, "QUIT\r\n");
            fclose($socket);
            return;
        }
    } catch (Exception $e) {
        // Fallback
    }

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Senka Atelier <" . SMTP_EMAIL . ">\r\n";
    @mail($toEmail, $subject, $body, $headers, "-f" . SMTP_EMAIL);
}
