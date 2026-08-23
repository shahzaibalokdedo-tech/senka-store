-- MS SQL Server T-SQL Schema for Senka

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'senka')
BEGIN
    CREATE DATABASE senka;
END;
GO

USE senka;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        email NVARCHAR(255) UNIQUE NOT NULL,
        password_hash NVARCHAR(255) NOT NULL,
        first_name NVARCHAR(100),
        last_name NVARCHAR(100),
        phone NVARCHAR(30),
        role NVARCHAR(20) NOT NULL DEFAULT 'customer',
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
BEGIN
    CREATE TABLE categories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) UNIQUE NOT NULL,
        slug NVARCHAR(100) UNIQUE NOT NULL,
        parent_id INT FOREIGN KEY REFERENCES categories(id),
        is_active BIT NOT NULL DEFAULT 1
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products')
BEGIN
    CREATE TABLE products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        sku NVARCHAR(100) UNIQUE NOT NULL,
        name NVARCHAR(255) NOT NULL,
        slug NVARCHAR(255) UNIQUE NOT NULL,
        short_description NVARCHAR(MAX),
        description NVARCHAR(MAX),
        price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
        compare_price DECIMAL(12,2),
        currency NVARCHAR(3) NOT NULL DEFAULT 'PKR',
        stock INT NOT NULL DEFAULT 0,
        featured BIT NOT NULL DEFAULT 0,
        published BIT NOT NULL DEFAULT 1,
        category_id INT FOREIGN KEY REFERENCES categories(id),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'product_images')
BEGIN
    CREATE TABLE product_images (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT NOT NULL FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
        image_url NVARCHAR(MAX) NOT NULL,
        is_primary BIT NOT NULL DEFAULT 0,
        sort_order INT NOT NULL DEFAULT 0
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'carts')
BEGIN
    CREATE TABLE carts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
        session_id NVARCHAR(255),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cart_items')
BEGIN
    CREATE TABLE cart_items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cart_id INT NOT NULL FOREIGN KEY REFERENCES carts(id) ON DELETE CASCADE,
        product_id INT NOT NULL FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
        quantity INT NOT NULL CHECK (quantity > 0),
        unit_price DECIMAL(12,2) NOT NULL
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'orders')
BEGIN
    CREATE TABLE orders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES users(id) ON DELETE SET NULL,
        order_number NVARCHAR(50) UNIQUE NOT NULL,
        status NVARCHAR(30) NOT NULL DEFAULT 'pending',
        subtotal DECIMAL(12,2) NOT NULL,
        shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
        tax DECIMAL(12,2) NOT NULL DEFAULT 0,
        total DECIMAL(12,2) NOT NULL,
        currency NVARCHAR(3) NOT NULL DEFAULT 'PKR',
        payment_status NVARCHAR(30) NOT NULL DEFAULT 'pending',
        payment_provider NVARCHAR(50),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'order_items')
BEGIN
    CREATE TABLE order_items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        order_id INT NOT NULL FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT NOT NULL FOREIGN KEY REFERENCES products(id),
        quantity INT NOT NULL CHECK (quantity > 0),
        unit_price DECIMAL(12,2) NOT NULL
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'payments')
BEGIN
    CREATE TABLE payments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        order_id INT NOT NULL FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE,
        provider NVARCHAR(50) NOT NULL,
        provider_ref NVARCHAR(255),
        amount DECIMAL(12,2) NOT NULL,
        currency NVARCHAR(3) NOT NULL DEFAULT 'PKR',
        status NVARCHAR(30) NOT NULL DEFAULT 'pending',
        metadata NVARCHAR(MAX),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reviews')
BEGIN
    CREATE TABLE reviews (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT NOT NULL FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
        user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment NVARCHAR(MAX),
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END;
