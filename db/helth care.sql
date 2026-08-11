SELECT datname FROM pg_database;


CREATE DATABASE healthcare_db;


CREATE TABLE user_master (
    id BIGSERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,

    email_id VARCHAR(100),
    aadhar_number VARCHAR(20),

    address VARCHAR(255),
    department VARCHAR(50),
    role VARCHAR(50),

    salary NUMERIC(10,2),

    joining_date DATE,

    shift_timings VARCHAR(30),

    image BYTEA,

    login_attempts INTEGER DEFAULT 0,

    password VARCHAR(255),

    two_factor_authentication INTEGER,

    pan_number VARCHAR(20),

    designation VARCHAR(100),

    organization_id BIGINT
);

CREATE UNIQUE INDEX uk_user_master_mobile
ON user_master(mobile_number);
ALTER TABLE user_master
ADD CONSTRAINT fk_user_org
FOREIGN KEY (organization_id)
REFERENCES organization(id);








CREATE TABLE organizations_master (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    tagline VARCHAR(255),

    description TEXT,

    established_year INTEGER,
    ownership_type VARCHAR(30),

    organization_mail VARCHAR(255) NOT NULL,

    hospital_phone VARCHAR(10) NOT NULL,
    alternate_phone VARCHAR(10),
    website VARCHAR(255),

    address TEXT NOT NULL,

    landmark VARCHAR(255),
    area VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    pincode VARCHAR(6) NOT NULL,

    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),

    geofence_radius INTEGER,
    location_accuracy VARCHAR(10),

    google_place_id VARCHAR(255),
    google_map_link VARCHAR(500),

    total_beds INTEGER,
    icu_beds INTEGER,
    emergency_beds INTEGER,
    operation_theatres INTEGER,
    ventilators INTEGER,
    ambulances INTEGER,

    departments TEXT,
    services TEXT,
    facilities TEXT,
    documents TEXT,
    images TEXT,

    registration_number VARCHAR(100),
    gst_number VARCHAR(50),

    licence_expiry DATE,
    fire_safety_validity DATE,

    insurance_details TEXT,

    status VARCHAR(20),

    verification_level VARCHAR(20) DEFAULT '0',

    reviewed_at DATE,
    reviewed_by BIGINT,

    rejection_reason TEXT,

    onboarding_stage INTEGER,

    rating NUMERIC(3,2),
    rating_count INTEGER,
    views INTEGER,
    profile_completion INTEGER,

    submitted_at DATE,
    last_login_at DATE,

    ip_address VARCHAR(50),

    created_at DATE,
    updated_at DATE,

    account_no VARCHAR(20),
    ifsc_code VARCHAR(20),
    branch_name VARCHAR(100),
    bank_name VARCHAR(100),
    bank_holder_name VARCHAR(150),

    passbook_image TEXT
);


CREATE UNIQUE INDEX uk_hospitals_code
ON organizations_master(code);

CREATE UNIQUE INDEX uk_hospitals_org_mail
ON organizations_master(organization_mail);

CREATE UNIQUE INDEX uk_hospitals_phone
ON organizations_master(hospital_phone);



CREATE TABLE doctors (
    doctor_id BIGINT PRIMARY KEY,

    doctor_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,

    phone VARCHAR(20),
    email VARCHAR(100),

    experience INTEGER,

    status VARCHAR(10) DEFAULT 'ACTIVE',

    address VARCHAR(255),

    -- stored as STRING intentionally (as per your entity)
    date_of_birth VARCHAR(20),

    gender VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    country VARCHAR(100),

    medical_license_no VARCHAR(100),

    role VARCHAR(50),

    password VARCHAR(100),

    organization_id BIGINT,

    talk_available VARCHAR(10), 

    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),

    image_url VARCHAR(500),

    consultation_fees NUMERIC(10,2)
);

 CREATE TABLE appointments (
    appointment_id BIGSERIAL PRIMARY KEY,

    doctor_id BIGINT NOT NULL,
    slot_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    hospital_id BIGINT,

    appointment_date DATE,

    start_time TIMESTAMP,

    status VARCHAR(20),

    created_at TIMESTAMP
);

ALTER TABLE appointments
ADD CONSTRAINT fk_appointment_doctor
FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id);

ALTER TABLE appointments
ADD CONSTRAINT fk_appointment_user
FOREIGN KEY (user_id) REFERENCES user_master(id);

ALTER TABLE appointments
ADD CONSTRAINT fk_appointment_hospital
FOREIGN KEY (hospital_id) REFERENCES organizations_master(id);

CREATE TABLE bed_booking (
    booking_id BIGSERIAL PRIMARY KEY,

    bed_id BIGINT NOT NULL,

    ward_id BIGINT NOT NULL,

    patient_id BIGINT,

    admission_date DATE,

    discharge_date VARCHAR(30),

    status VARCHAR(20),

	organization_id BIGINT
);




CREATE TABLE ward_master (
    ward_id BIGSERIAL PRIMARY KEY,

    ward_name VARCHAR(100) NOT NULL,

    ward_type VARCHAR(50),

    total_beds INTEGER NOT NULL,

    created_on DATE,

    organization_id BIGINT
);


CREATE TABLE customer_addresses (
    address_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),

    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    landmark VARCHAR(255),

    is_default INTEGER,

    created_on DATE
);

ALTER TABLE customer_addresses
ADD CONSTRAINT fk_customer_addresses_user
FOREIGN KEY (user_id)
REFERENCES user_master(id);

CREATE INDEX idx_customer_addresses_user
ON customer_addresses(user_id);

CREATE INDEX idx_customer_addresses_default
ON customer_addresses(user_id, is_default);

CREATE TABLE customer_cart (
    cart_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    created_on DATE,

    updated_on DATE,

    CONSTRAINT uk_customer_cart_user UNIQUE (user_id)
);

ALTER TABLE customer_cart
ADD CONSTRAINT fk_customer_cart_user
FOREIGN KEY (user_id)
REFERENCES user_master(id);


CREATE TABLE customer_cart_items (
    cart_item_id BIGSERIAL PRIMARY KEY,

    cart_id BIGINT NOT NULL,

    item_id BIGINT NOT NULL,

    quantity INTEGER,

    price_at_add NUMERIC(12,2),

    added_on DATE
);
ALTER TABLE customer_cart_items
ADD CONSTRAINT fk_cart_items_cart
FOREIGN KEY (cart_id)
REFERENCES customer_cart(cart_id)
ON DELETE CASCADE;

CREATE INDEX idx_cart_items_cart
ON customer_cart_items(cart_id);

CREATE INDEX idx_cart_items_item
ON customer_cart_items(item_id);

CREATE TABLE customer_orders (
    order_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    address_id BIGINT NOT NULL,

    order_status VARCHAR(50),

    total_amount NUMERIC(12,2),

    payment_status VARCHAR(20),

    payment_method VARCHAR(20),

    order_date DATE,

    updated_on DATE
);

ALTER TABLE customer_orders
ADD CONSTRAINT fk_customer_orders_user
FOREIGN KEY (user_id)
REFERENCES user_master(id);

ALTER TABLE customer_orders
ADD CONSTRAINT fk_customer_orders_address
FOREIGN KEY (address_id)
REFERENCES customer_addresses(address_id);

CREATE INDEX idx_customer_orders_user
ON customer_orders(user_id);

CREATE INDEX idx_customer_orders_status
ON customer_orders(order_status);

CREATE INDEX idx_customer_orders_date
ON customer_orders(order_date);

CREATE TABLE customer_order_items (
    order_item_id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,

    product_id BIGINT NOT NULL,

    quantity INTEGER,

    price_per_unit NUMERIC(12,2),

    subtotal NUMERIC(12,2)
);

ALTER TABLE customer_order_items
ADD CONSTRAINT fk_order_items_order
FOREIGN KEY (order_id)
REFERENCES customer_orders(order_id)
ON DELETE CASCADE;

CREATE INDEX idx_order_items_order
ON customer_order_items(order_id);

CREATE INDEX idx_order_items_product
ON customer_order_items(product_id);

CREATE TABLE customer_payments (
    payment_id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,

    amount NUMERIC(12,2),

    payment_method VARCHAR(20),

    transaction_id VARCHAR(255),

    payment_status VARCHAR(20),

    created_on DATE DEFAULT CURRENT_DATE
);

ALTER TABLE customer_payments
ADD CONSTRAINT fk_customer_payments_order
FOREIGN KEY (order_id)
REFERENCES customer_orders(order_id)
ON DELETE CASCADE;

CREATE INDEX idx_customer_payments_order
ON customer_payments(order_id);

CREATE INDEX idx_customer_payments_txn
ON customer_payments(transaction_id);

CREATE TABLE doctor_availability (
    slot_id BIGINT PRIMARY KEY,

    doctor_id BIGINT NOT NULL,

    slot_date DATE NOT NULL,

    start_time TIMESTAMP,

    end_time TIMESTAMP,

    slot_status VARCHAR(20),

    created_at DATE
);


ALTER TABLE doctor_availability
ADD CONSTRAINT fk_doctor_availability_doctor
FOREIGN KEY (doctor_id)
REFERENCES doctors(doctor_id)
ON DELETE CASCADE;

CREATE INDEX idx_doctor_availability_doctor
ON doctor_availability(doctor_id);

CREATE INDEX idx_doctor_availability_date
ON doctor_availability(slot_date);

CREATE INDEX idx_doctor_availability_status
ON doctor_availability(slot_status);


CREATE TABLE hospitals_medicalstores (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    code VARCHAR(255) UNIQUE,

    name VARCHAR(255) NOT NULL,

    type VARCHAR(255) NOT NULL,

    tagline VARCHAR(255),

    description TEXT DEFAULT NULL,

    established_year INTEGER,

    ownership_type VARCHAR(255),

    organization_mail VARCHAR(255) UNIQUE NOT NULL,

    hospital_phone VARCHAR(255) UNIQUE NOT NULL,

    alternate_phone VARCHAR(255),

    website VARCHAR(255),

    address TEXT NOT NULL,

    landmark VARCHAR(255),

    area VARCHAR(255),

    city VARCHAR(255) NOT NULL,

    district VARCHAR(255),

    state VARCHAR(255) NOT NULL,

    country VARCHAR(255) DEFAULT 'India',

    pincode VARCHAR(255) NOT NULL,

    latitude DOUBLE PRECISION,

    longitude DOUBLE PRECISION,

    geofence_radius NUMERIC DEFAULT 500,

    location_accuracy VARCHAR(255) DEFAULT 'high',

    google_place_id VARCHAR(255),

    google_map_link VARCHAR(255),

    total_beds NUMERIC DEFAULT 0,

    icu_beds NUMERIC DEFAULT 0,

    emergency_beds NUMERIC DEFAULT 0,

    operation_theatres NUMERIC DEFAULT 0,

    ventilators NUMERIC DEFAULT 0,

    ambulances NUMERIC DEFAULT 0,

    departments TEXT,

    services TEXT,

    facilities TEXT,

    documents TEXT,

    images TEXT,

    registration_number VARCHAR(255),

    gst_number VARCHAR(255),

    licence_expiry DATE,

    fire_safety_validity DATE DEFAULT NULL,

    insurance_details TEXT DEFAULT NULL,

    status VARCHAR(255) DEFAULT 'pending',

    verification_level VARCHAR(255) DEFAULT '1',

    reviewed_at DATE,

    reviewed_by BIGINT,

    rejection_reason TEXT,

    onboarding_stage NUMERIC DEFAULT 1,

    rating DOUBLE PRECISION DEFAULT 0,

    rating_count NUMERIC DEFAULT 0,

    views NUMERIC DEFAULT 0,

    profile_completion NUMERIC DEFAULT NULL,

    submitted_at DATE,

    last_login_at DATE,

    ip_address VARCHAR(255) DEFAULT NULL,

    created_at DATE DEFAULT CURRENT_DATE,

    updated_at DATE DEFAULT CURRENT_DATE,

    account_no VARCHAR(255),

    ifsc_code VARCHAR(255),

    branch_name VARCHAR(255),

    bank_name VARCHAR(255),

    bank_holder_name VARCHAR(255),

    passbook_image TEXT
);

CREATE INDEX idx_verification_level
ON hospitals_medicalstores (verification_level);

CREATE INDEX idx_type
ON hospitals_medicalstores (type);

CREATE INDEX idx_type
ON hospitals_medicalstores (type);

select * from user_master;
select * from organizations_master;
select * from doctors;
select * from appointments;
select * from bed_booking;
select * from ward_master;
select * from customer_addresses;
select * from customer_cart;
select * from customer_cart_items;
select * from customer_orders;
select * from customer_order_items;
select * from customer_payments;
select * from doctor_availability;