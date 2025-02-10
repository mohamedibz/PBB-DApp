# 📢 Plataforma Blockchain de Boletines Públicos (PBB)

Este es el frontend de la **Plataforma Blockchain de Boletines Públicos (PBB)**, una aplicación descentralizada (dApp) construida con **React y Vite** para interactuar con contratos inteligentes en **Ethereum** mediante **MetaMask** y **ethers.js**.

## 🚀 Tecnologías Utilizadas

- **Vite** - Desarrollo rápido de frontend con React.
- **React** - Biblioteca de interfaces de usuario.
- **ethers.js** - Interacción con contratos inteligentes.
- **MetaMask** - Autenticación y firma de transacciones.
- **Solidity** - Desarrollo de contratos inteligentes.

---

## 📦 Instalación y Ejecución en Local

### 1️⃣ Clonar el Repositorio

```sh
git clone https://github.com/tu-usuario/PBB-frontend.git
cd PBB-frontend
```

### 2️⃣ Instalar Dependencias

```sh
npm install
```

### 3️⃣ Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_CONTRACT_ADDRESS=0xTuDireccionDeContrato
VITE_INFURA_API_KEY=tu-api-key
VITE_NETWORK=localhost
```

### 4️⃣ Ejecutar en Modo Desarrollo

```sh
npm run dev
```

La aplicación estará disponible en **`http://localhost:5173/`**.

---

## ✅ Pruebas en Local

### 🔍 Pruebas de Contratos Inteligentes

Si tienes **Hardhat** configurado, puedes ejecutar las pruebas de los contratos:

```sh
npx hardhat test
```

---

## 📝 Licencia

Este proyecto está bajo la licencia **MIT**.

📩 Para cualquier consulta, contacta con [tu email o GitHub].
