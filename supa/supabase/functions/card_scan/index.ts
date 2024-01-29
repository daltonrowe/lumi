import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.1";
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
    const { code, team, cardId } = await req.json();

    const { data: selectData, error: selectError } = await supabaseAdmin
      .from("nodes_v1")
      .select("code,id,game")
      .eq("code", code);

    if (selectError) throw selectError;

    // node was found, updated is last alive time

    if (
      selectData.length === 1 &&
      selectData[0].game &&
      typeof cardId === "string"
    ) {
      const { data: insertData, error: insertError } = await supabaseAdmin
        .from("scans_v1")
        .insert({
          team,
          card_id: cardId,
          node_code: code,
          game: selectData[0].game,
        })
        .select();

      if (insertError) throw insertError;

      return new Response(JSON.stringify(insertData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      throw new Error("Node not found.");
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
