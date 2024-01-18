import { createClient } from "@supabase/supabase-js";

const supabaseURL = import.meta.env.VITE_SUPERBASE_URL;
const supabaseKey = import.meta.env.VITE_SUPERBASE_KEY;

if (supabaseURL === undefined || supabaseKey === undefined) {
    throw new Error("Env Variables not defined")
}
const supabase = createClient(supabaseURL, supabaseKey);

export default supabase