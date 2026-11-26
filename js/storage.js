/* =========================================================
   GESTIÓN DE DATOS EN LOCALSTORAGE (Usuarios, Productos, Pedidos)
   ========================================================= */
const STORAGE_KEYS = {
  USERS: 'kwik_users',
  SESSION: 'kwik_session',
  PRODUCTS: 'kwik_products',
  ORDERS: 'kwik_orders',
  EDIT_ORDER_ID: 'kwik_edit_order_id',
  PROCESS_ORDER_ID: 'kwik_process_order_id'
};

function initStorage() {
  // 1. Usuarios iniciales (RIU 2 y 3 - Mockups 01, 02 y 03)
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      {
        username: 'apu',
        fullName: 'Apu Nahasapeemapetilon',
        password: 'admin123',
        role: 'admin',
        failedAttempts: 0,
        locked: false
      },
      {
        username: 'homero',
        fullName: 'Homero Simpson',
        password: 'donas123',
        role: 'user',
        failedAttempts: 0,
        locked: false
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // 2. Productos iniciales exactos del prototipo (RIU 4 y RIU 6)
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    const defaultProducts = [
      { id: '1001', nombre: 'Tallarines 400g', cantidad: 50, valor: 1290, estado: 'Habilitado', usado: false },
      { id: '1002', nombre: 'Talco para pies', cantidad: 12, valor: 2490, estado: 'Habilitado', usado: false },
      { id: '1003', nombre: 'Donas glaseadas', cantidad: 80, valor: 990, estado: 'Habilitado', usado: false },
      { id: '1004', nombre: 'Squishee frambuesa', cantidad: 0, valor: 1500, estado: 'Deshabilitado', usado: false },
      { id: '1005', nombre: 'Leche entera 1L', cantidad: 40, valor: 1150, estado: 'Habilitado', usado: false },
      { id: '1006', nombre: 'Pan de molde', cantidad: 25, valor: 2190, estado: 'Habilitado', usado: false },
      { id: '1007', nombre: 'Arroz grado 1 1kg', cantidad: 60, valor: 1690, estado: 'Habilitado', usado: false },
      { id: '1008', nombre: 'Café molido 250g', cantidad: 18, valor: 4590, estado: 'Habilitado', usado: false }
    ];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }

  // 3. Pedidos iniciales vacíos
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));
}

function setSession(userObj) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
    username: userObj.username,
    fullName: userObj.fullName,
    role: userObj.role
  }));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  localStorage.removeItem(STORAGE_KEYS.EDIT_ORDER_ID);
  localStorage.removeItem(STORAGE_KEYS.PROCESS_ORDER_ID);
}

initStorage();