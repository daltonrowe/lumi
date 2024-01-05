// Replace values on input elements

const storageHookInputs = document.querySelectorAll("input[data-storage-hook]");

console.log(storageHookInputs);

storageHookInputs.forEach((el) => {
  const hook = el.dataset.storageHook;
  console.log(hook);

  const value = localStorage.getItem(hook);
  if (!value) return;

  el.value = value;
});

// Set values from inputs

const storageHookSetters = document.querySelectorAll(
  'button[data-storage-action="set"]'
);

function handleSet(event) {
  const { target } = event;
  const hook = target.dataset.storageHook;

  const input = document.querySelector(`input[data-storage-hook="${hook}"]`);
  const { value } = input;

  console.log("set", hook, value);
  localStorage.setItem(hook, value);
}

storageHookSetters.forEach((el) => {
  el.addEventListener("click", handleSet);
});

// Delete and reset values

const storageHookResetters = document.querySelectorAll(
  'button[data-storage-action="reset"]'
);

function handleReset(event) {
  const { target } = event;
  const hook = target.dataset.storageHook;

  console.log("reset", hook);
  localStorage.remove(hook);
}

storageHookResetters.forEach((el) => {
  el.addEventListener("click", handleReset);
});
