import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { Database } from "../_shared/database.types.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAdmin = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    const { code } = await req.json();

    const { data: selectData, error: selectError } = await supabaseAdmin
      .from("nodes_v1")
      .select("code,id")
      .eq("code", code);

    if (selectError) throw selectError;

    // node was found, updated is last alive time

    if (selectData.length >= 1) {
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from("nodes_v1")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectData[0].id)
        .select();

      if (updateError) throw updateError;

      return new Response(JSON.stringify(updateData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // node was not found, create it

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("nodes_v1")
      .insert({ code })
      .select();

    if (insertError) throw insertError;

    return new Response(JSON.stringify(insertData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
