
-- =====================================================
-- SMART INVENTORY MANAGEMENT SYSTEM
-- MODULE 1 : CATEGORIES, SUPPLIERS, PRODUCTS
-- Schema + Seed Data
-- =====================================================

-- =========================
-- Categories
-- =========================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Suppliers
-- =========================

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Products
-- =========================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    reorder_level INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Seed Categories
-- =========================

INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Networking', 'Networking equipment and accessories'),
('Office Supplies', 'Office stationery and supplies'),
('Furniture', 'Office and warehouse furniture'),
('Storage Devices', 'Hard drives and SSDs'),
('Computer Components', 'Internal computer parts'),
('Security Systems', 'CCTV and security products'),
('Printing', 'Printers and printing accessories'),
('Power Solutions', 'UPS and power backup devices'),
('Software Licenses', 'Software and subscriptions');

-- =========================
-- Seed Suppliers
-- =========================

INSERT INTO suppliers
(name, contact_person, email, phone, address)
VALUES
('TechSource Pvt Ltd','Rahul Sharma','rahul@techsource.com','9876543210','Pune, Maharashtra'),
('Global Networks','Ankit Verma','ankit@globalnet.com','9876543211','Mumbai, Maharashtra'),
('OfficeMart','Priya Singh','priya@officemart.com','9876543212','Delhi'),
('Digital World','Aman Gupta','aman@digitalworld.com','9876543213','Bangalore, Karnataka'),
('SecureTech','Neha Jain','neha@securetech.com','9876543214','Hyderabad, Telangana'),
('CompZone','Vikas Rao','vikas@compzone.com','9876543215','Chennai, Tamil Nadu'),
('StorageHub','Kunal Patil','kunal@storagehub.com','9876543216','Nagpur, Maharashtra'),
('PrintPro','Rohan Mehta','rohan@printpro.com','9876543217','Ahmedabad, Gujarat'),
('PowerGrid Solutions','Sneha Kulkarni','sneha@powergrid.com','9876543218','Pune, Maharashtra'),
('SoftServe Systems','Arjun Nair','arjun@softserve.com','9876543219','Kochi, Kerala');

-- =========================
-- Seed Products
-- =========================

INSERT INTO products
(category_id, supplier_id, name, sku, price, description, reorder_level)
VALUES
(1,1,'Dell Latitude 5540','SKU001',72000,'Business Laptop',5),
(8,8,'HP LaserJet Pro','SKU002',18000,'Laser Printer',3),
(2,2,'Cisco Switch 24 Port','SKU003',26000,'Managed Network Switch',2),
(1,4,'Logitech Wireless Mouse','SKU004',750,'Wireless Mouse',20),
(5,7,'Samsung SSD 1TB','SKU005',6500,'Solid State Drive',10),
(9,9,'APC UPS 1100VA','SKU006',8500,'Power Backup Unit',4),
(7,5,'Hikvision CCTV Camera','SKU007',4500,'Security Camera',8),
(4,3,'Office Chair Premium','SKU008',6000,'Ergonomic Office Chair',5),
(6,6,'Intel Core i7 Processor','SKU009',29000,'CPU Processor',4),
(10,10,'Microsoft Office License','SKU010',6000,'Annual Software License',10);
