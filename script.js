const scriptURL = 'https://script.google.com/macros/s/AKfycbyjrmYpC4pKwe8EhI01Q-I019C5t94kCatwi9ahvHaReIw1p3CjOWEFi8VCtk4Yc_h0Ag/exec';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const hash = await hashPassword(password);

  const body = new URLSearchParams({
    mode: 'signup',
    name: name,
    email: email,
    password: hash,
  });

  const res = await fetch(scriptURL, { method: 'POST', body });
  const result = await res.text();
  document.getElementById('message').innerText = result;
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const hash = await hashPassword(password);

  const res = await fetch(`${scriptURL}?mode=login&email=${encodeURIComponent(email)}&password=${hash}`);
  const result = await res.text();
  document.getElementById('message').innerText = result;
});
console.log("Submitting...");