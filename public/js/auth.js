function toggleForm() {
  document.getElementById('loginBox').classList.toggle('hidden');
  document.getElementById('registerBox').classList.toggle('hidden');
}

async function register() {
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const errorEl = document.getElementById('registerError');

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || 'เกิดข้อผิดพลาด';
      return;
    }

    alert('สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ');
    toggleForm();
  } catch (err) {
    errorEl.textContent = 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้';
  }
}

async function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || 'เกิดข้อผิดพลาด';
      return;
    }

    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard.html';
  } catch (err) {
    errorEl.textContent = 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้';
  }
}