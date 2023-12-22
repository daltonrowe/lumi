const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.API_URL, process.env.API_KEY);

async function api(endpoint, body) {
  const { data, error } = await supabase.functions.invoke(endpoint, {
    body,
  });

  if (error) console.log(error);

  return data;
}

module.exports = {
  api,
};
