alter table "public"."scans_v1" add column "team" text not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.view_game_v1(game_id bigint)
 RETURNS TABLE(id bigint, team text, card_id text, node_code character varying, created_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
   RETURN QUERY
   SELECT DISTINCT ON (scans_v1.node_code)
    scans_v1.id,
    scans_v1.team,
    scans_v1.card_id,
    scans_v1.node_code,
    scans_v1.created_at
   FROM scans_v1
   WHERE game = game_id
   ORDER BY scans_v1.node_code, scans_v1.created_at DESC;
END
$function$
;

create policy "Enable select for authenticated users only"
on "public"."scans_v1"
as permissive
for select
to authenticated
using (true);



