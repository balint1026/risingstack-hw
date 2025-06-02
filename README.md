# 🎯 Wheel of Fortune Game

A web-based betting game built with **Next.js**, featuring an interactive spinning wheel, real-time leaderboard, and persistent player data using **Prisma**. Styled with **Tailwind CSS** and tested with **Jest**.

You can access the project [here](https://risingstack-hw.vercel.app)
---

## 🚀 Features

- **🎡 Interactive Wheel Game**:  
  Players enter a username, place a bet, and spin the wheel for outcomes:
  - **Double**: Double your bet!
  - **Keep**: Keep your money.
  - **Bankrupt**: Lose everything.

- **👤 User Management**:  
  Player data (username, balance) is stored in a database via Prisma.
- **📈 Leaderboard**:  
  View top players ranked by balance via `/leaderboard`.

- **✅ Unit Testing**:  
  Comprehensive **Jest** tests for backend API routes.

---

## 🧱 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org)
- **Language**: TypeScript
- **Database**: Prisma ORM (supports PostgreSQL, SQLite, etc.)
- **Styling**: Tailwind CSS
- **Testing**: Jest, ts-jest

### 🔧 Dependencies

- [`react-custom-roulette`](https://www.npmjs.com/package/react-custom-roulette): Spinning wheel component  
- `@prisma/client`: Database interaction  
- `next`, `react`, `typescript`, `jest`, `ts-jest`: Core tech

---

## 📦 Prerequisites

- **Node.js**: ≥ v18  
- **npm**: ≥ v8  
- **Git**: For cloning the repository  
- **Database**: PostgreSQL or SQLite (configured via Prisma)

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/balint1026/risingstack-hw.git
cd risingstack-hw
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and set your database URL:

```env
DATABASE_URL="your-database-connection-string"
```

**Example for PostgreSQL:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/wheelgame?schema=public"
```

### 4. Set Up Prisma

```bash
npx prisma generate
npx prisma db push
```

---

## 🚴 Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser and visit:  
[http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

Run unit tests with:

```bash
npm test
```