# Telegram Clicker Web App Documentation

## Overview

The Telegram Clicker web app is designed to allow users to interact with Telegram in a clicker game format. This guide will help you configure and run the app in development mode.

## Prerequisites

- Node.js and npm installed on your machine
- Redis and SQL database

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

### 2. Client Configuration

   **Edit `.env`**

   In client directory, you need to change env file for API URL. Example:
   ```env
      VITE_API_URL=https://c5bf57662d9646.lhr.life
   ```

## Telegram integration with development server

### 1. Start development servers for front-end and back-end

   **Start terminal `cmd`**

   Open terminals for both the server and client directories and run:
   ```cmd
      npm run dev
   ```
### 2. Start forwading local URL's to public

   You can start forwading using ngrok or localhost.run

   In this example we gonna use localhost.run, to start forwading, in terminal we need to launch localhost.run on out ports which we are using for development for vite and express default are 5173 and 3000, but for websocket we gonna use 3001 (They need to be in seperate terminals)
   ```cmd
      ssh -R 80:localhost:5173 nokey@localhost.run
   ```
   ```cmd
      ssh -R 80:localhost:3001 nokey@localhost.run
   ```
### 2. Configure env files
   Now we need to change our links on localhost link example: **https://3d1ad34d884d31.lhr.life** and SERVER cors we need to change link to our client link from localhost.run, and api of course
   
   ```index.js
      const io = new Server(server, {
          perMessageDeflate: false,
          cors: {
              origin: "LOCAlHOST.RUN LINK HERE",
              methods: ["GET", "POST"],
              credentials: true
          }
      });
   ```

### 3. Create bot and add link to webapp

   1. **Open Telegram**: Use the Telegram app or web interface.
   2. **Find BotFather**: Search for "BotFather" in Telegram. BotFather is the official bot for creating other bots.
   3. **Start a Chat**: Click "Start" to begin a chat with BotFather.
   4. **Create a New Bot**: Send the command `/newbot` to BotFather.
   5. **Follow the Prompts**:
      - **Name**: Provide a name for your bot.
      - **Username**: Choose a unique username ending in `bot` (e.g., `my_test_bot`).

   After successful creation, BotFather will provide you with a **Token**. Save this token as you will need it to configure your server .env file. And to add or webapp we need to

   1. **Create a New webapp**: Send the command `/newapp` to BotFather.
   2. **Choose out bot**: select bot.
   3. **Enter title**: that tittle will shown in app.
   4. **Enter description**: it will be seen in link.
   5. **Upload picture**: in 640x360 pixels.
   6. **Upload gif** if you want but we use `/empty`.
   7. **Send url** YOU NEED TO SEND CLIENT, LOCALHOST.RUN LINK HERE
   7. **Create app url** that link open our app with telegram data

   After that you can launch you web app with development server
