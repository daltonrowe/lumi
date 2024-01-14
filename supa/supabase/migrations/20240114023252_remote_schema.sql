drop policy "Enable select for records belonging to user" on "public"."games_v1";

alter table "public"."games_v1" alter column "owner" set not null;

create policy "Enable select for record owner"
on "public"."games_v1"
as permissive
for select
to authenticated
using ((auth.uid() = owner));


create policy "Enable update for record owner"
on "public"."games_v1"
as permissive
for update
to public
using ((auth.uid() = owner))
with check ((auth.uid() = owner));



