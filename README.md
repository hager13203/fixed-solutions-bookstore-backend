# 📚 Bookstore API

A full-stack **Bookstore API** built with **Node.js**, **Express**, and **MongoDB**, featuring **role-based access** (user/admin), **JWT authentication**, and **API documentation** with Swagger.  
The project is fully **Dockerized** for easy setup and testing.

---

## 🚀 Features

### **User Authentication**
- Register & Login
- JWT-based authentication
- Role-based access control (**user/admin**)

### **Books Management**
- Add, update, delete books (**admin or owner**)
- Buy books (**users cannot buy their own books**)
- Track available stock

### **API Documentation**
- **Swagger UI** integrated
- Test all endpoints interactively

### **Dockerized Setup**
- **MongoDB + Mongo Express** for database management
- **Docker Compose** for running the whole stack

---

## 🛠️ Technologies

- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT, HTTP-only cookies
- **Validation:** AJV
- **API Documentation:** Swagger UI
- **Docker:** Docker Compose for containerization
- **Optional UI:** Mongo Express for database management

---

## ⚡ Setup & Run

1. Clone the repository:
```bash
git clone https://github.com/hager13203/fixed-solutions-bookstore-backend.git
cd https://github.com/hager13203/fixed-solutions-bookstore-backend.git
