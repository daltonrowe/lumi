alter table "public"."scans_v1" drop column "cardId";

alter table "public"."scans_v1" add column "card_id" text not null;


