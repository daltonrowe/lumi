const Cookies = window.Cookies;

// Replace values on input elements

const cookieHookInputs = document.querySelector("input[data-cookie-hook]");

Array(cookieHookInputs).forEach((el) => {
  if (!el) return;

  const hook = el.dataset.cookieHook;
  const value = Cookies.get(hook);
  if (!value) return;

  el.value = value;
});

// Set values from inputs

const cookieHookSetters = document.querySelector(
  'button[data-cookie-action="set"]'
);

function handleSet(event) {
  const { target } = event;
  const hook = target.dataset.cookieHook;

  const input = document.querySelector(`input[data-cookie-action="${hook}"]`);
  const { value } = input;

  Cookies.set(hook, value);
}

Array(cookieHookSetters).forEach((el) => {
  if (!el) return;

  el.addEventListener("click", handleSet);
});

// Delete and reset values

const cookieHookResetters = document.querySelector(
  'button[data-cookie-action="reset"]'
);

function handleReset(event) {
  const { target } = event;
  const hook = target.dataset.cookieHook;

  Cookies.remove(hook);
}

Array(cookieHookResetters).forEach((el) => {
  if (!el) return;

  el.addEventListener("click", handleReset);
});
