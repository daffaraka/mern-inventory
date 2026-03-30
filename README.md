# InventoryMaster Pro 🚀

[![Build Status](https://img.shields.io/badge/Build-Success-brightgreen.svg)](https://github.com/your-username/inventory-master)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Full Stack](https://img.shields.io/badge/Stack-MERN-blue?logo=mongodb&logoColor=white)](https://www.mongodb.com/mern-stack)
[![Premium UI](https://img.shields.io/badge/UI-Modern-hotpink)](https://tailwindcss.com)

A premium, state-of-the-art Inventory Management System built with the MERN stack. Designed for high efficiency, scalability, and a stunning user experience.

---

## ✨ Features

- **📊 Advanced Analytics**: Real-time insights into stock levels, category distribution, and inventory health.
- **📦 Smart Product Management**: Comprehensive CRUD operations with SKU tracking and categorization.
- **🔄 Dynamic Stock Movements**: Track every item movement with automated audit trails.
- **🛡️ Enterprise-Grade Security**: JWT authentication, role-based access control (RBAC), and secure API endpoints.
- **📑 Professional Reporting**: Generate PDF reports and export inventory data to Excel.
- **🎨 Premium UI/UX**: Built with React 19, Tailwind CSS v4, and smooth animations using Framer Motion.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4, Lucide Icons
- **State Management**: React Hooks & Context API
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Yup

### Backend
- **Runtime**: Node.js (Express)
- **Database**: MongoDB (Mongoose)
- **Security**: JWT, Bcrypt, Helmet, Express Rate Limit
- **File Handling**: PDFKit, XLSX

---

## 📂 Project Structure

```bash
📦 inventory-master
 ┣ 📂 backend          # Node.js/Express API
 ┃ ┣ 📂 controllers    # Request handlers
 ┃ ┣ 📂 models         # Mongoose schemas
 ┃ ┣ 📂 routes         # API endpoints
 ┃ ┣ 📂 middlewares    # Auth & validation
 ┃ ┗ 📜 server.js      # Entry point
 ┣ 📂 frontend         # React/Vite App
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components   # Reusable UI
 ┃ ┃ ┣ 📂 pages        # Application views
 ┃ ┃ ┗ 📂 hooks        # Custom React hooks
 ┗ 📜 README.md        # Root documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or Local Instance

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` from template:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 📜 Documentation

- [Root Overview](./README.md)
- [System Architecture](./docs/ARCHITECTURE.md)
- [Production Checklist](./docs/PRODUCTION_CHECKLIST.md)
- [Backend API Guide](./backend/README.md)
- [Frontend Guide](./frontend/README.md)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Developed with ❤️ by Your Abdiaziz
</p>
