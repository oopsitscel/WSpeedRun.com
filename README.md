# WSpeedRun.com

WSpeedRun.com is a speedrun leaderboard platform built using NestJS microservices architecture.  
This project allows users to submit speedruns, browse games and categories, comment on runs, and allows administrators to moderate submitted runs.

# Technologies Used

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL / MySQL
- JWT Authentication
- Swagger API Documentation
- Microservices Architecture

# Microservices Structure

This project consists of 3 services:
| Service | Port | Description |
|---|---|---|
| Auth Service | 3000 | Authentication and user management |
| Game Service | 3001 | Game and category management |
| Run Service | 3002 | Run submissions and comments |

---

# Features

## Guest
- View all games
- View game details
- View categories
- View runs
- View run details
- View leaderboard

## User
- Register account
- Login account
- Submit speedrun
- View own submissions
- Comment on runs
- Delete own comments

## Admin
- Create game
- Update game
- Delete game
- Create category
- Update category
- Delete category
- Accept run submissions
- Reject run submissions
- View runs by status
---

# How to Run the Project
## 1. Download the Project

### Option A — Download ZIP from GitHub
1. Open the GitHub repository
2. Click:
```txt
Code → Download ZIP
```
3. Extract the ZIP file

### Option B — Clone Repository
```bash
git clone <repository-url>
```

# 2. Open Project
Open the extracted project folder using Visual Studio Code.

# 3. Install Dependencies
Each service must install dependencies separately.

## AUTH SERVICE
Open terminal:
```bash
cd auth-service
npm install
```

## GAME SERVICE
Open another terminal:
```bash
cd game-service
npm install
```

## RUN SERVICE
Open another terminal:
```bash
cd run-service
npm install
```

# 4. Setup Environment Variables
Create a `.env` file inside EACH service folder.

## AUTH SERVICE `.env`
```env
PORT=3000
DATABASE_URL="mysql://root:@localhost:3306/wspeedrun_db"
JWT_SECRET="Super_Secret_SoftArch"

GAME_SERVICE_URL=http://localhost:3001
RUN_SERVICE_URL=http://localhost:3002
```

## GAME SERVICE `.env`

```env
PORT=3001
DATABASE_URL="mysql://root:@localhost:3306/wspeedrun_db"
JWT_SECRET="Super_Secret_SoftArch"

AUTH_SERVICE_URL=http://localhost:3000
RUN_SERVICE_URL=http://localhost:3002
```

## RUN SERVICE `.env`

```env
PORT=3002
DATABASE_URL="mysql://root:@localhost:3306/wspeedrun_db"
JWT_SECRET="Super_Secret_SoftArch"

AUTH_SERVICE_URL=http://localhost:3000
GAME_SERVICE_URL=http://localhost:3001
```

# 5.	Setup Database
Create the MySQL database:
```bash
CREATE DATABASE wspeedrun_db;
```

Import the provided SQL file into the database.
Example using MySQL CLI: mysql -u root -p wspeedrun_db < database/clean.sql
After importing the SQL file, generate Prisma Client inside EACH service folder.

## AUTH SERVICE
```bash
cd auth-service
npx prisma generate
```

## GAME SERVICE
```bash
cd game-service
npx prisma generate
```

## RUN SERVICE

```bash
cd run-service
npx prisma generate
```
### Notes
Database tavles are created using the provided SQL file Prisma Clients is used for databasse model generation and database access

# 6. Run the Services
Each service must run in separate terminals.

## AUTH SERVICE
```bash
cd auth-service
npm run start:dev
```

## GAME SERVICE
```bash
cd game-service
npm run start:dev
```

## RUN SERVICE

```bash
cd run-service
npm run start:dev
```

# API Endpoints Overview

# AUTH SERVICE
## Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /users/:id/profile | Get user profile |

# GAME SERVICE
## Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /games | Get all games |
| GET | /games/:id | Get game details |
| GET | /categories/:id | Get category details |

## Admin Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /admin/games | Create game |
| PATCH | /admin/games/:id/update | Update game |
| DELETE | /admin/games/:id/delete | Delete game |
| POST | /admin/categories | Create category |
| PATCH | /admin/categories/:id/update | Update category |
| DELETE | /admin/categories/:id/delete | Delete category |

# RUN SERVICE
## Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /runs/:id/category | Get runs by category |
| GET | /runs/:id/user | Get runs by user |
| GET | /runs/:id | Get run details |

## User Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /runs | Submit run |
| POST | /comments | Create comment |
| DELETE | /comments/:id | Delete comment |

## Admin Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /admin/runs/:status | Get runs by status |
| POST | /admin/runs/:id/accept | Accept run |
| POST | /admin/runs/:id/reject | Reject run |

# Authentication

This project uses JWT Authentication.
After login, users will receive:
```json
{
  "access_token": "your_jwt_token"
}
```

Use the token inside Authorization Header:
```txt
Authorization: Bearer your_token
```

# Database ORM

This project uses Prisma ORM.
Useful Prisma Commands:
```bash
npx prisma generate
```
```bash
npx prisma migrate dev
```
```bash
npx prisma studio
```
