--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Debian 15.12-1.pgdg120+1)
-- Dumped by pg_dump version 15.12 (Debian 15.12-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    title character varying NOT NULL,
    amount double precision NOT NULL,
    type character varying NOT NULL,
    is_recurring boolean,
    is_installment boolean,
    num_installments integer,
    notes character varying,
    user_id integer NOT NULL,
    date timestamp without time zone,
    labels json
);


--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: installment_expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.installment_expenses (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying NOT NULL,
    amount double precision NOT NULL,
    is_installment boolean,
    is_active boolean,
    num_installments integer NOT NULL,
    begin_date date NOT NULL,
    end_date date,
    labels json
);


--
-- Name: installment_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.installment_expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: installment_expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.installment_expenses_id_seq OWNED BY public.installment_expenses.id;


--
-- Name: labels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.labels (
    id integer NOT NULL,
    name character varying NOT NULL,
    color character varying NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: labels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.labels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.labels_id_seq OWNED BY public.labels.id;


--
-- Name: recurring_expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recurring_expenses (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying NOT NULL,
    amount double precision NOT NULL,
    is_recurring boolean,
    is_active boolean,
    created_at timestamp without time zone,
    labels json
);


--
-- Name: recurring_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recurring_expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recurring_expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recurring_expenses_id_seq OWNED BY public.recurring_expenses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    password character varying(255) NOT NULL,
    is_verified boolean NOT NULL,
    verification_token character varying(255)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: installment_expenses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.installment_expenses ALTER COLUMN id SET DEFAULT nextval('public.installment_expenses_id_seq'::regclass);


--
-- Name: labels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labels ALTER COLUMN id SET DEFAULT nextval('public.labels_id_seq'::regclass);


--
-- Name: recurring_expenses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recurring_expenses ALTER COLUMN id SET DEFAULT nextval('public.recurring_expenses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.alembic_version (version_num) VALUES ('780bf4ebd955');


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (1, 'Servicios', -111, 'expense', false, false, NULL, '', 1, '2025-04-02 00:00:00', '[{"name": "Casa", "color": "#9b59b6"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (2, 'Kebab', -245, 'expense', false, false, NULL, '', 1, '2025-04-03 00:00:00', '[{"name": "Comida", "color": "#2c3e50"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (3, 'Limpieza', -173, 'expense', false, false, NULL, '', 1, '2025-04-02 00:00:00', '[{"name": "Casa", "color": "#9b59b6"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (4, 'Gasolina', -110, 'expense', false, false, NULL, '', 1, '2025-04-04 00:00:00', '[{"name": "Gasolina", "color": "#d35400"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (5, 'Pal norte', -284, 'expense', false, false, NULL, '', 1, '2025-04-04 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (6, 'Agua ', -50, 'expense', false, false, NULL, '', 1, '2025-04-04 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (7, 'Hot Dog', -125, 'expense', false, false, NULL, '', 1, '2025-04-04 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (8, 'Uber', -50, 'expense', false, false, NULL, '', 1, '2025-04-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (9, 'Uber', -75, 'expense', false, false, NULL, '', 1, '2025-04-04 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (10, 'Gasolina', -900, 'expense', false, false, NULL, '', 1, '2025-04-05 00:00:00', '[{"name": "Gasolina", "color": "#d35400"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (11, 'Chocolate', -62, 'expense', false, false, NULL, '', 1, '2025-04-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (12, 'Bbq', -150, 'expense', false, false, NULL, '', 1, '2025-04-07 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (13, 'Seven', -31, 'expense', false, false, NULL, '', 1, '2025-04-09 00:00:00', '[{"name": "Tiendita", "color": "#20b2aa"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (14, 'Apuesta', -100, 'expense', false, false, NULL, '', 1, '2025-04-09 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (15, 'Cena', -84, 'expense', false, false, NULL, '', 1, '2025-04-09 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (16, 'Cena', -252, 'expense', false, false, NULL, '', 1, '2025-04-10 00:00:00', '[{"name": "Comida", "color": "#2c3e50"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (17, 'Desodorabte', -137, 'expense', false, false, NULL, '', 1, '2025-04-10 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (18, 'Súper salads', -212, 'expense', false, false, NULL, '', 1, '2025-04-11 00:00:00', '[{"name": "Comida", "color": "#2c3e50"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (19, 'Estacionamiento', -65, 'expense', false, false, NULL, '', 1, '2025-04-11 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (20, 'Bbq', -475, 'expense', false, false, NULL, '', 1, '2025-04-12 00:00:00', '[{"name": "Comida", "color": "#2c3e50"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (21, 'Bbq', -125, 'expense', false, false, NULL, '', 1, '2025-04-12 00:00:00', '[{"name": "Comida", "color": "#2c3e50"}]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (22, 'Oxxo', -84, 'expense', false, false, NULL, '', 1, '2025-04-12 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (23, 'General', -359, 'expense', false, false, NULL, '', 1, '2025-04-13 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (24, 'Pal norte', -1251, 'expense', false, false, NULL, '', 1, '2025-04-06 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (25, 'Galleta', -294, 'expense', false, false, NULL, '', 1, '2025-04-15 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (26, 'Subway', -200, 'expense', false, false, NULL, '', 1, '2025-04-16 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (27, 'Subway', -230, 'expense', false, false, NULL, '', 1, '2025-04-17 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (28, 'Kfc', -300, 'expense', false, false, NULL, '', 1, '2025-04-19 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (29, 'Amex', -1333, 'expense', false, false, NULL, '', 1, '2025-04-19 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (30, 'Carne', -390, 'expense', false, false, NULL, '', 1, '2025-04-20 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (31, 'Flores', -640, 'expense', false, false, NULL, '', 1, '2025-04-21 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (32, 'Galleta', -74, 'expense', false, false, NULL, '', 1, '2025-04-21 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (33, 'Bb', -450, 'expense', false, false, NULL, '', 1, '2025-04-22 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (34, 'Gasolina', -250, 'expense', false, false, NULL, '', 1, '2025-04-24 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (35, 'Super', -780, 'expense', false, false, NULL, '', 1, '2025-04-24 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (36, 'Flores', -880, 'expense', false, false, NULL, '', 1, '2025-04-27 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (37, 'Moscos', -550, 'expense', false, false, NULL, '', 1, '2025-04-27 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (38, 'Gasolina', -1174, 'expense', false, false, NULL, '', 1, '2025-04-28 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (39, 'Super', -405, 'expense', false, false, NULL, '', 1, '2025-04-30 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (40, 'Conjunto', -759, 'expense', false, false, NULL, '', 1, '2025-05-02 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (41, 'Starbucks', -101, 'expense', false, false, NULL, '', 1, '2025-05-02 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (42, 'Sushi', -200, 'expense', false, false, NULL, '', 1, '2025-05-03 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (43, 'Cine tacos mi donalds', -326, 'expense', false, false, NULL, '', 1, '2025-05-03 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (44, 'Cesto', -540, 'expense', false, false, NULL, '', 1, '2025-05-03 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (45, 'Escritorio', -2040, 'expense', false, false, NULL, '', 1, '2025-05-03 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (46, 'Seven', -55, 'expense', false, false, NULL, '', 1, '2025-05-04 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (47, 'Super', -290, 'expense', false, false, NULL, '', 1, '2025-05-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (48, 'Madera', -218, 'expense', false, false, NULL, '', 1, '2025-05-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (49, 'Carne', -182, 'expense', false, false, NULL, '', 1, '2025-05-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (50, 'Servciid', -117, 'expense', false, false, NULL, '', 1, '2025-05-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (51, 'Pan', -350, 'expense', false, false, NULL, '', 1, '2025-05-07 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (52, 'Gatos general', -1884, 'expense', false, false, NULL, '', 1, '2025-05-10 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (53, 'Casetas', -120, 'expense', false, false, NULL, '', 1, '2025-05-10 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (54, 'Comida', -300, 'expense', false, false, NULL, '', 1, '2025-05-10 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (55, 'Carne', -310, 'expense', false, false, NULL, '', 1, '2025-05-11 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (56, 'Ff', -189, 'expense', false, false, NULL, '', 1, '2025-05-12 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (57, 'Doctor', -3000, 'expense', false, false, NULL, '', 1, '2025-05-12 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (58, 'Súper ', -500, 'expense', false, false, NULL, '', 1, '2025-05-12 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (59, 'Heb', -177, 'expense', false, false, NULL, '', 1, '2025-05-12 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (60, 'Gasolina', -978, 'expense', false, false, NULL, '', 1, '2025-05-12 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (61, 'Maxichina', -627, 'expense', false, false, NULL, '', 1, '2025-05-12 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (62, 'Doctor', -2700, 'expense', false, false, NULL, '', 1, '2025-05-13 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (63, 'Cel', -100, 'expense', false, false, NULL, '', 1, '2025-05-13 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (64, 'Comida', -306, 'expense', false, false, NULL, '', 1, '2025-05-14 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (65, 'Vomida', -310, 'expense', false, false, NULL, '', 1, '2025-05-15 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (66, 'Galleta', -276, 'expense', false, false, NULL, '', 1, '2025-05-16 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (67, 'Lc', -128, 'expense', false, false, NULL, '', 1, '2025-05-17 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (68, 'Gomitas', -1000, 'expense', false, false, NULL, '', 1, '2025-05-18 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (69, 'Luz', -926, 'expense', false, false, NULL, '', 1, '2025-05-18 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (70, 'Amex', -1200, 'expense', false, false, NULL, '', 1, '2025-05-18 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (71, 'Rol', -300, 'expense', false, false, NULL, '', 1, '2025-05-18 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (72, 'Carne asada', -300, 'expense', false, false, NULL, '', 1, '2025-05-19 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (73, 'Maxi', -211, 'expense', false, false, NULL, '', 1, '2025-05-19 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (74, 'Sb', -176, 'expense', false, false, NULL, '', 1, '2025-05-20 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (75, 'Cena', -138, 'expense', false, false, NULL, '', 1, '2025-05-20 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (76, 'Galletas', -25, 'expense', false, false, NULL, '', 1, '2025-05-21 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (77, 'Flores', -385, 'expense', false, false, NULL, '', 1, '2025-05-21 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (78, 'Cena', -307, 'expense', false, false, NULL, '', 1, '2025-05-21 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (79, 'Casetas', -60, 'expense', false, false, NULL, '', 1, '2025-05-22 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (80, 'Comida', -240, 'expense', false, false, NULL, '', 1, '2025-05-22 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (81, 'Comida', -500, 'expense', false, false, NULL, '', 1, '2025-05-24 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (82, 'Cine', -330, 'expense', false, false, NULL, '', 1, '2025-05-25 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (83, 'Tatemate', -840, 'expense', false, false, NULL, '', 1, '2025-05-25 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (84, 'Super', -514, 'expense', false, false, NULL, '', 1, '2025-05-26 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (85, 'Tacos', -80, 'expense', false, false, NULL, '', 1, '2025-05-28 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (86, 'Gas', -378, 'expense', false, false, NULL, '', 1, '2025-05-29 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (87, 'Rol', -273, 'expense', false, false, NULL, '', 1, '2025-05-31 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (88, 'Leche', -44, 'expense', false, false, NULL, '', 1, '2025-05-31 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (89, 'Maxi', -427, 'expense', false, false, NULL, '', 1, '2025-05-31 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (90, 'Ptu', 1525, 'income', false, false, NULL, '', 1, '2025-05-31 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (91, 'Anti ptu', -1525, 'expense', false, false, NULL, '', 1, '2025-05-31 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (92, 'Apuesta', -200, 'expense', false, false, NULL, '', 1, '2025-05-31 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (93, 'Camisa', -950, 'expense', false, false, NULL, '', 1, '2025-06-01 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (94, 'Ptu', 1526, 'income', false, false, NULL, '', 1, '2025-06-01 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (95, 'Vuelos', -2714, 'expense', false, false, NULL, '', 1, '2025-06-01 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (96, 'Sal', -104, 'expense', false, false, NULL, '', 1, '2025-06-01 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (97, 'Cel', -5584, 'expense', false, false, NULL, '', 1, '2025-06-01 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (98, 'Comida', -523, 'expense', false, false, NULL, '', 1, '2025-06-01 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (99, 'Papas', -115, 'expense', false, false, NULL, '', 1, '2025-06-02 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (100, 'Internet', -220, 'expense', false, false, NULL, '', 1, '2025-06-03 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (101, 'Galleta', 76, 'income', false, false, NULL, '', 1, '2025-06-04 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (102, 'Pf', -520, 'expense', false, false, NULL, '', 1, '2025-06-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (103, 'Galleta', 76, 'income', false, false, NULL, '', 1, '2025-06-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (104, 'Galleta', -150, 'expense', false, false, NULL, '', 1, '2025-06-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (105, 'Flores', 420, 'income', false, false, NULL, '', 1, '2025-06-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (106, 'Flores', -840, 'expense', false, false, NULL, '', 1, '2025-06-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (107, 'Cena', -250, 'expense', false, false, NULL, '', 1, '2025-06-05 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (108, 'Cena', -370, 'expense', false, false, NULL, '', 1, '2025-06-07 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (109, 'Coche', -600, 'expense', false, false, NULL, '', 1, '2025-06-07 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (110, 'Birria', -133, 'expense', false, false, NULL, '', 1, '2025-06-07 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (111, 'Mc', -60, 'expense', false, false, NULL, '', 1, '2025-06-07 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (112, 'Calcetine', -379, 'expense', false, false, NULL, '', 1, '2025-06-07 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (113, 'Agua', -70, 'expense', false, false, NULL, '', 1, '2025-06-07 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (114, 'Comida', -645, 'expense', false, false, NULL, '', 1, '2025-06-08 00:00:00', '[]');
INSERT INTO public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) VALUES (115, 'Computadora', -1058, 'expense', false, false, NULL, '', 1, '2025-06-08 00:00:00', '[]');


--
-- Data for Name: installment_expenses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.installment_expenses (id, user_id, title, amount, is_installment, is_active, num_installments, begin_date, end_date, labels) VALUES (1, 1, 'Reloj', -1400, true, true, 3, '2025-05-15', '2025-07-15', '[]');


--
-- Data for Name: labels; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.labels (id, name, color, user_id) VALUES (1, 'Casa', '#9b59b6', 1);
INSERT INTO public.labels (id, name, color, user_id) VALUES (2, 'Comida', '#2c3e50', 1);
INSERT INTO public.labels (id, name, color, user_id) VALUES (3, 'Entretenimiento', '#7f8c8d', 1);
INSERT INTO public.labels (id, name, color, user_id) VALUES (4, 'Trabajo', '#16a085', 1);
INSERT INTO public.labels (id, name, color, user_id) VALUES (5, 'Gasolina', '#d35400', 1);
INSERT INTO public.labels (id, name, color, user_id) VALUES (6, 'Tiendita', '#20b2aa', 1);


--
-- Data for Name: recurring_expenses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.recurring_expenses (id, user_id, title, amount, is_recurring, is_active, created_at, labels) VALUES (1, 1, 'Salario', 35000, true, true, '2025-04-04 07:26:02.671183', '[]');
INSERT INTO public.recurring_expenses (id, user_id, title, amount, is_recurring, is_active, created_at, labels) VALUES (2, 1, 'Renta', -6750, true, true, '2025-04-04 07:26:15.374894', '[]');
INSERT INTO public.recurring_expenses (id, user_id, title, amount, is_recurring, is_active, created_at, labels) VALUES (3, 1, 'meli+', -179, true, true, '2025-04-04 07:30:08.535202', '[{"name": "Entretenimiento", "color": "#7f8c8d"}]');
INSERT INTO public.recurring_expenses (id, user_id, title, amount, is_recurring, is_active, created_at, labels) VALUES (4, 1, 'ChatGPT', -400, true, true, '2025-04-04 07:31:31.256276', '[{"name": "Trabajo", "color": "#16a085"}]');
INSERT INTO public.recurring_expenses (id, user_id, title, amount, is_recurring, is_active, created_at, labels) VALUES (5, 1, 'Internet', -222, true, true, '2025-04-17 19:27:16.003175', '[]');
INSERT INTO public.recurring_expenses (id, user_id, title, amount, is_recurring, is_active, created_at, labels) VALUES (6, 1, 'Windsurf', -300, true, true, '2025-05-11 15:36:42.375603', '[]');
INSERT INTO public.recurring_expenses (id, user_id, title, amount, is_recurring, is_active, created_at, labels) VALUES (7, 1, 'Gampass', -179, true, true, '2025-05-17 07:28:01.664438', '[]');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, email, name, password, is_verified, verification_token) VALUES (1, 'andres.roblesgilcandas@gmail.com', 'Andres', '$2b$12$Uiz/5vqYeb1p6FuX7jfwbOi3vuPIrf.ivu075e2UBr3pcgVGNRPjm', true, NULL);
INSERT INTO public.users (id, email, name, password, is_verified, verification_token) VALUES (2, 'A01704315@tec.mx', 'Andres', '$2b$12$7ZxVZgZHo6HC04Xf0C61e.pLGi8OH4gxcx8GPwcmkLXZ1.1YfGY7a', true, NULL);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.expenses_id_seq', 115, true);


--
-- Name: installment_expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.installment_expenses_id_seq', 1, true);


--
-- Name: labels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.labels_id_seq', 6, true);


--
-- Name: recurring_expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recurring_expenses_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: installment_expenses installment_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.installment_expenses
    ADD CONSTRAINT installment_expenses_pkey PRIMARY KEY (id);


--
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- Name: recurring_expenses recurring_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recurring_expenses
    ADD CONSTRAINT recurring_expenses_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_expense_installment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_expense_installment ON public.expenses USING btree (is_installment);


--
-- Name: idx_expense_recurring; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_expense_recurring ON public.expenses USING btree (is_recurring);


--
-- Name: idx_expense_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_expense_type ON public.expenses USING btree (type);


--
-- Name: idx_expense_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_expense_user_date ON public.expenses USING btree (user_id, date);


--
-- Name: idx_installment_dates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_installment_dates ON public.installment_expenses USING btree (begin_date, end_date);


--
-- Name: idx_installment_user_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_installment_user_active ON public.installment_expenses USING btree (user_id, is_active);


--
-- Name: idx_label_user_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_label_user_name ON public.labels USING btree (user_id, name);


--
-- Name: idx_recurring_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recurring_created ON public.recurring_expenses USING btree (created_at);


--
-- Name: idx_recurring_user_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recurring_user_active ON public.recurring_expenses USING btree (user_id, is_active);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_user_email ON public.users USING btree (email);


--
-- Name: ix_expenses_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_expenses_id ON public.expenses USING btree (id);


--
-- Name: ix_installment_expenses_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_installment_expenses_id ON public.installment_expenses USING btree (id);


--
-- Name: ix_labels_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_labels_id ON public.labels USING btree (id);


--
-- Name: ix_recurring_expenses_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_recurring_expenses_id ON public.recurring_expenses USING btree (id);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: expenses expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: installment_expenses installment_expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.installment_expenses
    ADD CONSTRAINT installment_expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: labels labels_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: recurring_expenses recurring_expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recurring_expenses
    ADD CONSTRAINT recurring_expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

