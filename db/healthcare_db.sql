--
-- PostgreSQL database dump
--

\restrict xW1d8gCjkvunMnMFWaW190ex5bX6bu6cXHBvfbtKXfzmGKm4m2cHXL5kPScpJnN

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-08-13 18:14:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 248 (class 1259 OID 97204)
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    appointment_id integer NOT NULL,
    doctor_id integer NOT NULL,
    slot_id integer NOT NULL,
    user_id integer NOT NULL,
    hospital_id integer,
    appointment_date timestamp without time zone,
    start_time timestamp(6) without time zone,
    status character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 97203)
-- Name: appointments_appointment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.appointments ALTER COLUMN appointment_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.appointments_appointment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 96992)
-- Name: bed_booking_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bed_booking_seq
    START WITH 8
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bed_booking_seq OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 97116)
-- Name: bed_booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bed_booking (
    booking_id integer DEFAULT nextval('public.bed_booking_seq'::regclass),
    bed_id integer,
    patient_id integer,
    admission_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    discharge_date character varying(255),
    status character varying(255) DEFAULT 'Active'::character varying,
    ward_id integer
);


ALTER TABLE public.bed_booking OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 97125)
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_addresses (
    address_id integer NOT NULL,
    user_id integer NOT NULL,
    address_line1 character varying(255),
    address_line2 character varying(255),
    city character varying(255),
    state character varying(255),
    pincode character varying(255),
    landmark character varying(255),
    is_default smallint DEFAULT 0,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.customer_addresses OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 97124)
-- Name: customer_addresses_address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_addresses ALTER COLUMN address_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_addresses_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 97137)
-- Name: customer_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_cart (
    cart_id integer NOT NULL,
    user_id integer NOT NULL,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_on timestamp without time zone
);


ALTER TABLE public.customer_cart OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 97136)
-- Name: customer_cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_cart ALTER COLUMN cart_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_cart_cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 239 (class 1259 OID 97148)
-- Name: customer_cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_cart_items (
    cart_item_id integer NOT NULL,
    cart_id integer NOT NULL,
    item_id integer NOT NULL,
    quantity integer DEFAULT 1,
    price_at_add double precision,
    added_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.customer_cart_items OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 97147)
-- Name: customer_cart_items_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_cart_items ALTER COLUMN cart_item_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_cart_items_cart_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 243 (class 1259 OID 97173)
-- Name: customer_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_order_items (
    order_item_id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    price_per_unit double precision,
    subtotal double precision
);


ALTER TABLE public.customer_order_items OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 97172)
-- Name: customer_order_items_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_order_items ALTER COLUMN order_item_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_order_items_order_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 241 (class 1259 OID 97159)
-- Name: customer_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_orders (
    order_id integer NOT NULL,
    user_id integer NOT NULL,
    address_id integer NOT NULL,
    order_status character varying(255) DEFAULT 'PENDING'::character varying,
    total_amount double precision,
    payment_status character varying(255) DEFAULT 'PENDING'::character varying,
    payment_method character varying(255),
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_on timestamp without time zone
);


ALTER TABLE public.customer_orders OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 97158)
-- Name: customer_orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_orders ALTER COLUMN order_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_orders_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 245 (class 1259 OID 97183)
-- Name: customer_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_payments (
    payment_id integer NOT NULL,
    order_id integer NOT NULL,
    amount double precision,
    payment_method character varying(255),
    transaction_id character varying(255),
    payment_status character varying(255),
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.customer_payments OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 97182)
-- Name: customer_payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_payments ALTER COLUMN payment_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_payments_payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 246 (class 1259 OID 97193)
-- Name: doctor_availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_availability (
    slot_id integer NOT NULL,
    doctor_id integer NOT NULL,
    slot_date timestamp without time zone NOT NULL,
    start_time timestamp(6) without time zone,
    end_time timestamp(6) without time zone,
    slot_status character varying(255) DEFAULT 'AVAILABLE'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.doctor_availability OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 97037)
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    doctor_id integer NOT NULL,
    doctor_name character varying(100) NOT NULL,
    specialization character varying(100) NOT NULL,
    phone character varying(20),
    email character varying(100),
    experience integer,
    status character varying(10),
    address character varying(255),
    date_of_birth character varying(20),
    gender character varying(10),
    city character varying(100),
    state character varying(100),
    pin_code character varying(10),
    country character varying(100),
    medical_license_no character varying(100),
    role character varying(50),
    image bytea,
    password character varying(100),
    organization_id integer,
    talk_available character varying(10) DEFAULT 'NO'::character varying,
    latitude double precision,
    longitude double precision,
    image_url character varying(500),
    consultation_fees double precision
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 97066)
-- Name: hospitals_medicalstores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospitals_medicalstores (
    id integer NOT NULL,
    code character varying(255),
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    tagline character varying(255),
    description text,
    established_year numeric(4,0),
    ownership_type character varying(255),
    organization_mail character varying(255) NOT NULL,
    hospital_phone character varying(255) NOT NULL,
    alternate_phone character varying(255),
    website character varying(255),
    address text NOT NULL,
    landmark character varying(255),
    area character varying(255),
    city character varying(255) NOT NULL,
    district character varying(255),
    state character varying(255) NOT NULL,
    country character varying(255) DEFAULT 'India'::character varying,
    pincode character varying(255) NOT NULL,
    latitude double precision,
    longitude double precision,
    geofence_radius integer DEFAULT 500,
    location_accuracy character varying(255) DEFAULT 'high'::character varying,
    google_place_id character varying(255),
    google_map_link character varying(255),
    total_beds integer DEFAULT 0,
    icu_beds integer DEFAULT 0,
    emergency_beds integer DEFAULT 0,
    operation_theatres integer DEFAULT 0,
    ventilators integer DEFAULT 0,
    ambulances integer DEFAULT 0,
    departments text,
    services text,
    facilities text,
    documents text,
    images text,
    registration_number character varying(255),
    gst_number character varying(255),
    licence_expiry timestamp without time zone,
    fire_safety_validity timestamp without time zone,
    insurance_details text,
    status character varying(255) DEFAULT 'pending'::character varying,
    verification_level character varying(255) DEFAULT '1'::character varying,
    reviewed_at timestamp without time zone,
    reviewed_by integer,
    rejection_reason text,
    onboarding_stage integer DEFAULT 1,
    rating double precision DEFAULT 0,
    rating_count integer DEFAULT 0,
    views integer DEFAULT 0,
    profile_completion integer,
    submitted_at timestamp without time zone,
    last_login_at timestamp without time zone,
    ip_address character varying(255) DEFAULT NULL::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    account_no character varying(255),
    ifsc_code character varying(255),
    branch_name character varying(255),
    bank_name character varying(255),
    bank_holder_name character varying(255),
    passbook_image text
);


ALTER TABLE public.hospitals_medicalstores OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 97065)
-- Name: hospitals_medicalstores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.hospitals_medicalstores ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.hospitals_medicalstores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 97030)
-- Name: lab_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_category (
    category_id integer NOT NULL,
    category_name character varying(100) NOT NULL
);


ALTER TABLE public.lab_category OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 97029)
-- Name: lab_category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lab_category ALTER COLUMN category_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lab_category_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 252 (class 1259 OID 97224)
-- Name: lab_report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_report (
    report_id integer NOT NULL,
    patient_id integer NOT NULL,
    test_id integer NOT NULL,
    report_file bytea,
    file_name character varying(255),
    file_type character varying(50),
    uploaded_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lab_report OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 97223)
-- Name: lab_report_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lab_report ALTER COLUMN report_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lab_report_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 250 (class 1259 OID 97215)
-- Name: lab_test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_test (
    test_id integer NOT NULL,
    category_id integer NOT NULL,
    test_name character varying(200) NOT NULL,
    test_cost double precision
);


ALTER TABLE public.lab_test OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 97214)
-- Name: lab_test_test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lab_test ALTER COLUMN test_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lab_test_test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 97106)
-- Name: login_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_details (
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL
);


ALTER TABLE public.login_details OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 97236)
-- Name: medicine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicine (
    medicine_id integer NOT NULL,
    medicine_name character varying(255) NOT NULL,
    category character varying(255),
    manufacturer character varying(255),
    batch_no character varying(255),
    price_per_unit double precision,
    purchase_cost double precision,
    quantity_available numeric(10,0),
    reorder_level numeric(10,0),
    expiry_date timestamp without time zone,
    description character varying(255),
    status character varying(255),
    location_of_rack character varying(255),
    supplier_id integer,
    created_by character varying(50),
    updated_by character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    organization_id integer,
    person_id integer,
    image_url character varying(255)
);


ALTER TABLE public.medicine OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 97235)
-- Name: medicine_medicine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.medicine ALTER COLUMN medicine_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.medicine_medicine_id_seq
    START WITH 31
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 256 (class 1259 OID 97247)
-- Name: medicine_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicine_reviews (
    review_id integer NOT NULL,
    id integer NOT NULL,
    medicine_id integer NOT NULL,
    rating numeric(1,0),
    review_text text,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT medicine_reviews_rating_check CHECK (((rating >= (1)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.medicine_reviews OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 97246)
-- Name: medicine_reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.medicine_reviews ALTER COLUMN review_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.medicine_reviews_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 97054)
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    patient_id integer NOT NULL,
    name character varying(100) NOT NULL,
    gender character varying(10),
    aadhar character varying(12),
    phone character varying(15),
    date_of_birth timestamp without time zone,
    address character varying(255),
    doctor_id integer,
    appointment_date character varying(20),
    appointment_time character varying(20),
    disease character varying(100),
    dosage_instructions character varying(255),
    generated_at timestamp without time zone,
    notes character varying(500),
    selected_medicines character varying(500),
    date_issued timestamp without time zone,
    medication character varying(200),
    selected_tests character varying(500),
    medision_status character varying(50),
    doctor_status character varying(50),
    lab_status character varying(50)
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 97259)
-- Name: prescription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescription (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    dosage_instructions character varying(255) NOT NULL,
    generated_at timestamp without time zone,
    notes character varying(255),
    patient_id integer NOT NULL,
    selected_medicines character varying(255) NOT NULL,
    date_issued timestamp without time zone,
    dosage character varying(255),
    medication character varying(255),
    selected_tests character varying(255)
);


ALTER TABLE public.prescription OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 97272)
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    prescription_id integer NOT NULL,
    id integer NOT NULL,
    order_id integer,
    file_url character varying(1000),
    verification_status character varying(20) DEFAULT 'PENDING'::character varying,
    uploaded_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 97271)
-- Name: prescriptions_prescription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.prescriptions ALTER COLUMN prescription_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.prescriptions_prescription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 97021)
-- Name: supplier_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_master (
    supplier_id integer NOT NULL,
    suplier_name character varying(100) NOT NULL,
    company_name character varying(150),
    s_email character varying(100),
    s_contact character varying(15),
    s_status character varying(20),
    supaly_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);


ALTER TABLE public.supplier_master OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 97020)
-- Name: supplier_master_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.supplier_master ALTER COLUMN supplier_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.supplier_master_supplier_id_seq
    START WITH 6
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 97007)
-- Name: user_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_master (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    mobile_number character varying(255) NOT NULL,
    email_id character varying(255),
    aadhar_number character varying(255),
    address character varying(255),
    department character varying(255),
    role character varying(255),
    salary double precision,
    joining_date timestamp without time zone,
    shift_timings character varying(255),
    image bytea,
    login_attempts integer DEFAULT 0,
    password character varying(255),
    two_factor_authentication smallint,
    pan_number character varying(255),
    designation character varying(255),
    organization_id integer
);


ALTER TABLE public.user_master OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 97006)
-- Name: user_master_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_master ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_master_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 96994)
-- Name: ward_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ward_master (
    ward_id integer NOT NULL,
    ward_name character varying(255) NOT NULL,
    ward_type character varying(255),
    total_beds integer NOT NULL,
    created_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ward_master_ward_type_check CHECK (((ward_type)::text = ANY ((ARRAY['General'::character varying, 'ICU'::character varying, 'Emergency'::character varying, 'Private'::character varying])::text[])))
);


ALTER TABLE public.ward_master OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 96993)
-- Name: ward_master_ward_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ward_master ALTER COLUMN ward_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.ward_master_ward_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5159 (class 0 OID 97204)
-- Dependencies: 248
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (appointment_id, doctor_id, slot_id, user_id, hospital_id, appointment_date, start_time, status, created_at) FROM stdin;
1	1	1	1	1	2026-07-13 12:46:03.131041	\N	CONFIRMED	2026-07-13 12:46:03.131041
2	102	1002	1	\N	2025-12-19 00:00:00	\N	BOOKED	2025-12-19 11:40:52.349546
3	102	1003	1	\N	2025-12-19 00:00:00	\N	BOOKED	2025-12-19 11:46:51.188034
4	102	2002	2	\N	2025-12-20 00:00:00	2025-12-20 10:15:00	BOOKED	2025-12-20 11:27:48.447842
\.


--
-- TOC entry 5144 (class 0 OID 97116)
-- Dependencies: 233
-- Data for Name: bed_booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bed_booking (booking_id, bed_id, patient_id, admission_date, discharge_date, status, ward_id) FROM stdin;
8	1	1	2026-07-13 12:46:03.131041	\N	Active	1
9	2	101	2025-10-15 00:00:00	2025-10-30	Completed	2
10	9	\N	\N	\N	Available	1
11	1	\N	\N	\N	Available	1
12	3	3	2025-10-30 00:00:00	2025-10-31	Active	2
13	7	21	2025-10-24 00:00:00	2025-10-25	Active	2
14	6	\N	\N	\N	Available	1
15	1	\N	\N	\N	Available	2
16	5	1	2025-10-23 00:00:00	\N	Active	1
\.


--
-- TOC entry 5146 (class 0 OID 97125)
-- Dependencies: 235
-- Data for Name: customer_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_addresses (address_id, user_id, address_line1, address_line2, city, state, pincode, landmark, is_default, created_on) FROM stdin;
1	1	Flat No 101, Green Apartments	Near Bus Stand	Hyderabad	Telangana	500081	Hitech City	1	2025-12-29 00:00:00
2	1	Flat No 101	Near Bus Stand	Hyderabad	Telangana	500081	Hitech City	0	2025-12-30 00:00:00
\.


--
-- TOC entry 5148 (class 0 OID 97137)
-- Dependencies: 237
-- Data for Name: customer_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_cart (cart_id, user_id, created_on, updated_on) FROM stdin;
1	1	2025-12-23 00:00:00	2025-12-23 00:00:00
2	10	2025-12-23 00:00:00	\N
\.


--
-- TOC entry 5150 (class 0 OID 97148)
-- Dependencies: 239
-- Data for Name: customer_cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_cart_items (cart_item_id, cart_id, item_id, quantity, price_at_add, added_on) FROM stdin;
1	2	35	4	6	2025-12-30 00:00:00
2	2	41	2	7.8	2025-12-30 00:00:00
3	2	13	1	1.2	2025-12-30 00:00:00
4	2	5	1	7.8	2026-01-03 00:00:00
5	2	19	1	12.5	2026-01-03 00:00:00
6	2	39	1	5	2026-01-03 00:00:00
7	2	3	12	5	2025-12-30 00:00:00
\.


--
-- TOC entry 5154 (class 0 OID 97173)
-- Dependencies: 243
-- Data for Name: customer_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_order_items (order_item_id, order_id, product_id, quantity, price_per_unit, subtotal) FROM stdin;
1	1	1	2	45	90
2	1	2	1	120	120
3	1	5	2	120	240
\.


--
-- TOC entry 5152 (class 0 OID 97159)
-- Dependencies: 241
-- Data for Name: customer_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_orders (order_id, user_id, address_id, order_status, total_amount, payment_status, payment_method, order_date, updated_on) FROM stdin;
1	1	1	CREATED	450	PENDING	\N	2025-12-30 00:00:00	2025-12-30 00:00:00
\.


--
-- TOC entry 5156 (class 0 OID 97183)
-- Dependencies: 245
-- Data for Name: customer_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_payments (payment_id, order_id, amount, payment_method, transaction_id, payment_status, created_on) FROM stdin;
\.


--
-- TOC entry 5157 (class 0 OID 97193)
-- Dependencies: 246
-- Data for Name: doctor_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_availability (slot_id, doctor_id, slot_date, start_time, end_time, slot_status, created_at) FROM stdin;
1	1	2026-07-13 12:46:03.131041	2026-07-13 12:46:03.131041	2026-07-13 13:16:03.131041	AVAILABLE	2026-07-13 12:46:03.131041
1001	102	2025-12-19 00:00:00	\N	\N	EXPIRED	2025-12-19 00:00:00
1002	102	2025-12-19 00:00:00	\N	\N	EXPIRED	2025-12-19 00:00:00
1003	102	2025-12-19 00:00:00	\N	\N	EXPIRED	2025-12-19 00:00:00
1004	102	2025-12-20 00:00:00	\N	\N	EXPIRED	2025-12-19 00:00:00
1005	102	2025-12-20 00:00:00	\N	\N	EXPIRED	2025-12-19 00:00:00
1006	102	2025-12-21 00:00:00	\N	\N	EXPIRED	2025-12-19 00:00:00
1007	102	2025-12-21 00:00:00	\N	\N	EXPIRED	2025-12-19 00:00:00
2001	102	2025-12-20 00:00:00	2025-12-20 10:00:00	\N	AVAILABLE	2025-12-19 00:00:00
2002	102	2025-12-20 00:00:00	2025-12-20 10:15:00	\N	BOOKED	2025-12-19 00:00:00
2003	102	2025-12-20 00:00:00	2025-12-20 10:30:00	\N	AVAILABLE	2025-12-19 00:00:00
2004	102	2025-12-21 00:00:00	2025-12-21 11:00:00	\N	AVAILABLE	2025-12-19 00:00:00
4001	102	2025-12-20 00:00:00	2025-12-20 10:00:00	\N	AVAILABLE	2025-12-20 00:00:00
\.


--
-- TOC entry 5139 (class 0 OID 97037)
-- Dependencies: 228
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (doctor_id, doctor_name, specialization, phone, email, experience, status, address, date_of_birth, gender, city, state, pin_code, country, medical_license_no, role, image, password, organization_id, talk_available, latitude, longitude, image_url, consultation_fees) FROM stdin;
1	Dr. Sample Kumar	Cardiology	9000000020	doctor1@example.com	10	Active	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	NO	\N	\N	\N	\N
101	Dr Ravi Kumar	Cardiologist	9876543010	ravi@gmail.com	12	ACTIVE	Hyderabad	1985-06-15	Male	\N	\N	\N	\N	MED12345	DOCTOR	\N	test@123	\N	YES	17.385	78.4867	https://res.cloudinary.com/dvk6mwbht/image/upload/v1765973951/doctors/xyepvpjnv0zobkieah7d.jpg	\N
102	Dr. Priya Sharma	Dermatology	9876501234	bvamsi313@gmail.com	1	ACTIVE	5 Gachibowli Main Road, Hyderabad	\N	Female	Hyderabad	Telangana	500032	India	LIC67890	Doctor	\N	11112222	\N	YES	\N	\N	\N	\N
103	Dr. Rajesh Patel	Orthopedics	9876009876	pavansanthosh733@gmail.com	2	ACTIVE	22 Ellis Road, Chennai	\N	Male	Chennai	Tamil Nadu	600018	India	LIC99999	Doctor	\N	11112222	\N	YES	\N	\N	\N	\N
104	Dr. Sneha Reddy	Pediatrics	9876123456	eswarimadhavarapu@gmail.com	6	ACTIVE	14 Beach Road, Vizag	\N	Female	Visakhapatnam	Andhra Pradesh	530017	India	LIC56789	Doctor	\N	11112222	89	YES	\N	\N	\N	\N
108	Vamsi bvamsi	Neurologist	76869899	bvamsi@gmail.com	3	Active	wertyjhcvbk	2012-06-08	Male	\N	\N	\N	\N	1111112222222	Doctor	\N	11112222	\N	YES	\N	\N	\N	\N
107	Dr. Anil Kumar	Cardiology	9876542210	an.kumar@example.com	12	ACTIVE	12 MG Road, Vijayawada	\N	Male	Vijayawada	Andhra Pradesh	520010	India	LIC1wq2345	Doctor	\N	password123	\N	NO	\N	\N	\N	\N
109	Dr.ail Kumar	Cardiology	9876442210	kumarmar@exmple.com	12	ACTIVE	12 MG Road, Vijayawada	\N	Male	Vijayawada	Andhra Pradesh	520010	India	wq2345	Doctor	\N	password123	\N	NO	\N	\N	\N	\N
\.


--
-- TOC entry 5142 (class 0 OID 97066)
-- Dependencies: 231
-- Data for Name: hospitals_medicalstores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospitals_medicalstores (id, code, name, type, tagline, description, established_year, ownership_type, organization_mail, hospital_phone, alternate_phone, website, address, landmark, area, city, district, state, country, pincode, latitude, longitude, geofence_radius, location_accuracy, google_place_id, google_map_link, total_beds, icu_beds, emergency_beds, operation_theatres, ventilators, ambulances, departments, services, facilities, documents, images, registration_number, gst_number, licence_expiry, fire_safety_validity, insurance_details, status, verification_level, reviewed_at, reviewed_by, rejection_reason, onboarding_stage, rating, rating_count, views, profile_completion, submitted_at, last_login_at, ip_address, created_at, updated_at, account_no, ifsc_code, branch_name, bank_name, bank_holder_name, passbook_image) FROM stdin;
1	\N	Sample Hospital	Hospital	\N	\N	\N	\N	hospital@example.com	9000000040	\N	\N	123 Sample Street	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	\N	\N	500	high	\N	\N	0	0	0	0	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	1	\N	\N	\N	1	0	0	0	\N	\N	\N	\N	2026-07-13 12:46:03.131041	2026-07-13 12:46:03.131041	\N	\N	\N	\N	\N	\N
2	HSP008	appollo	Hospital	Super Specialty	\N	0	\N	hjhddsgh@gmail.com	7856523362	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada Urban	\N	\N	Visakhapatnam	\N	Andhra Pradesh	India	520001	16.501625	80.64994	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["Neurology"]	["MRI"]	["Cafeteria"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	CLC008	hgdgd	Clinic	\N	\N	0	\N	hjsdghs@gmail.com	6789068790	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501627	80.649938	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["Pediatrics"]	["Minor Procedures"]	["Parking"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	HSP014	hfahfa	Hospital	Multi-Specialty	\N	0	Private	hfdafaj@gmail.com	7836763278	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501625	80.649895	500	high	\N	\N	0	0	0	0	0	0	["Pathology"]	["MRI"]	["24x7 Pharmacy"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	82532726182588	SBIN0001234	Guntur	SBI	gfghhjjk	\N
5	HSP015	noha	Hospital	Multi-Specialty	\N	0	\N	bhavanigojula2001@gmail.com	8895434535	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Guntur	\N	Andhra Pradesh	India	520001	16.300699	80.446873	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["Gynecology"]	["Blood Test"]	["24x7 Pharmacy"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	HSP007	hgdssjkd	Hospital	Multi-Specialty	gsghhsd	0	Private	dasgfas@gmail.com	4517316716	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501625	80.649895	500	high	\N	\N	0	0	0	0	0	0	["Orthopedics"]	["Ventilator Support"]	["Cafeteria"]	\N	\N	\N	\N	\N	\N	\N	pending	0	\N	\N	\N	1	0	0	0	0	2025-11-26 00:00:00	2025-11-26 00:00:00	\N	2025-11-26 00:00:00	2025-11-26 00:00:00	\N	\N	\N	\N	\N	\N
7	HSP005	ghdjkd	Hospital	Multi-Specialty	ghdskjkjsd	0	Private	gfsahjas@gmail.com	7854743565	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.870084	82.114409	500	high	\N	\N	0	0	0	0	0	0	["Pathology"]	["Blood Test"]	["Parking"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	1	0	0	0	0	2025-11-26 00:00:00	2025-11-26 00:00:00	\N	2025-11-26 00:00:00	2025-11-26 00:00:00	\N	\N	\N	\N	\N	\N
8	HSP010	hjasghgasf	Hospital	Super Specialty	\N	0	\N	monikanagaswathikadali@gmail.com	9987654434	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501625	80.649895	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["ENT"]	["CT Scan"]	["Cafeteria"]	\N	\N	\N	\N	\N	\N	\N	pending	0	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	HSP011	hjhggff	Hospital	Clinic	\N	0	\N	swathikadali32567@gmail.com	9666584158	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501625	80.649895	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["Ophthalmology"]	["ICU Care"]	["Ambulance Service"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	CLC011	prasadh	Clinic	\N	\N	0	\N	nagaswathikadali@gmail.com	9666584155	\N	\N	Poranki, Tadigadapa, Penamaluru, Krishna district	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501625	80.649895	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["ENT"]	[]	["Parking"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	DOC017	hhjjkjkh	IndividualDoctor	IndividualDoctor	\N	0	\N	hgafdfa@gmail.com	9882162412	\N	\N	Poranki, Tadigadapa, Penamaluru, Krishna district	\N	\N	Vijayawada	\N	Andhra Pradesh	India	521137	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	[]	["Teleconsultation"]	["Online Appointments"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	HSP019	monikaaaa	Hospital	Multi-Specialty	\N	0	\N	nagahikadali@gmail.com	9666825367	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501625	80.649895	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["ENT"]	["Dialysis Unit"]	["Online Appointments"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	HSP029	fgsfdsfs	Hospital	Nursing Home	\N	0	\N	hswgfsf@gmail.com	9564542452	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501625	80.649895	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["Radiology"]	["Dialysis Unit"]	["24x7 Pharmacy"]	\N	\N	\N	\N	\N	\N	\N	pending	0	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	HSP030	SwathiKadali	Hospital	General Hospital	I want Hospital	0	\N	kadaliswathi@gmail.com	9703576135	9888584155	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501625	80.649895	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["General Surgery"]	["Dialysis Unit"]	["Cafeteria"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	825327261823445361	SBIN0003614	kadapa	SBI	jhsahghfa	\N
15	HSP022	kims	Hospital	Super Specialty	\N	0	\N	nidubrolupavan@gmail.com	6453161788	8126552161	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501625	80.64994	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["ENT"]	["Ventilator Support"]	["Parking"]	\N	\N	\N	\N	\N	\N	\N	Approved	2	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	654338886543333333	SBIN0008744	Guntur	SBI	bhavani	\N
16	HSP009	hgshssh	Hospital	General Hospital	\N	0	\N	kjdgfhghhg@gmail.com	9987654545	\N	\N	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban)	\N	\N	Vijayawada	\N	Andhra Pradesh	India	520001	16.501473	80.64986	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	["ENT"]	["CT Scan"]	["Cafeteria"]	\N	\N	\N	\N	\N	\N	\N	pending	0	\N	\N	\N	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5138 (class 0 OID 97030)
-- Dependencies: 227
-- Data for Name: lab_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_category (category_id, category_name) FROM stdin;
1	Blood Tests
2	Imaging
3	Scaning
4	X-Ray
5	MRI
6	Urine Test
7	Cardiac/ECG
\.


--
-- TOC entry 5163 (class 0 OID 97224)
-- Dependencies: 252
-- Data for Name: lab_report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_report (report_id, patient_id, test_id, report_file, file_name, file_type, uploaded_on) FROM stdin;
1	1	1	\N	sample_report.pdf	application/pdf	2026-07-13 12:46:03.131041
28	3	5	\N	AfreedResumeAI&Annotation.pdf	application/pdf	2025-11-13 00:00:00
\.


--
-- TOC entry 5161 (class 0 OID 97215)
-- Dependencies: 250
-- Data for Name: lab_test; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_test (test_id, category_id, test_name, test_cost) FROM stdin;
1	1	Complete Blood Count	250
2	1	Sugar Level	158
3	1	Platelet Count	250
4	1	Hemoglobin	100
5	1	Cholesterol	250
6	2	Chest X-Ray	800
7	2	Spine X-Ray	950
8	3	Brain MRI	2500
9	3	Spine MRI	2800
10	4	Urine Routine	200
11	5	ECG	600
12	1	Platelet Count	200
13	1	blood test	100
\.


--
-- TOC entry 5143 (class 0 OID 97106)
-- Dependencies: 232
-- Data for Name: login_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_details (email, password, role) FROM stdin;
user1@example.com	hashed_pw_1	CUSTOMER
\.


--
-- TOC entry 5165 (class 0 OID 97236)
-- Dependencies: 254
-- Data for Name: medicine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicine (medicine_id, medicine_name, category, manufacturer, batch_no, price_per_unit, purchase_cost, quantity_available, reorder_level, expiry_date, description, status, location_of_rack, supplier_id, created_by, updated_by, created_at, updated_at, organization_id, person_id, image_url) FROM stdin;
31	Sample Paracetamol	Tablet	Sample Pharma	\N	25.5	\N	100	\N	\N	\N	\N	\N	6	\N	\N	2026-07-13 12:46:03.131041	\N	\N	\N	\N
1	Dolo (500mg)	Tablet	Micro Labs Ltd	DL500A	5	2.8	5	50	2027-05-10 00:00:00	Pain and fever relief	Active	Rack-A1	1	Admin	admin	2025-10-28 00:00:00	2025-12-08 00:00:00	105	\N	https://res.cloudinary.com/dvk6mwbht/image/upload/v1765189506/medicines/iq5abudymo9i1vnzt4qp.jpg
2	Paracetamol (650mg)	Tablet	Cipla Ltd	P650B	2.9	2.4	300	60	2026-11-30 00:00:00	Common fever reducer	Active	Rack-A2	1	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	105	\N	\N
3	Amoxicillin (250mg)	Capsule	GSK Pharma	AMX250C	5	4.2	120	20	2025-10-12 00:00:00	Antibiotic for infections	Active	Rack-B1	2	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	105	\N	\N
4	Cetrizine (10mg)	Tablet	Dr. Reddy Labs	CTZ10D	1.5	1.2	600	80	2027-09-01 00:00:00	Allergy and cold relief	Active	Rack-A3	3	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	105	\N	\N
5	Azithromycin (500mg)	Tablet	Cipla Ltd	AZ500E	7.8	6.2	150	25	2026-04-15 00:00:00	Bacterial infection treatment	Active	Rack-B2	2	Admin	Admin	2025-10-28 00:00:00	2025-12-08 00:00:00	105	\N	https://res.cloudinary.com/dvk6mwbht/image/upload/v1765188924/medicines/puqcygshytiu6flz0rl2.jpg
7	Crocin (500mg)	Tablet	GlaxoSmithKline	CRC500G	3.2	2.6	200	50	2027-01-01 00:00:00	Pain and fever relief	Active	Rack-A4	4	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	105	\N	\N
9	Pantoprazole (40mg)	Tablet	Sun Pharma	PTZ40H	4.2	3.7	220	40	2025-09-11 00:00:00	Acidity control	Active	Rack-A5	1	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	105	\N	\N
10	Metformin (500mg)	Tablet	Torrent Pharma	MTF500I	2.5	2.1	310	70	2026-09-25 00:00:00	Diabetes control	Active	Rack-A6	2	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
11	Calpol (500mg)	Tablet	GSK Pharma	CLP500J	3.1	2.7	280	60	2026-06-12 00:00:00	Fever reducer	Active	Rack-A7	3	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
12	Dextromethorphan (10ml)	Syrup	Pfizer	DXM10K	75	60	70	10	2025-12-20 00:00:00	Cough suppressant	Active	Rack-D2	4	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
13	Cetirizine (5mg)	Tablet	Dr. Reddy Labs	CTRZ5L	1.2	0.9	450	80	2027-10-01 00:00:00	Allergy relief	Active	Rack-B3	5	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
14	Becozym (100mg)	Tablet	Zydus Healthcare	BCZ100M	6.5	5.1	110	25	2026-02-15 00:00:00	Vitamin supplement	Active	Rack-C2	1	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
15	Insulin (100IU)	Injection	Novo Nordisk	INS100N	130	110	60	15	2025-11-30 00:00:00	Diabetes control injection	Active	Rack-E1	2	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
16	ORS (200ml)	Solution	FDC Ltd	ORS200O	25	20	200	30	2028-07-01 00:00:00	Rehydration solution	Active	Rack-F1	3	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
17	Zincovit (15mg)	Tablet	Apex Labs	ZNCT15P	5.5	4.2	150	25	2026-05-10 00:00:00	Multivitamin supplement	Active	Rack-B4	4	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
18	Amoxycillin (500mg)	Capsule	Abbott	AMX500Q	7.2	6	100	20	2026-03-03 00:00:00	Antibiotic	Active	Rack-B5	5	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
19	Augmentin (625mg)	Tablet	GSK Pharma	AUG625R	12.5	10.2	90	15	2026-08-15 00:00:00	Antibiotic combination	Active	Rack-B6	1	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
20	Norfloxacin (400mg)	Tablet	Cipla Ltd	NRF400S	8.5	7.1	130	20	2026-12-12 00:00:00	Urinary tract infections	Inactive	Rack-C3	2	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
21	Omeprazole (20mg)	Capsule	Dr. Reddy Labs	OMP20T	3.6	3	200	40	2027-09-10 00:00:00	Acidity control	Active	Rack-C4	3	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
22	Domperidone (10mg)	Tablet	Zydus Pharma	DMP10U	4.5	3.7	190	35	2026-07-07 00:00:00	Vomiting control	Active	Rack-D3	4	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
23	Losartan (50mg)	Tablet	Cipla Ltd	LSR50V	6	5.1	210	30	2026-05-20 00:00:00	Blood pressure control	Active	Rack-D4	5	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
24	Telma (40mg)	Tablet	Glenmark	TLM40W	7.2	6	150	20	2027-04-04 00:00:00	BP medicine	Active	Rack-D5	1	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
25	Atorvastatin (10mg)	Tablet	Sun Pharma	ATV10X	8	6.8	120	25	2026-06-30 00:00:00	Cholesterol control	Active	Rack-D6	2	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
26	Betadine (50ml)	Solution	Win-Medicare	BTD50Y	45	39	85	15	2028-01-01 00:00:00	Antiseptic solution	Active	Rack-E2	3	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
27	Becosules (100mg)	Capsule	Pfizer	BCS100Z	7	6	130	30	2027-10-10 00:00:00	Vitamin supplement	Active	Rack-E3	4	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
28	Dexamethasone (4mg)	Injection	Zydus Pharma	DXM4A1	15	12.5	70	10	2025-12-01 00:00:00	Anti-inflammatory	Active	Rack-E4	5	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
29	Ciprofloxacin (500mg)	Tablet	Cipla Ltd	CIP500A2	10	8.2	140	20	2026-08-08 00:00:00	Antibiotic	Inactive	Rack-F2	1	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
30	Dolo (650mg)	Tablet	Micro Labs Ltd	DL650A3	4	3.2	260	50	2027-06-15 00:00:00	Pain and fever relief (extra power)	Active	Rack-F3	2	Admin	Admin	2025-10-28 00:00:00	2025-10-28 00:00:00	89	\N	\N
33	Paracetamol	Tablet	Cipla	BAT001	12.5	8	120	20	2026-05-10 00:00:00	Pain Relief	ACTIVE	Rack-1	1	\N	\N	2025-11-25 00:00:00	\N	89	1	\N
34	Dolo 650	Tablet	Micro Labs	DL650A	4	2	100	20	2025-11-20 00:00:00	Fever / Pain relief	Active	Rack A1	3	\N	\N	2025-12-03 00:00:00	2025-12-03 00:00:00	105	1	\N
35	Amoxicillin 500mg	Capsule	Cipla	AMX500B	6	4.2	50	15	2026-01-05 00:00:00	Antibiotic	Active	Rack B2	3	\N	\N	2025-12-03 00:00:00	2025-12-03 00:00:00	105	1	\N
36	Paracetamol 500mg	Tablet	Sun Pharma	PARA500X	56	1.8	10	5	2025-08-15 00:00:00	Pain & Fever	Active	Rack C3	3	\N	\N	2025-12-03 00:00:00	2025-12-03 00:00:00	105	1	\N
37	Vitamin C 1000mg	Tablet	Nutra Health	VITC100	8.5	6	0	10	2024-12-30 00:00:00	Immunity Booster	Inactive	Rack D4	3	\N	\N	2025-12-03 00:00:00	2025-12-03 00:00:00	105	1	\N
38	Paracetamol	Tablet	Cipla	PCM650-B1	2.5	1.8	300	50	2026-12-31 00:00:00	Fever & pain relief	Active	A1	1	\N	\N	2025-12-08 00:00:00	2025-12-08 00:00:00	105	1	\N
39	Amoxicillin	Capsule	Sun Pharma	AMX250-B2	5	3.6	120	40	2026-08-15 00:00:00	Antibiotic	Active	B2	1	\N	\N	2025-12-08 00:00:00	2025-12-08 00:00:00	105	1	\N
40	Cetirizine	Tablet	Dr Reddy	CET10-C3	1.5	1	600	100	2026-03-20 00:00:00	Allergy tablet	Active	C3	1	\N	\N	2025-12-08 00:00:00	2025-12-08 00:00:00	105	1	\N
41	Azithromycin	Tablet	Cipla	AZ500-D4	7.8	6.2	150	30	2027-01-10 00:00:00	Infection medicine	Active	D1	1	\N	\N	2025-12-08 00:00:00	2025-12-08 00:00:00	105	1	\N
\.


--
-- TOC entry 5167 (class 0 OID 97247)
-- Dependencies: 256
-- Data for Name: medicine_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicine_reviews (review_id, id, medicine_id, rating, review_text, created_on) FROM stdin;
1	7	1	5	Good quality!	2025-12-12 00:00:00
2	1	1	5	Very good medicine!	2025-12-12 00:00:00
\.


--
-- TOC entry 5140 (class 0 OID 97054)
-- Dependencies: 229
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (patient_id, name, gender, aadhar, phone, date_of_birth, address, doctor_id, appointment_date, appointment_time, disease, dosage_instructions, generated_at, notes, selected_medicines, date_issued, medication, selected_tests, medision_status, doctor_status, lab_status) FROM stdin;
1	Sample Patient	Male	999988887777	9000000030	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	Priya Sharma	Female	\N	5426216838	\N	Gandhi Nagar, Vijayawada	103	1-NOV-25	17:54:40.459674200	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Completed
2	Priya Verma	Female	876543210987	8765432109	1995-09-22 00:00:00	Hyderabad, Telangana	102	1-NOV-25	\N	\N	\N	\N	\N	\N	2025-11-14 00:00:00	\N	\N	\N	Completed	\N
3	Vamsi B	Male	123412341235	9876543210	1995-08-15 00:00:00	Hyderabad, Telangana, India	1	1-NOV-25	\N	\N	\N	\N	\N	\N	2025-11-14 00:00:00	\N	\N	\N	pending	\N
4	haritha	Female	992881287988	76869899	2003-06-18 00:00:00	wertyjhcvbk	108	1-NOV-25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N
5	vishnavi	Female	992881287323	76869899	2003-06-18 00:00:00	wertyjhcvbk	108	1-NOV-25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N
7	Rahul Singh	Male	123456789017	9876543217	1985-06-22 00:00:00	Vijayawada, Andhra Pradesh	107	5-NOV-25	09:00 AM	Back Pain	Physiotherapy daily	2025-10-27 00:00:00	\N	Painkiller	\N	\N	MRI	Issued	Completed	Pending
9	Vamsi Krishna	Male	123456789019	9876543219	1996-09-09 00:00:00	Vijayawada	109	5-NOV-25	05:15 PM	Fever	Take rest	\N	High temperature	Dolo 650	2025-10-27 00:00:00	Tablet	Blood Test	Completed	Pending	Completed
11	Ajay Patel	Male	\N	9876543220	1990-07-10 00:00:00	Ahmedabad	108	5-NOV-25	02:00 PM	Fever	Take medicine after meal	2025-10-27 00:00:00	\N	Paracetamol	\N	\N	\N	Completed	Completed	Completed
\.


--
-- TOC entry 5168 (class 0 OID 97259)
-- Dependencies: 257
-- Data for Name: prescription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescription (id, doctor_id, dosage_instructions, generated_at, notes, patient_id, selected_medicines, date_issued, dosage, medication, selected_tests) FROM stdin;
1	1	Take twice daily after food	\N	\N	1	Sample Paracetamol	\N	\N	\N	\N
10	101	Take 1 tablet twice daily after meals	2025-11-13 10:42:46.375	Patient recovering well	501	Paracetamol, Amoxicillin	2025-11-13 00:00:00	500mg	Amoxicillin	Blood Test, X-Ray
2	102	Take 2 spoons before food	2025-11-13 10:42:46.385	Check sugar level next week	502	Metformin, Vitamin B12	2025-11-13 00:00:00	1000mg	Metformin	Blood Sugar Test
3	201	Take 1 tablet after lunch	2025-11-13 11:25:46.668	Patient needs rest	504	Paracetamol	2025-11-13 00:00:00	500mg	Paracetamol	Blood Test
4	202	Take syrup twice daily	2025-11-13 11:25:46.679	Cough persists	505	Benadryl	2025-11-13 00:00:00	10ml	Benadryl	X-Ray
5	203	Take 1 tablet before bed	2025-11-13 11:25:46.686	Completed treatment	503	Cetirizine	2025-11-13 00:00:00	10mg	Cetirizine	Blood Test
\.


--
-- TOC entry 5170 (class 0 OID 97272)
-- Dependencies: 259
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (prescription_id, id, order_id, file_url, verification_status, uploaded_on) FROM stdin;
\.


--
-- TOC entry 5136 (class 0 OID 97021)
-- Dependencies: 225
-- Data for Name: supplier_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_master (supplier_id, suplier_name, company_name, s_email, s_contact, s_status, supaly_date, created_at, updated_at) FROM stdin;
6	Sample Supplier	Sample Pharma Pvt Ltd	supplier@example.com	9000000010	Active	\N	2026-07-13 12:46:03.131041	\N
8	Apollo Distributors	Apollo Healthcare Ltd	sales@apollo.com	9876501234	Active	2024-04-15 00:00:00	2025-10-28 00:00:00	2025-10-28 00:00:00
1	MedPlus Pharma	MedPlus Pvt Ltd	info@medplus.com	9876543210	Active	2024-03-20 00:00:00	2025-10-28 00:00:00	2025-10-28 00:00:00
2	Apollo CUSTOMER	Apollo Healthcare Pvt Ltd	apollo@gmail.com	9876543210	Active	2025-10-28 00:00:00	2025-10-28 00:00:00	2025-10-28 00:00:00
3	LifeLine Traders	LifeLine Drugs Pvt Ltd	sales@lifeline.com	9784512369	Active	2024-07-01 00:00:00	2025-10-28 00:00:00	2025-10-28 00:00:00
4	SunCare Distributors	SunCare Pharma Ltd	contact@suncare.com	9123456789	Inactive	2024-06-05 00:00:00	2025-10-28 00:00:00	2025-10-28 00:00:00
5	CureWell Supplies	CureWell Pharma	support@curewell.com	9988776655	Active	2024-05-10 00:00:00	2025-10-28 00:00:00	2025-10-28 00:00:00
\.


--
-- TOC entry 5134 (class 0 OID 97007)
-- Dependencies: 223
-- Data for Name: user_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_master (id, full_name, mobile_number, email_id, aadhar_number, address, department, role, salary, joining_date, shift_timings, image, login_attempts, password, two_factor_authentication, pan_number, designation, organization_id) FROM stdin;
1	krishna	9998877664	bvamsi0103@gmail.com	1234-1111-1111	Guntur, AP	Nurses	medical	45000	2021-02-10 00:00:00	7 AM - 3 PM	\N	0	11112222	1	\N	\N	105
2	EizXcacAC	9887766554	eswarimadhavarapu@gmail.com	1234-2222-2222	Vijayawada, AP	Admin	superadmin	32000	2022-01-05 00:00:00	8 AM - 4 PM	\N	0	11112222	\N	\N	\N	89
3	Manisha Rao	9876554433	sunilsaisomasi@gmail.com	1234-3333-3333	Hyderabad, TS	admin	admin	30000	2023-03-15 00:00:00	10 AM - 6 PM	\N	0	11112222	1	\N	\N	\N
4	Lakshmi Priya	9812345678	lakshmi.priya@hospital.com	1234-4444-4444	Tirupati, AP	Nurses	Assistant Nurse	28000	2023-06-10 00:00:00	9 AM - 5 PM	\N	0	\N	\N	\N	\N	\N
5	Meena Sharma	9123456780	pstesting733@gmail.com	2234-5555-5555	Mumbai, MH	Pharmacy	admin	40000	2023-03-01 00:00:00	10 AM - 6 PM	\N	0	11112222	\N	\N	\N	\N
6	Rahul Verma	9823456710	rahul.verma@hospital.com	2234-6666-6666	Pune, MH	Pharmacy	Pharmacy Assistant	28000	2022-08-15 00:00:00	9 AM - 5 PM	\N	0	\N	\N	\N	\N	\N
7	Priyanka Nair	9765432109	priyanka.nair@hospital.com	2234-7777-7777	Ernakulam, KL	Pharmacy	Inventory Manager	35000	2021-12-20 00:00:00	8 AM - 4 PM	\N	0	\N	\N	\N	\N	\N
8	Ravi Teja	9678123456	ravi.teja@hospital.com	2234-8888-8888	Vijayawada, AP	Pharmacy	Cashier	22000	2023-07-01 00:00:00	10 AM - 6 PM	\N	0	\N	\N	\N	\N	\N
9	Pooja Singh	9998123456	pooja.singh@hospital.com	3234-1111-2222	Delhi, DL	Reception	Front Desk Executive	30000	2021-10-01 00:00:00	9 AM - 5 PM	\N	0	\N	\N	\N	\N	\N
10	Vikas Yadav	9988776655	vikas.yadav@hospital.com	3234-2222-3333	Lucknow, UP	Reception	Receptionist	27000	2022-11-20 00:00:00	8 AM - 4 PM	\N	0	\N	\N	\N	\N	\N
11	Anjali Menon	9876543201	anjali.menon@hospital.com	3234-3333-4444	Kochi, KL	Reception	Customer Support	26000	2023-02-12 00:00:00	10 AM - 6 PM	\N	0	\N	\N	\N	\N	\N
12	Amit Sharma	9812345000	amit.sharma@hospital.com	3234-4444-5555	Bangalore, KA	Reception	Coordinator	31000	2022-05-18 00:00:00	9 AM - 5 PM	\N	0	\N	\N	\N	\N	\N
13	Ramesh Naidu	9876012345	ramesh.naidu@hospital.com	4234-1111-1111	Vijayawada, AP	Cleaning	Janitor	18000	2022-06-20 00:00:00	6 AM - 2 PM	\N	0	\N	\N	\N	\N	\N
14	Suresh Kumar	9123450987	suresh.kumar@hospital.com	4234-2222-2222	Guntur, AP	Cleaning	Floor Cleaner	17500	2023-01-25 00:00:00	7 AM - 3 PM	\N	0	\N	\N	\N	\N	\N
15	Radha Devi	9988771122	radha.devi@hospital.com	4234-3333-3333	Vizag, AP	Cleaning	Sanitation Worker	18500	2022-09-12 00:00:00	6 AM - 2 PM	\N	0	\N	\N	\N	\N	\N
16	Anand Patel	9887654321	anand.patel@hospital.com	4234-4444-4444	Surat, GJ	Cleaning	Waste Management	19000	2023-04-01 00:00:00	6 AM - 2 PM	\N	0	\N	\N	\N	\N	\N
17	sdfghj	5342672178	dsfgh@gmail.com	524216512562	sghhsjjkkks ghshjjkkskllkls	Orthopedics	Owner	\N	2025-11-26 00:00:00	9AM - 6PM	\N	0	HSPL-N0O8VL	1	JSFSG5342G	dfghjk	83
18	Neha Jain	9823456789	neha.jain@hospital.com	5234-2222-2222	Delhi, DL	Lab	Pathology Assistant	32000	2022-03-10 00:00:00	9 AM - 5 PM	\N	0	\N	\N	\N	\N	\N
19	Sanjay Rao	9912345678	sanjay.rao@hospital.com	5234-3333-3333	Chennai, TN	Lab	Sample Collector	25000	2023-05-14 00:00:00	7 AM - 3 PM	\N	0	\N	\N	\N	\N	\N
20	Divya Gupta	9876123450	divya.gupta@hospital.com	5234-4444-4444	Delhi, DL	Lab	Microbiologist	42000	2020-11-05 00:00:00	9 AM - 5 PM	\N	0	\N	\N	\N	\N	\N
21	Rajesh Kumar	9877012345	rajesh.kumar@hospital.com	6234-1111-1111	Hyderabad, TS	Security	Head Guard	25000	2021-04-15 00:00:00	8 PM - 6 AM	\N	0	\N	\N	\N	\N	\N
22	Mohan Singh	9123409876	mohan.singh@hospital.com	6234-2222-2222	Delhi, DL	Security	Guard	20000	2022-08-01 00:00:00	8 PM - 6 AM	\N	0	\N	\N	\N	\N	\N
23	Pavan Reddy	9987601234	pavan.reddy@hospital.com	6234-3333-3333	Vijayawada, AP	Security	Night Guard	21000	2023-01-10 00:00:00	9 PM - 5 AM	\N	0	\N	\N	\N	\N	\N
24	Kishore Kumar	9812312345	kishore.kumar@hospital.com	6234-4444-4444	Chennai, TN	Security	Day Guard	19500	2022-10-25 00:00:00	8 AM - 6 PM	\N	0	\N	\N	\N	\N	\N
25	Naveen Kumar	9876543211	naveen.kumar@hospital.com	7234-1111-1111	Guntur, AP	Maintenance	Electrician	28000	2022-05-15 00:00:00	9 AM - 5 PM	\N	0	\N	\N	\N	\N	\N
26	Ravi Shankar	9123498765	ravi.shankar@hospital.com	7234-2222-2222	Hyderabad, TS	Maintenance	Plumber	26000	2021-12-01 00:00:00	8 AM - 4 PM	\N	0	\N	\N	\N	\N	\N
27	Sunil Patil	9823109876	sunil.patil@hospital.com	7234-3333-3333	Pune, MH	Maintenance	Technician	30000	2023-06-01 00:00:00	9 AM - 5 PM	\N	0	\N	\N	\N	\N	\N
28	Mahesh Babu	9998123098	mahesh.babu@hospital.com	7234-4444-4444	Vijayawada, AP	Maintenance	Lift Operator	24000	2022-09-12 00:00:00	8 AM - 4 PM	\N	0	\N	\N	\N	\N	\N
29	Arun Prasad	9876001234	arun.prasad@hospital.com	7234-5555-5555	Chennai, TN	Maintenance	AC Mechanic	27000	2023-02-20 00:00:00	9 AM - 5 PM	\N	0	\N	\N	\N	\N	\N
30	Vinod Reddy	9876540987	vinod.reddy@hospital.com	7234-6666-6666	Hyderabad, TS	Maintenance	Generator Operator	25000	2022-04-25 00:00:00	8 AM - 4 PM	\N	0	\N	\N	\N	\N	\N
31	Anitha Rao	9876543210	anitha.rao@healthcare.com	123456789012	Vijayawada	Nursing	Head Nurse	18500	2023-05-10 00:00:00	8AM - 4PM	\N	0	\N	\N	\N	\N	\N
32	Anitha Rao	9876543210	anitha.rao@healthcare.com	123456789042	Vijayawada	Nursing	Head Nurse	18500	2023-05-10 00:00:00	8AM - 4PM	\N	0	\N	\N	\N	\N	\N
33	Dr. Krishna	9876543210	krishna@example.com	123456780002	Vijayawada, Andhra Pradesh	Cardiology	Doctor	75000	2025-11-04 00:00:00	10:00 AM - 6:00 PM	\N	0	securePassword123	1	\N	\N	\N
34	kalpana	123232323	pavansanthosh733@gmail.com	123232323	wertyjhcvbk	Nursing	laboratory	23000	2025-11-15 00:00:00	9 to 10	\N	0	\N	\N	\N	\N	\N
35	Naga	9666584155	nagaswathikadali@gmail.com	280238184424	Poranki, Tadigadapa, Penamaluru, Krishna district	Administration	Owner	\N	2025-12-06 00:00:00	9AM - 6PM	\N	0	HSPL-FY9D2V	1	JGSFA6544A	Director	232
36	swathi	9666584155	swathikadali32567@gmail.com	280238181416	Poranki, Tadigadapa, Penamaluru, Krishna district	Ophthalmology	Owner	\N	2025-12-06 00:00:00	9AM - 6PM	\N	0	HSPL-58PN1X	1	KJSGR7563L	owner	228
37	monika	9666584165	swathi32567@gmail.com	280238181765	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban), NTR, Andhra Pradesh, 520001, India	ENT	Owner	\N	2025-12-06 00:00:00	9AM - 6PM	\N	0	HSPL-Z3KMUU	1	KJUGR7563L	owner	231
38	monikanagaswathi	9876543276	monikanagaswathikadali@gmail.com	284358184542	Poranki, Tadigadapa, Penamaluru, Krishna district	ENT	Owner	\N	2025-12-06 00:00:00	9AM - 6PM	\N	0	HSPL-GJL9EM	1	JGSFA6844A	owner	234
39	jjhggffff	9899543276	monikana@gmail.com	284358184567	Poranki, Tadigadapa, Penamaluru, Krishna district	Radiology	Owner	\N	2025-12-06 00:00:00	9AM - 6PM	\N	0	HSPL-8K7Z4S	1	JGSFA6844D	owner	235
40	kadalimonikanagaswathi	9878677546	eswarimadavarapu@gmail.com	876406368075	Poranki, Tadigadapa, Penamaluru, Krishna district	General Surgery	Owner	\N	2025-12-06 00:00:00	9AM - 6PM	\N	0	11112222	1	JNDYG6543F	Director	236
41	pavan	8886261806	nidubrolupavan@gmail.com	532566326773	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban), NTR, Andhra Pradesh, 520001, India	ENT	Owner	\N	2025-12-12 00:00:00	9AM - 6PM	\N	0	HSPL-2Y3LI5	1	JGDBS6452H	Director	243
42	hggdshsd	6728276365	jsdhdgf@gmail.com	874655651272	HJSDWEGHGHWE	Neurology	Owner	\N	2025-12-12 00:00:00	9AM - 6PM	\N	0	HSPL-ZEI2FJ	1	JDHET8352K	jhdhgwyuew	244
43	bhavani	7794023919	bhavanigojula2001@gmail.com	398058917119	KG Gupta Municipal Employees Colony, Labbipet, Vijayawada, Vijayawada (Urban), NTR, Andhra Pradesh, 520001, India	Gynecology	Owner	\N	2025-12-13 00:00:00	9AM - 6PM	\N	0	HSPL-CWHEKF	1	KHRSG8856J	owner	247
\.


--
-- TOC entry 5132 (class 0 OID 96994)
-- Dependencies: 221
-- Data for Name: ward_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ward_master (ward_id, ward_name, ward_type, total_beds, created_on) FROM stdin;
1	General Ward A	General	40	2026-07-13 12:46:03.131041
2	ICU Ward	ICU	10	2026-07-13 12:46:03.131041
3	Emergency Ward	Emergency	15	2026-07-13 12:46:03.131041
4	icu2	ICU	5	2025-10-25 00:00:00
5	General Ward B	General	8	2025-10-17 00:00:00
6	General Ward A	General	10	2025-10-17 00:00:00
7	ICU Ward	ICU	10	2025-10-22 00:00:00
8	normal	General	44	2025-10-22 00:00:00
\.


--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 247
-- Name: appointments_appointment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_appointment_id_seq', 4, true);


--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 219
-- Name: bed_booking_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bed_booking_seq', 16, true);


--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 234
-- Name: customer_addresses_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_addresses_address_id_seq', 2, true);


--
-- TOC entry 5179 (class 0 OID 0)
-- Dependencies: 236
-- Name: customer_cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_cart_cart_id_seq', 2, true);


--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 238
-- Name: customer_cart_items_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_cart_items_cart_item_id_seq', 7, true);


--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 242
-- Name: customer_order_items_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_order_items_order_item_id_seq', 3, true);


--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 240
-- Name: customer_orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_orders_order_id_seq', 1, true);


--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 244
-- Name: customer_payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_payments_payment_id_seq', 1, false);


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 230
-- Name: hospitals_medicalstores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospitals_medicalstores_id_seq', 16, true);


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 226
-- Name: lab_category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_category_category_id_seq', 7, true);


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 251
-- Name: lab_report_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_report_report_id_seq', 28, true);


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 249
-- Name: lab_test_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_test_test_id_seq', 13, true);


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 253
-- Name: medicine_medicine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicine_medicine_id_seq', 31, true);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 255
-- Name: medicine_reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicine_reviews_review_id_seq', 2, true);


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 258
-- Name: prescriptions_prescription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_prescription_id_seq', 1, false);


--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 224
-- Name: supplier_master_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_master_supplier_id_seq', 12, true);


--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 222
-- Name: user_master_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_master_id_seq', 43, true);


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 220
-- Name: ward_master_ward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ward_master_ward_id_seq', 8, true);


--
-- TOC entry 4953 (class 2606 OID 97213)
-- Name: appointments pk_appointments; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT pk_appointments PRIMARY KEY (appointment_id);


--
-- TOC entry 4937 (class 2606 OID 97135)
-- Name: customer_addresses pk_customer_addresses; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT pk_customer_addresses PRIMARY KEY (address_id);


--
-- TOC entry 4939 (class 2606 OID 97144)
-- Name: customer_cart pk_customer_cart; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart
    ADD CONSTRAINT pk_customer_cart PRIMARY KEY (cart_id);


--
-- TOC entry 4943 (class 2606 OID 97157)
-- Name: customer_cart_items pk_customer_cart_items; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart_items
    ADD CONSTRAINT pk_customer_cart_items PRIMARY KEY (cart_item_id);


--
-- TOC entry 4947 (class 2606 OID 97181)
-- Name: customer_order_items pk_customer_order_items; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order_items
    ADD CONSTRAINT pk_customer_order_items PRIMARY KEY (order_item_id);


--
-- TOC entry 4945 (class 2606 OID 97171)
-- Name: customer_orders pk_customer_orders; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_orders
    ADD CONSTRAINT pk_customer_orders PRIMARY KEY (order_id);


--
-- TOC entry 4949 (class 2606 OID 97192)
-- Name: customer_payments pk_customer_payments; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_payments
    ADD CONSTRAINT pk_customer_payments PRIMARY KEY (payment_id);


--
-- TOC entry 4951 (class 2606 OID 97202)
-- Name: doctor_availability pk_doctor_availability; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_availability
    ADD CONSTRAINT pk_doctor_availability PRIMARY KEY (slot_id);


--
-- TOC entry 4915 (class 2606 OID 97047)
-- Name: doctors pk_doctors; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT pk_doctors PRIMARY KEY (doctor_id);


--
-- TOC entry 4927 (class 2606 OID 97099)
-- Name: hospitals_medicalstores pk_hospitals_medicalstores; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals_medicalstores
    ADD CONSTRAINT pk_hospitals_medicalstores PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 97036)
-- Name: lab_category pk_lab_category; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_category
    ADD CONSTRAINT pk_lab_category PRIMARY KEY (category_id);


--
-- TOC entry 4957 (class 2606 OID 97234)
-- Name: lab_report pk_lab_report; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_report
    ADD CONSTRAINT pk_lab_report PRIMARY KEY (report_id);


--
-- TOC entry 4955 (class 2606 OID 97222)
-- Name: lab_test pk_lab_test; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_test
    ADD CONSTRAINT pk_lab_test PRIMARY KEY (test_id);


--
-- TOC entry 4959 (class 2606 OID 97245)
-- Name: medicine pk_medicine; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine
    ADD CONSTRAINT pk_medicine PRIMARY KEY (medicine_id);


--
-- TOC entry 4961 (class 2606 OID 97258)
-- Name: medicine_reviews pk_medicine_reviews; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine_reviews
    ADD CONSTRAINT pk_medicine_reviews PRIMARY KEY (review_id);


--
-- TOC entry 4923 (class 2606 OID 97062)
-- Name: patients pk_patients; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT pk_patients PRIMARY KEY (patient_id);


--
-- TOC entry 4963 (class 2606 OID 97270)
-- Name: prescription pk_prescription; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT pk_prescription PRIMARY KEY (id);


--
-- TOC entry 4965 (class 2606 OID 97282)
-- Name: prescriptions pk_prescriptions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT pk_prescriptions PRIMARY KEY (prescription_id);


--
-- TOC entry 4911 (class 2606 OID 97028)
-- Name: supplier_master pk_supplier_master; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_master
    ADD CONSTRAINT pk_supplier_master PRIMARY KEY (supplier_id);


--
-- TOC entry 4907 (class 2606 OID 97017)
-- Name: user_master pk_user_master; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_master
    ADD CONSTRAINT pk_user_master PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 97005)
-- Name: ward_master pk_ward_master; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ward_master
    ADD CONSTRAINT pk_ward_master PRIMARY KEY (ward_id);


--
-- TOC entry 4941 (class 2606 OID 97146)
-- Name: customer_cart uq_customer_cart_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart
    ADD CONSTRAINT uq_customer_cart_user UNIQUE (user_id);


--
-- TOC entry 4917 (class 2606 OID 97051)
-- Name: doctors uq_doctors_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT uq_doctors_email UNIQUE (email);


--
-- TOC entry 4919 (class 2606 OID 97053)
-- Name: doctors uq_doctors_license; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT uq_doctors_license UNIQUE (medical_license_no);


--
-- TOC entry 4921 (class 2606 OID 97049)
-- Name: doctors uq_doctors_phone; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT uq_doctors_phone UNIQUE (phone);


--
-- TOC entry 4929 (class 2606 OID 97101)
-- Name: hospitals_medicalstores uq_hms_code; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals_medicalstores
    ADD CONSTRAINT uq_hms_code UNIQUE (code);


--
-- TOC entry 4931 (class 2606 OID 97103)
-- Name: hospitals_medicalstores uq_hms_org_mail; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals_medicalstores
    ADD CONSTRAINT uq_hms_org_mail UNIQUE (organization_mail);


--
-- TOC entry 4933 (class 2606 OID 97105)
-- Name: hospitals_medicalstores uq_hms_phone; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals_medicalstores
    ADD CONSTRAINT uq_hms_phone UNIQUE (hospital_phone);


--
-- TOC entry 4935 (class 2606 OID 97115)
-- Name: login_details uq_login_details_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT uq_login_details_email UNIQUE (email);


--
-- TOC entry 4925 (class 2606 OID 97064)
-- Name: patients uq_patients_aadhar; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT uq_patients_aadhar UNIQUE (aadhar);


--
-- TOC entry 4909 (class 2606 OID 97019)
-- Name: user_master uq_user_master_aadhar; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_master
    ADD CONSTRAINT uq_user_master_aadhar UNIQUE (aadhar_number);


--
-- TOC entry 4966 (class 2606 OID 97283)
-- Name: bed_booking fk_bed_booking_ward; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bed_booking
    ADD CONSTRAINT fk_bed_booking_ward FOREIGN KEY (ward_id) REFERENCES public.ward_master(ward_id);


--
-- TOC entry 4968 (class 2606 OID 97293)
-- Name: customer_cart fk_cart_cust; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart
    ADD CONSTRAINT fk_cart_cust FOREIGN KEY (user_id) REFERENCES public.user_master(id);


--
-- TOC entry 4969 (class 2606 OID 97298)
-- Name: customer_cart_items fk_cart_items; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_cart_items
    ADD CONSTRAINT fk_cart_items FOREIGN KEY (cart_id) REFERENCES public.customer_cart(cart_id);


--
-- TOC entry 4967 (class 2606 OID 97288)
-- Name: customer_addresses fk_cust_addr; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT fk_cust_addr FOREIGN KEY (user_id) REFERENCES public.user_master(id);


--
-- TOC entry 4974 (class 2606 OID 97323)
-- Name: doctor_availability fk_doc_avail; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_availability
    ADD CONSTRAINT fk_doc_avail FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id);


--
-- TOC entry 4975 (class 2606 OID 97328)
-- Name: lab_test fk_lab_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_test
    ADD CONSTRAINT fk_lab_category FOREIGN KEY (category_id) REFERENCES public.lab_category(category_id);


--
-- TOC entry 4976 (class 2606 OID 97338)
-- Name: lab_report fk_lab_test; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_report
    ADD CONSTRAINT fk_lab_test FOREIGN KEY (test_id) REFERENCES public.lab_test(test_id);


--
-- TOC entry 4970 (class 2606 OID 97308)
-- Name: customer_orders fk_orders_addr; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_orders
    ADD CONSTRAINT fk_orders_addr FOREIGN KEY (address_id) REFERENCES public.customer_addresses(address_id);


--
-- TOC entry 4971 (class 2606 OID 97303)
-- Name: customer_orders fk_orders_cust; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_orders
    ADD CONSTRAINT fk_orders_cust FOREIGN KEY (user_id) REFERENCES public.user_master(id);


--
-- TOC entry 4972 (class 2606 OID 97313)
-- Name: customer_order_items fk_orditem_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_order_items
    ADD CONSTRAINT fk_orditem_order FOREIGN KEY (order_id) REFERENCES public.customer_orders(order_id);


--
-- TOC entry 4977 (class 2606 OID 97333)
-- Name: lab_report fk_patient_lab; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_report
    ADD CONSTRAINT fk_patient_lab FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id);


--
-- TOC entry 4973 (class 2606 OID 97318)
-- Name: customer_payments fk_pay_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_payments
    ADD CONSTRAINT fk_pay_order FOREIGN KEY (order_id) REFERENCES public.customer_orders(order_id);


--
-- TOC entry 4981 (class 2606 OID 97358)
-- Name: prescriptions fk_pres_cust; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT fk_pres_cust FOREIGN KEY (id) REFERENCES public.user_master(id);


--
-- TOC entry 4982 (class 2606 OID 97363)
-- Name: prescriptions fk_pres_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT fk_pres_order FOREIGN KEY (order_id) REFERENCES public.customer_orders(order_id);


--
-- TOC entry 4979 (class 2606 OID 97353)
-- Name: medicine_reviews fk_review_cust; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine_reviews
    ADD CONSTRAINT fk_review_cust FOREIGN KEY (id) REFERENCES public.user_master(id);


--
-- TOC entry 4980 (class 2606 OID 97348)
-- Name: medicine_reviews fk_review_medicine; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine_reviews
    ADD CONSTRAINT fk_review_medicine FOREIGN KEY (medicine_id) REFERENCES public.medicine(medicine_id);


--
-- TOC entry 4978 (class 2606 OID 97343)
-- Name: medicine fk_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicine
    ADD CONSTRAINT fk_supplier FOREIGN KEY (supplier_id) REFERENCES public.supplier_master(supplier_id);


-- Completed on 2026-08-13 18:14:59

--
-- PostgreSQL database dump complete
--

\unrestrict xW1d8gCjkvunMnMFWaW190ex5bX6bu6cXHBvfbtKXfzmGKm4m2cHXL5kPScpJnN

