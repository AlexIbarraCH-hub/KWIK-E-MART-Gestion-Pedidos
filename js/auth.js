/* =========================================================
   CONTROL DE SESIÓN, ROLES Y NAVEGACIÓN (RIU 1, 2, 3, 8, 9, 10)
   ========================================================= */

const ROLE_MENUS = {
  admin: [
    { label: 'Home', href: 'index.html' },
    { label: 'Productos', href: 'productos.html' },
    { label: 'Procesamiento de Pedidos', href: 'procesamiento.html' }
  ],
  user: [
    { label: 'Home', href: 'index.html' },
    { label: 'Pedidos', href: 'pedidos.html' },
    { label: 'Pedidos Ingresados', href: 'pedidos-ingresados.html' }
  ]
};

function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  return page === '' ? 'index.html' : page;
}

// RIU 10: Guardián estricto de rutas por perfil
function enforceRouteGuard() {
  const session = getSession();
  const currentPage = getCurrentPage();

  if (!session && currentPage !== 'index.html') {
    window.location.replace('index.html');
    return null;
  }

  if (session) {
    const allowedPages = ROLE_MENUS[session.role].map(item => item.href);
    if (!allowedPages.includes(currentPage)) {
      alert('Acceso denegado: Su perfil no tiene permisos para acceder a esta vista.');
      window.location.replace('index.html');
      return null;
    }
  }

  return session;
}

// Renderizar HEAD y FOOT según estado de sesión (Mockups 01, 02, 03)
function renderNavigation(session) {
  const navStrip = document.getElementById('nav-strip');
  const navBar = document.getElementById('main-nav');
  const footerNav = document.getElementById('footer-nav');
  const headerActions = document.getElementById('header-actions');
  const userStatus = document.getElementById('user-status');
  const btnLogout = document.getElementById('btn-logout');
  const currentPage = getCurrentPage();

  if (!navBar || !footerNav) return;

  if (!session) {
    // Vista pública Login (Mockup 01): sin menú en HEAD, sin botón Cerrar sesión, FOOT solo con Home
    if (navStrip) navStrip.classList.add('hidden');
    if (headerActions) headerActions.classList.add('hidden');
    footerNav.innerHTML = `<li><a href="index.html">Home</a></li>`;
    return;
  }

  // Vista autenticada (Mockups 02 y 03)
  if (navStrip) navStrip.classList.remove('hidden');
  if (headerActions) headerActions.classList.remove('hidden');

  const roleLabel = session.role === 'admin' ? 'Administrador' : 'Usuario';
  if (userStatus) {
    userStatus.textContent = `${session.fullName} · ${roleLabel}`;
  }

  if (btnLogout) {
    btnLogout.onclick = () => {
      clearSession();
      window.location.href = 'index.html';
    };
  }

  const menuItems = ROLE_MENUS[session.role] || [];
  navBar.innerHTML = menuItems.map(item => {
    const activeClass = item.href === currentPage ? 'active' : '';
    return `<a href="${item.href}" class="nav-link ${activeClass}">${item.label}</a>`;
  }).join('');

  footerNav.innerHTML = menuItems.map(item => {
    return `<li><a href="${item.href}">${item.label}</a></li>`;
  }).join('');
}

function showModal(modalId, messageText = null) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  if (messageText) {
    const bodyEl = modal.querySelector('.modal-body');
    if (bodyEl) bodyEl.textContent = messageText;
  }
  modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

// Lógica de index.html: Login (RIU 2) y Dashboard con tarjetas (RIU 3)
function initHomePage(session) {
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  if (!loginSection || !dashboardSection) return;

  if (session) {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');

    const isAdmin = session.role === 'admin';
    document.getElementById('role-banner-label').textContent =
      isAdmin ? 'PERFIL ADMINISTRADOR' : 'PERFIL USUARIO';
    document.getElementById('welcome-message').textContent =
      `Bienvenido ${session.fullName}`;

    // Dos tarjetas de acceso rápido (Mockups 02 y 03)
    const quickCardsContainer = document.getElementById('quick-cards');
    const quickViews = isAdmin
      ? [
          { title: 'Productos', href: 'productos.html' },
          { title: 'Procesamiento de Pedidos', href: 'procesamiento.html' }
        ]
      : [
          { title: 'Pedidos', href: 'pedidos.html' },
          { title: 'Pedidos Ingresados', href: 'pedidos-ingresados.html' }
        ];

    quickCardsContainer.innerHTML = quickViews.map(view => `
      <a href="${view.href}" class="quick-card">
        <h3>${view.title}</h3>
        <span class="quick-card-link">Abrir &rarr;</span>
      </a>
    `).join('');
  } else {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');

    const loginForm = document.getElementById('login-form');
    const inlineAlert = document.getElementById('login-alert');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      inlineAlert.classList.add('hidden');

      const usernameInput = document.getElementById('login-username').value.trim();
      const passwordInput = document.getElementById('login-password').value;

      const users = getUsers();
      const userIndex = users.findIndex(u => u.username === usernameInput);

      // Usuario inexistente (RIU 2)
      if (userIndex === -1) {
        inlineAlert.textContent = 'El usuario no existe.';
        inlineAlert.classList.remove('hidden');
        return;
      }

      const user = users[userIndex];

      if (user.locked) {
        showModal('modal-lock', 'Cuenta bloqueada por intentos fallidos. Contacte al administrador.');
        return;
      }

      if (user.password === passwordInput) {
        user.failedAttempts = 0;
        saveUsers(users);
        setSession(user);
        window.location.reload();
        return;
      }

      // Contraseña incorrecta: bloqueo al 3er intento (RIU 2)
      user.failedAttempts += 1;
      if (user.failedAttempts >= 3) {
        user.locked = true;
        saveUsers(users);
        showModal('modal-lock', 'Cuenta bloqueada por intentos fallidos. Contacte al administrador.');
      } else {
        saveUsers(users);
        inlineAlert.textContent = `Credenciales incorrectas. Intento ${user.failedAttempts} de 3.`;
        inlineAlert.classList.remove('hidden');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const session = enforceRouteGuard();
  renderNavigation(session);
  initHomePage(session);
});