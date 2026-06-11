
# Course Selling Web Application
course-sellingapp/
│
├── Backend/
├── Frontend/
├── README.md   ✅

## Overview
A full-stack MERN Course Selling Platform where users can browse and purchase courses online.

## Features
- User Authentication (JWT)
- Admin Dashboard
- Course Creation & Management
- Stripe Payment Integration
- Cloudinary Image Upload
- Protected Routes
- Responsive UI

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT
- Zod

### Deployment
- Frontend: Vercel
- Backend: Render

## Live Demo

Frontend:
https://course-sellingapp-three.vercel.app

Backend:
https://course-sellingapp.onrender.com

## Installation

### Clone Repository

```bash
git clone https://github.com/Nil7188/course-sellingapp.git
```

### Backend Setup

```bash
cd Backend
npm install
npm start
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside Backend:

```env
MONGO_URI=your_mongodb_uri
JWT_USER_PASSWORD=your_secret
JWT_ADMIN_PASSWORD=your_secret
STRIPE_SECRET_KEY=your_stripe_key
```

## Author

Nilesh Zalte

GitHub:
https://github.com/Nil7188
