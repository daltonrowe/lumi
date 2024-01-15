alter table "public"."scans_v1" drop column "tag";

alter table "public"."scans_v1" add column "cardId" character varying not null;

create policy "Enable insert for authenticated users only"
on "public"."nodes_v1"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable select for authenticated users only"
on "public"."nodes_v1"
as permissive
for select
to authenticated
using (true);



