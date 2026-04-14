import { supabase } from "@/lib/supabase";

export async function signUp(name: string, email: string, password: string) {
  const res = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });
  return res;
}

export async function signIn(email: string, password: string) {
  const res = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return res;
}

export async function signOut() {
  const res = await supabase.auth.signOut();
  return res;
}   

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}