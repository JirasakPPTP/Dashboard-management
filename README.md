# Full-Stack Dashboard (MERN + Vite)

## Folder Structure

- client: React + Vite + Tailwind + Router + Axios + Recharts
- server: Node + Express + MongoDB + Mongoose + JWT

## Run

1. Backend
   - cd server
   - npm install
   - copy .env.example to .env and update values
   - npm run dev

2. Frontend
   - cd client
   - npm install
   - copy .env.example to .env
   - npm run dev

## API Routes

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PATCH /api/auth/change-password
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id
- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
