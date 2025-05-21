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
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO "user";

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: user
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


ALTER TABLE public.expenses OWNER TO "user";

--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.expenses_id_seq OWNER TO "user";

--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.expenses_id_seq OWNED BY public.expenses.id;


--
-- Name: installment_expenses; Type: TABLE; Schema: public; Owner: user
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


ALTER TABLE public.installment_expenses OWNER TO "user";

--
-- Name: installment_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.installment_expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.installment_expenses_id_seq OWNER TO "user";

--
-- Name: installment_expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.installment_expenses_id_seq OWNED BY public.installment_expenses.id;


--
-- Name: labels; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.labels (
    id integer NOT NULL,
    name character varying NOT NULL,
    color character varying NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.labels OWNER TO "user";

--
-- Name: labels_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.labels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.labels_id_seq OWNER TO "user";

--
-- Name: labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.labels_id_seq OWNED BY public.labels.id;


--
-- Name: recurring_expenses; Type: TABLE; Schema: public; Owner: user
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


ALTER TABLE public.recurring_expenses OWNER TO "user";

--
-- Name: recurring_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.recurring_expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recurring_expenses_id_seq OWNER TO "user";

--
-- Name: recurring_expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.recurring_expenses_id_seq OWNED BY public.recurring_expenses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    password character varying(255) NOT NULL,
    is_verified boolean NOT NULL,
    verification_token character varying(255)
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: expenses id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.expenses ALTER COLUMN id SET DEFAULT nextval('public.expenses_id_seq'::regclass);


--
-- Name: installment_expenses id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.installment_expenses ALTER COLUMN id SET DEFAULT nextval('public.installment_expenses_id_seq'::regclass);


--
-- Name: labels id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.labels ALTER COLUMN id SET DEFAULT nextval('public.labels_id_seq'::regclass);


--
-- Name: recurring_expenses id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.recurring_expenses ALTER COLUMN id SET DEFAULT nextval('public.recurring_expenses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.alembic_version (version_num) FROM stdin;
780bf4ebd955
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.expenses (id, title, amount, type, is_recurring, is_installment, num_installments, notes, user_id, date, labels) FROM stdin;
1	Servicios	-111	expense	f	f	\N		1	2025-04-02 00:00:00	[{"name": "Casa", "color": "#9b59b6"}]
2	Kebab	-245	expense	f	f	\N		1	2025-04-03 00:00:00	[{"name": "Comida", "color": "#2c3e50"}]
3	Limpieza	-173	expense	f	f	\N		1	2025-04-02 00:00:00	[{"name": "Casa", "color": "#9b59b6"}]
4	Gasolina	-110	expense	f	f	\N		1	2025-04-04 00:00:00	[{"name": "Gasolina", "color": "#d35400"}]
5	Pal norte	-284	expense	f	f	\N		1	2025-04-04 00:00:00	[]
6	Agua 	-50	expense	f	f	\N		1	2025-04-04 00:00:00	[]
7	Hot Dog	-125	expense	f	f	\N		1	2025-04-04 00:00:00	[]
8	Uber	-50	expense	f	f	\N		1	2025-04-05 00:00:00	[]
9	Uber	-75	expense	f	f	\N		1	2025-04-04 00:00:00	[]
10	Gasolina	-900	expense	f	f	\N		1	2025-04-05 00:00:00	[{"name": "Gasolina", "color": "#d35400"}]
11	Chocolate	-62	expense	f	f	\N		1	2025-04-05 00:00:00	[]
12	Bbq	-150	expense	f	f	\N		1	2025-04-07 00:00:00	[]
13	Seven	-31	expense	f	f	\N		1	2025-04-09 00:00:00	[{"name": "Tiendita", "color": "#20b2aa"}]
14	Apuesta	-100	expense	f	f	\N		1	2025-04-09 00:00:00	[]
15	Cena	-84	expense	f	f	\N		1	2025-04-09 00:00:00	[]
16	Cena	-252	expense	f	f	\N		1	2025-04-10 00:00:00	[{"name": "Comida", "color": "#2c3e50"}]
17	Desodorabte	-137	expense	f	f	\N		1	2025-04-10 00:00:00	[]
18	Súper salads	-212	expense	f	f	\N		1	2025-04-11 00:00:00	[{"name": "Comida", "color": "#2c3e50"}]
19	Estacionamiento	-65	expense	f	f	\N		1	2025-04-11 00:00:00	[]
20	Bbq	-475	expense	f	f	\N		1	2025-04-12 00:00:00	[{"name": "Comida", "color": "#2c3e50"}]
21	Bbq	-125	expense	f	f	\N		1	2025-04-12 00:00:00	[{"name": "Comida", "color": "#2c3e50"}]
22	Oxxo	-84	expense	f	f	\N		1	2025-04-12 00:00:00	[]
23	General	-359	expense	f	f	\N		1	2025-04-13 00:00:00	[]
24	Pal norte	-1251	expense	f	f	\N		1	2025-04-06 00:00:00	[]
25	Galleta	-294	expense	f	f	\N		1	2025-04-15 00:00:00	[]
26	Subway	-200	expense	f	f	\N		1	2025-04-16 00:00:00	[]
27	Subway	-230	expense	f	f	\N		1	2025-04-17 00:00:00	[]
28	Kfc	-300	expense	f	f	\N		1	2025-04-19 00:00:00	[]
29	Amex	-1333	expense	f	f	\N		1	2025-04-19 00:00:00	[]
30	Carne	-390	expense	f	f	\N		1	2025-04-20 00:00:00	[]
31	Flores	-640	expense	f	f	\N		1	2025-04-21 00:00:00	[]
32	Galleta	-74	expense	f	f	\N		1	2025-04-21 00:00:00	[]
33	Bb	-450	expense	f	f	\N		1	2025-04-22 00:00:00	[]
34	Gasolina	-250	expense	f	f	\N		1	2025-04-24 00:00:00	[]
35	Super	-780	expense	f	f	\N		1	2025-04-24 00:00:00	[]
36	Flores	-880	expense	f	f	\N		1	2025-04-27 00:00:00	[]
37	Moscos	-550	expense	f	f	\N		1	2025-04-27 00:00:00	[]
38	Gasolina	-1174	expense	f	f	\N		1	2025-04-28 00:00:00	[]
39	Super	-405	expense	f	f	\N		1	2025-04-30 00:00:00	[]
40	Conjunto	-759	expense	f	f	\N		1	2025-05-02 00:00:00	[]
41	Starbucks	-101	expense	f	f	\N		1	2025-05-02 00:00:00	[]
42	Sushi	-200	expense	f	f	\N		1	2025-05-03 00:00:00	[]
43	Cine tacos mi donalds	-326	expense	f	f	\N		1	2025-05-03 00:00:00	[]
44	Cesto	-540	expense	f	f	\N		1	2025-05-03 00:00:00	[]
45	Escritorio	-2040	expense	f	f	\N		1	2025-05-03 00:00:00	[]
46	Seven	-55	expense	f	f	\N		1	2025-05-04 00:00:00	[]
47	Super	-290	expense	f	f	\N		1	2025-05-05 00:00:00	[]
48	Madera	-218	expense	f	f	\N		1	2025-05-05 00:00:00	[]
49	Carne	-182	expense	f	f	\N		1	2025-05-05 00:00:00	[]
50	Servciid	-117	expense	f	f	\N		1	2025-05-05 00:00:00	[]
51	Pan	-350	expense	f	f	\N		1	2025-05-07 00:00:00	[]
52	Gatos general	-1884	expense	f	f	\N		1	2025-05-10 00:00:00	[]
53	Casetas	-120	expense	f	f	\N		1	2025-05-10 00:00:00	[]
54	Comida	-300	expense	f	f	\N		1	2025-05-10 00:00:00	[]
55	Carne	-310	expense	f	f	\N		1	2025-05-11 00:00:00	[]
56	Ff	-189	expense	f	f	\N		1	2025-05-12 00:00:00	[]
57	Doctor	-3000	expense	f	f	\N		1	2025-05-12 00:00:00	[]
58	Súper 	-500	expense	f	f	\N		1	2025-05-12 00:00:00	[]
59	Heb	-177	expense	f	f	\N		1	2025-05-12 00:00:00	[]
60	Gasolina	-978	expense	f	f	\N		1	2025-05-12 00:00:00	[]
61	Maxichina	-627	expense	f	f	\N		1	2025-05-12 00:00:00	[]
62	Doctor	-2700	expense	f	f	\N		1	2025-05-13 00:00:00	[]
63	Cel	-100	expense	f	f	\N		1	2025-05-13 00:00:00	[]
64	Comida	-306	expense	f	f	\N		1	2025-05-14 00:00:00	[]
65	Vomida	-310	expense	f	f	\N		1	2025-05-15 00:00:00	[]
66	Galleta	-276	expense	f	f	\N		1	2025-05-16 00:00:00	[]
67	Lc	-128	expense	f	f	\N		1	2025-05-17 00:00:00	[]
68	Gomitas	-1000	expense	f	f	\N		1	2025-05-18 00:00:00	[]
69	Luz	-926	expense	f	f	\N		1	2025-05-18 00:00:00	[]
70	Amex	-1200	expense	f	f	\N		1	2025-05-18 00:00:00	[]
71	Rol	-300	expense	f	f	\N		1	2025-05-18 00:00:00	[]
72	Carne asada	-300	expense	f	f	\N		1	2025-05-19 00:00:00	[]
73	Maxi	-211	expense	f	f	\N		1	2025-05-19 00:00:00	[]
74	Sb	-176	expense	f	f	\N		1	2025-05-20 00:00:00	[]
\.


--
-- Data for Name: installment_expenses; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.installment_expenses (id, user_id, title, amount, is_installment, is_active, num_installments, begin_date, end_date, labels) FROM stdin;
1	1	Reloj	-1400	t	t	3	2025-05-15	2025-07-15	[]
\.


--
-- Data for Name: labels; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.labels (id, name, color, user_id) FROM stdin;
1	Casa	#9b59b6	1
2	Comida	#2c3e50	1
3	Entretenimiento	#7f8c8d	1
4	Trabajo	#16a085	1
5	Gasolina	#d35400	1
6	Tiendita	#20b2aa	1
\.


--
-- Data for Name: recurring_expenses; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.recurring_expenses (id, user_id, title, amount, is_recurring, is_active, created_at, labels) FROM stdin;
1	1	Salario	35000	t	t	2025-04-04 07:26:02.671183	[]
2	1	Renta	-6750	t	t	2025-04-04 07:26:15.374894	[]
3	1	meli+	-179	t	t	2025-04-04 07:30:08.535202	[{"name": "Entretenimiento", "color": "#7f8c8d"}]
4	1	ChatGPT	-400	t	t	2025-04-04 07:31:31.256276	[{"name": "Trabajo", "color": "#16a085"}]
5	1	Internet	-222	t	t	2025-04-17 19:27:16.003175	[]
6	1	Windsurf	-300	t	t	2025-05-11 15:36:42.375603	[]
7	1	Gampass	-179	t	t	2025-05-17 07:28:01.664438	[]
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, email, name, password, is_verified, verification_token) FROM stdin;
1	andres.roblesgilcandas@gmail.com	Andres	$2b$12$Uiz/5vqYeb1p6FuX7jfwbOi3vuPIrf.ivu075e2UBr3pcgVGNRPjm	t	\N
2	A01704315@tec.mx	Andres	$2b$12$7ZxVZgZHo6HC04Xf0C61e.pLGi8OH4gxcx8GPwcmkLXZ1.1YfGY7a	t	\N
\.


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.expenses_id_seq', 74, true);


--
-- Name: installment_expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.installment_expenses_id_seq', 1, true);


--
-- Name: labels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.labels_id_seq', 6, true);


--
-- Name: recurring_expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.recurring_expenses_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: installment_expenses installment_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.installment_expenses
    ADD CONSTRAINT installment_expenses_pkey PRIMARY KEY (id);


--
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- Name: recurring_expenses recurring_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.recurring_expenses
    ADD CONSTRAINT recurring_expenses_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_expense_installment; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_expense_installment ON public.expenses USING btree (is_installment);


--
-- Name: idx_expense_recurring; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_expense_recurring ON public.expenses USING btree (is_recurring);


--
-- Name: idx_expense_type; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_expense_type ON public.expenses USING btree (type);


--
-- Name: idx_expense_user_date; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_expense_user_date ON public.expenses USING btree (user_id, date);


--
-- Name: idx_installment_dates; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_installment_dates ON public.installment_expenses USING btree (begin_date, end_date);


--
-- Name: idx_installment_user_active; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_installment_user_active ON public.installment_expenses USING btree (user_id, is_active);


--
-- Name: idx_label_user_name; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_label_user_name ON public.labels USING btree (user_id, name);


--
-- Name: idx_recurring_created; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_recurring_created ON public.recurring_expenses USING btree (created_at);


--
-- Name: idx_recurring_user_active; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_recurring_user_active ON public.recurring_expenses USING btree (user_id, is_active);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX idx_user_email ON public.users USING btree (email);


--
-- Name: ix_expenses_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_expenses_id ON public.expenses USING btree (id);


--
-- Name: ix_installment_expenses_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_installment_expenses_id ON public.installment_expenses USING btree (id);


--
-- Name: ix_labels_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_labels_id ON public.labels USING btree (id);


--
-- Name: ix_recurring_expenses_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_recurring_expenses_id ON public.recurring_expenses USING btree (id);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: expenses expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: installment_expenses installment_expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.installment_expenses
    ADD CONSTRAINT installment_expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: labels labels_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: recurring_expenses recurring_expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.recurring_expenses
    ADD CONSTRAINT recurring_expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

