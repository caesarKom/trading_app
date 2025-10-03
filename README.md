# 📈 Trading App

Full-stack mobile trading platform with real-time charts, biometric authentication and micro-services architecture.

---

## 🚀 Features

| Feature | Stack |
|---------|-------|
| 🔐 Biometric / PIN auth | React-Native + Keychain |
| 📊 Real-time charts | TradingView Lightweight Charts |
| ⚡ Live prices | Socket.IO + MongoDB change-streams |
| 🏦 Holdings & orders | REST API (Express + Mongoose) |
| 🎨 Dark / light theme | React-Navigation + context |
| 📱 Cross-platform | iOS & Android (Expo bare workflow) |

---

## 📦 Micro-services

| Service | Port | Description |
|---------|------|-------------|
| `server` | 8000 | REST API (auth, stocks, holdings) |
| `trading_chart` | 8001 | WebSocket micro-service for OHLC & candles |
| `trading_app` | Metro | React-Native mobile client |

---

## 🛠️ Tech Stack

### Backend
- Node.js 20 + Express 4
- MongoDB 7 (Atlas or local)
- Socket.IO 4
- JWT (access + refresh) + secure http-only cookies
- Joi validation, Winston logs, Swagger docs

### Mobile
- React-Native 0.73 (bare workflow)
- Redux-Toolkit + RTK Query
- React-Navigation 6
- Biometrics (react-native-biometrics)
- TradingView Lightweight Charts

### DevOps
- Docker-ready (Dockerfile per service)
- GitHub Actions CI (lint + test)
- Husky + lint-staged    
- Environment isolation via `.env`

---

## ⚙️ Quick Start

### 1. Clone & install
```bash
git clone https://github.com/caesarKom/trading_app.git
cd trading_app
