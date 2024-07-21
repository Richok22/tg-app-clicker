# Telegram Clicker Web App Documentation

## Overview

The Telegram Clicker web app is designed to allow users to interact with Telegram in a clicker game format. This guide will help you configure and run the app in development mode.

## Prerequisites

- Node.js and npm installed on your machine

## Configuration

### 1. Server Configuration

To configure the server, follow these steps:

1. **Edit `config.json`**

   In server directory, edit a `config.json` file with the necessary configuration details. Example:

   ```json
    {
      "db": {
        "sql": {
            "host": "localhost",
            "username": "root",
            "password": "",
            "database": "riot",
            "port": 3306
       },
       "redis": {
          "request_interval": 5000
       }
   },
    "default_values": {
      "balance": 0,
      "lvl": 1,
      "maxExp": 10,
      "daily": 0,
      "energy": 1000,
      "maxEnergy": 1000,
      "coin_multiplier": 1,
      "energy_multiplier": 1,
      "photoUrl": "",
      "referralCoins": 400
    },
    "default_upgrades": {
      "coin_multiplier_upgrade": 3,
      "energy_restore_upgrade": 3
    }
    }

2. **Edit `.env`**

In server directory, you need to change env file for value that user can't see like bot token. Example:
```env
   BOT_TOKEN=
   WEBSOCKET_PORT=
   PORT=
   REDIS_SERVER=
   CLIENT_URL=
```
### 1. Cliennt Configuration

**Edit `.env`**
In client directory, you need to change env file for API URL. Example:
```env
   VITE_API_URL=https://c5bf57662d9646.lhr.life
```

