alter table "public"."games_v1" alter column "owner" set default auth.uid();

create policy "Enable insert for authenticated users only"
on "public"."games_v1"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for records belonging to user"
on "public"."games_v1"
as permissive
for select
to authenticated
using ((auth.uid() = owner));



