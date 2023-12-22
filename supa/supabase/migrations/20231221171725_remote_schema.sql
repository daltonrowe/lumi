
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

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."games_v1" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "desc" character varying DEFAULT ''::character varying NOT NULL,
    "name" character varying DEFAULT ''::character varying NOT NULL,
    "owner" "uuid",
    "enabled" boolean DEFAULT false
);

ALTER TABLE "public"."games_v1" OWNER TO "postgres";

ALTER TABLE "public"."games_v1" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."games_v1_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."nodes_v1" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "game" bigint,
    "version" bigint DEFAULT '0'::bigint NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL,
    "code" character varying DEFAULT ''::character varying NOT NULL
);

ALTER TABLE "public"."nodes_v1" OWNER TO "postgres";

ALTER TABLE "public"."nodes_v1" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."nodes_v1_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."scans_v1" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tag" character varying NOT NULL,
    "game" bigint,
    "node_code" character varying DEFAULT ''::character varying NOT NULL
);

ALTER TABLE "public"."scans_v1" OWNER TO "postgres";

ALTER TABLE "public"."scans_v1" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."scans_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."games_v1"
    ADD CONSTRAINT "games_v1_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."nodes_v1"
    ADD CONSTRAINT "nodes_v1_code_key" UNIQUE ("code");

ALTER TABLE ONLY "public"."nodes_v1"
    ADD CONSTRAINT "nodes_v1_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."scans_v1"
    ADD CONSTRAINT "scans_pkey" PRIMARY KEY ("id");

CREATE INDEX "games_v1_enabled_idx" ON "public"."games_v1" USING "btree" ("enabled");

CREATE INDEX "games_v1_owner_idx" ON "public"."games_v1" USING "btree" ("owner");

CREATE INDEX "nodes_v1_game_enabled_idx" ON "public"."nodes_v1" USING "btree" ("game", "enabled");

ALTER TABLE ONLY "public"."games_v1"
    ADD CONSTRAINT "games_v1_owner_fkey" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."nodes_v1"
    ADD CONSTRAINT "nodes_v1_game_fkey" FOREIGN KEY ("game") REFERENCES "public"."games_v1"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."scans_v1"
    ADD CONSTRAINT "scans_v1_game_fkey" FOREIGN KEY ("game") REFERENCES "public"."games_v1"("id");

ALTER TABLE ONLY "public"."scans_v1"
    ADD CONSTRAINT "scans_v1_node_code_fkey" FOREIGN KEY ("node_code") REFERENCES "public"."nodes_v1"("code") ON DELETE RESTRICT;

ALTER TABLE "public"."games_v1" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."nodes_v1" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."scans_v1" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."games_v1" TO "anon";
GRANT ALL ON TABLE "public"."games_v1" TO "authenticated";
GRANT ALL ON TABLE "public"."games_v1" TO "service_role";

GRANT ALL ON SEQUENCE "public"."games_v1_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."games_v1_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."games_v1_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."nodes_v1" TO "anon";
GRANT ALL ON TABLE "public"."nodes_v1" TO "authenticated";
GRANT ALL ON TABLE "public"."nodes_v1" TO "service_role";

GRANT ALL ON SEQUENCE "public"."nodes_v1_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."nodes_v1_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."nodes_v1_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."scans_v1" TO "anon";
GRANT ALL ON TABLE "public"."scans_v1" TO "authenticated";
GRANT ALL ON TABLE "public"."scans_v1" TO "service_role";

GRANT ALL ON SEQUENCE "public"."scans_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."scans_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."scans_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;