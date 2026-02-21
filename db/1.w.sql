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




