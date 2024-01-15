const ANON_KEY = localStorage.getItem("anon_key");
const API_HOST = localStorage.getItem("api_host");

const { createClient } = window.supabase;

const supabase = createClient(API_HOST, ANON_KEY);

const signUpButton = document.querySelector("#signup-submit");
const signUpEmailInput = document.querySelector("#signup-email");
const signUpPasswordInput = document.querySelector("#signup-password");

signUpButton.addEventListener("click", async (event) => {
  const { data, error } = await supabase.auth.signUp({
    email: signUpEmailInput.value,
    password: signUpPasswordInput.value,
  });

  console.log(data, error);
});

const logInButton = document.querySelector("#login-submit");
const logInEmailInput = document.querySelector("#login-email");
const logInPasswordInput = document.querySelector("#login-password");

logInButton.addEventListener("click", async (event) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: logInEmailInput.value,
    password: logInPasswordInput.value,
  });

  console.log(data, error);
});
