const Cookies = window.Cookies;

// Replace values on input elements

const cookieHookInputs = document.querySelectorAll("input[data-cookie-hook]");

console.log(cookieHookInputs);

cookieHookInputs.forEach((el) => {
  const hook = el.dataset.cookieHook;
  console.log(hook);

  const value = Cookies.get(hook);
  if (!value) return;

  el.value = value;
});

// Set values from inputs

const cookieHookSetters = document.querySelectorAll(
  'button[data-cookie-action="set"]'
);

function handleSet(event) {
  const { target } = event;
  const hook = target.dataset.cookieHook;

  const input = document.querySelector(`input[data-cookie-hook="${hook}"]`);
  const { value } = input;

  console.log("set", hook, value);
  Cookies.set(hook, value);
}

cookieHookSetters.forEach((el) => {
  el.addEventListener("click", handleSet);
});

// Delete and reset values

const cookieHookResetters = document.querySelectorAll(
  'button[data-cookie-action="reset"]'
);

function handleReset(event) {
  const { target } = event;
  const hook = target.dataset.cookieHook;

  console.log("reset", hook);
  Cookies.remove(hook);
}

cookieHookResetters.forEach((el) => {
  el.addEventListener("click", handleReset);
});
