# Artemisa — ERP Light & Quoting System (Case Study)

**A lightweight internal ERP + quoting system built for a retail business.**  
Designed and developed to streamline product management, pricing, quoting, sales history tracking, and currency conversion workflows — all through a fast, React-powered interface and a simple Node.js API layer.

This repo serves as a **technical case study** of the system I built for a real client.

---

## 🚀 Overview

Artemisa is a **web-based operational tool** used daily by a retail business to:

- Manage a large product catalog (stock, categories, images, specs)
- Generate customer quotes in under a minute
- Track sales and revenue
- Convert USD → ARS using official exchange rates
- Maintain internal pricing (margin, wholesale calculations, cost updates)
- Export customer-ready quote PDFs  
- Handle inventory updates automatically after sales

The goal was not to create a full enterprise ERP, but a **lean, focused system** that solves the client's real workflows without unnecessary complexity.

---

## 🧠 Business Problem

The client previously relied on:

- WhatsApp + Excel for price quoting  
- Manual product lookups  
- Outdated lists sent to employees  
- Manual calculation of USD-based prices  
- No record of previous quotes or sales  
- No unified view of stock or product details  

These inefficiencies caused:

- Incorrect prices  
- Lost sales  
- Delays when handling clients in store  
- No visibility into what was sold or when  
- Inconsistent profit margins  

They needed a **centralized tool** to unify all workflows and eliminate manual mistakes.

---

## 🎯 My Role

I handled the entire system end-to-end:

- **Product architecture**
- **React UI & component system**
- **State management & operational flows**
- **Custom React forms with validation**
- **Node.js API (CRUD, authentication, pricing logic)**
- **MongoDB modeling**
- **UX for retail workflows (fast, minimal clicks)**
- **Electron packaging (for offline version — optional)**
- **PDF generation workflow**

This was a solo built project.

---

## 🏗️ System Architecture

```
┌───────────────────────────────────────────────────────────┐
│ Client (React)                                            │
│ - Dashboards                                              │
│ - Product Manager (CRUD + images + specs)                 │
│ - Quoting UI (dynamic form + pricing logic)               │
│ - Sales History + filters                                 │
│ - USD/ARS conversion tool                                 │
└───────────────▲───────────────────────────────────────────┘
                │ REST API (JWT)
┌───────────────┴───────────────────────────────────────────┐
│ Node.js / Express                                         │
│ - Auth (JWT)                                              │
│ - Product CRUD                                            │
│ - Quoting + margin logic                                  │
│ - Sales records                                           │
│ - File uploads                                            │
└───────────────▲───────────────────────────────────────────┘
                │ Mongoose ORM
┌───────────────┴───────────────────────────────────────────┐
│ MongoDB                                                   │
│ - Products                                                │
│ - Quotes                                                  │
│ - Sales                                                   │
│ - Categories                                              │
└───────────────────────────────────────────────────────────┘
```


## 🧩 Key Features

### **1. Product Management**
- Title, price, code, stock  
- Categories & subcategories  
- Dynamic specifications (key/value)  
- Multiple images  
- Status (active/inactive)  

### **2. Quoting System (Core Feature)**
- Add products with quantity + margin %
- Auto-calculated subtotals and totals  
- Customer assignment
- Inline validations  
- Export to **PDF**  
- Editable profit margin per product  

### **3. Sales History**
- Automatic record created after each quote → sale  
- Filters: by customer, product, date  
- Total revenue calculation  
- Expandable sales detail table  

### **4. Currency Converter (USD → ARS)**
- Real-time official USD buy/sell  
- Useful for materials priced in USD  

### **5. Responsive Dashboard**
- High-contrast UI designed for in-store use  
- Large clickable components  
- Optimized for fast operations  

---

## 🔍 Technical Highlights

### **Custom Forms & Validation**
The quoting flow uses components built specifically for:
- dynamic product rows  
- real-time subtotal updates  
- error handling  
- controlled inputs  

### **Predictable State Management**
The app uses:
- Context API  
- Reducers for inventory, quotes, and UI state  
- Normalized data structures  

### **Optimized Rendering**
- Virtualized product lists  
- Memoized forms and product cards  
- Controlled re-renders on large catalogs  

### **PDF Workflow**
Quotes generate a pixel-perfect PDF with:
- Customer data  
- Items  
- Subtotals & totals  
- Automatically formatted data  

### **CI/CD**
Deployed via Vercel with:
- Preview branches  
- Automatic rebuilds  
- Environment-secured backend endpoints  

---

## 📸 Screenshots

> *(Use GitHub’s `/assets` folder or link to uploaded images; these are placeholders)*

### **Dashboard**
![Dashboard](./assets/dashboard.png)

### **Quoting UI**
![Quote](./assets/quote.png)

### **Sales History**
![Sales](./assets/sales.png)

### **Product Editor**
![Products](./assets/products.png)

---

## 📊 Impact

The client achieved:

- **70% faster quoting time**  
(from ~10 minutes to under 3 minutes)
- **No pricing inconsistencies**
- **Centralized source of truth for products**
- **Historical visibility of all sales**
- **Fewer errors and better customer experience**
- **Faster employee onboarding**
(UI is extremely simple and guided)

The system continues to be used daily.

---

## 🧱 Tech Stack

### **Frontend**
- React.js (TypeScript)
- Tailwind CSS
- React Hook Form
- Context + Reducers
- Axios

### **Backend**
- Node.js  
- Express  
- MongoDB + Mongoose  

### **Other**
- JWT Authentication  
- Vercel / Render / Firebase  
- PDFKit / html-pdf  
- Electron (optional offline build)

---

## 📌 Future Improvements

- Role-based access (admin / vendor)
- Inventory analytics (charts)
- Low-stock alerts
- Supplier management
- Multi-branch support
- Export/Import XLS

---

## 📬 Contact

**Patricio Pittana**  
Frontend Engineer (React/TypeScript)  
Portfolio: https://codebypittana.vercel.app  
Email: pittanapatricio@gmail.com  
LinkedIn: https://linkedin.com/in/patricio-pittana-2185b6177  

---
