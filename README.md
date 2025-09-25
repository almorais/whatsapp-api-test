<div align="center">
  <img src="./public/images/cover.png" alt="CodeChat API Cover">
  <h1>WhatsApp API</h1>
</div>

<div align="center">

[![Telegram Group](https://img.shields.io/badge/Group-Telegram-%2333C1FF)](https://t.me/codechatBR)
[![Whatsapp Group](https://img.shields.io/badge/Group-WhatsApp-%2322BC18)](https://chat.whatsapp.com/HyO8X8K0bAo0bfaeW8bhY5)
[![License](https://img.shields.io/badge/license-Apache--2.0-orange)](./LICENSE)
[![Support](https://img.shields.io/badge/Buy%20me-a%20coffee-orange)](https://app.picpay.com/user/cleber.wilson.oliveira)
[![Support](https://img.shields.io/badge/Donate-via%20Pix-blue)](#-donate-to-the-project)

</div>

---

## 🚀 Overview

This project provides a powerful RESTful API for WhatsApp, built on top of the [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) library. It allows you to automate WhatsApp messaging, create chatbots, integrate with other systems, and manage multiple WhatsApp instances without needing deep knowledge of Node.js.

## ✨ Features

- **Multi-instance Management:** Run and manage multiple WhatsApp accounts simultaneously.
- **Comprehensive Messaging:** Send text, media (images, videos, documents, audio), locations, contacts, and reactions.
- **Interactive Messages:** Support for buttons and lists (legacy).
- **Group Management:** Create groups, manage participants (add, remove, promote, demote), and update group info.
- **Webhook Integration:** Real-time event notifications for messages, connection status, presence, and more.
- **Flexible Authentication:** Secure your API with JWT and a global API key.
- **Database Integration:** Persist messages, contacts, chats, and logs using Prisma ORM with PostgreSQL.
- **External Session Storage:** Use workers for session management, including file-based and SQLite options.
- **Real-time Events:** WebSocket support for live event streaming.
- **Dockerized:** Easy setup and deployment with Docker and Docker Compose.
- **Swagger Documentation:** Interactive API documentation for easy testing and integration.

## 📂 Project Structure

For a detailed explanation of the directory layout and file organization, please see the [Project Structure](./PROJECT_STRUCTURE.md) document.

## 🛠️ Getting Started

Follow these steps to set up and run the application on your local machine.

### Prerequisites

- **Node.js:** v20.x or higher. We recommend using [NVM](https://github.com/nvm-sh/nvm) to manage Node.js versions.
- **Docker:** For running the PostgreSQL database and the application in a containerized environment.

### 1. Install Docker

Docker allows you to run applications in isolated containers.

```sh
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ${USER}
# Log out and log back in for the changes to take effect.
```

### 2. Set Up the Database

This project uses PostgreSQL as its database. A Docker Compose file is provided for easy setup.

```sh
# Navigate to the postgres directory
cd postgres

# Start the PostgreSQL container
docker-compose up -d
```

After the container is running, connect to it using your preferred database management tool and create a new database for the API.

### 3. Install Node.js (using NVM)

```sh
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Restart your terminal, then install and use Node.js v20
nvm install 20
nvm use 20
```

### 4. Install PM2 (Process Manager)

PM2 is a production process manager for Node.js applications that helps keep your API alive.

```sh
npm i -g pm2
```

### 5. Clone and Install Dependencies

```sh
# Clone the repository
git clone https://github.com/code-chat-br/whatsapp-api.git
cd whatsapp-api

# Install dependencies (npm is recommended)
npm install
```

### 6. Configure Environment Variables

Copy the example environment file and customize it with your settings, especially the `DATABASE_URL`.

```sh
cp .env.dev .env
```

Review the settings in the `.env` file and update them as needed. Key variables are documented in the file itself.

### 7. Run Database Migrations

Prisma ORM is used to manage the database schema. Run the following command to apply the necessary migrations.

```sh
# This script runs 'npx prisma migrate deploy'
bash deploy_db.sh
```

You can also use `npx prisma studio` to open a visual editor for your database.

### 8. Start the Application

You can run the application in development or production mode.

**Development Mode:**
```sh
npm run start:dev
```

**Production Mode:**
```sh
npm run start:prod
```

**Using PM2 for Production:**
```sh
pm2 start 'npm run start:prod' --name CodeChat_API
```

## 📚 API Documentation

The API is documented using Swagger (OpenAPI 3.0). Once the application is running, you can access the interactive documentation at:

**http://localhost:8084/docs**

The Swagger definition file can be found at `docs/swagger.yaml`.

## 🔐 Authentication

The API supports two types of authentication, configured in the `.env` file:

1.  **JWT (JSON Web Token):** A token is generated when a new instance is created. This token is specific to that instance and must be included in the header of subsequent requests for that instance.
2.  **Global API Key:** A single, global token that can be defined in your `.env` file. This key provides access to all instances and is useful for administrative tasks.

## 🔌 Webhooks

The API can send real-time notifications for various events via webhooks. Configure your webhook URL through the API to receive events.

| Name                        | Event                       | Description                                                                           |
| --------------------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| `qrcode.updated`            | QRCODE\_UPDATED             | Sends the base64 QR code for authentication.                                          |
| `connection.update`         | CONNECTION\_UPDATE          | Notifies about connection status changes (e.g., 'open', 'close').                     |
| `messages.set`              | MESSAGES\_SET               | Sends the initial list of all messages. (Occurs once)                                 |
| `messages.upsert`           | MESSAGES\_UPSERT            | Triggered when a new message is received.                                             |
| `messages.update`           | MESSAGES\_UPDATE            | Triggered when a message is updated (e.g., read status).                              |
| `send.message`              | SEND\_MESSAGE               | Notifies when a message is sent from the API.                                         |
| `contacts.set`              | CONTACTS\_SET               | Sends the initial list of all contacts. (Occurs once)                                 |
| `contacts.upsert`           | CONTACTS\_UPSERT            | Reloads all contacts with additional information. (Occurs once)                       |
| `contacts.update`           | CONTACTS\_UPDATE            | Triggered when a contact's information is updated.                                    |
| `presence.update`           | PRESENCE\_UPDATE            | Informs about a contact's presence (online, typing, recording).                       |
| `chats.set`                 | CHATS\_SET                  | Sends the initial list of all chats.                                                  |
| `chats.update`              | CHATS\_UPDATE               | Triggered when a chat is updated.                                                     |
| `chats.upsert`              | CHATS\_UPSERT               | Sends information about any new chat.                                                 |
| `chats.delete`              | CHATS\_DELETE               | Notifies when a chat is deleted.                                                      |
| `groups.upsert`             | GROUPS\_UPSERT              | Notifies when a group is created.                                                     |
| `groups.update`             | GROUPS\_UPDATE              | Notifies when group information is updated.                                           |
| `group-participants.update` | GROUP\_PARTICIPANTS\_UPDATE | Notifies about participant actions (add, remove, promote, demote).                    |
| `refresh.token`             | REFRESH\_TOKEN              | Notifies when the instance's JWT token is updated.                                    |
| `call.upsert`               | CALL\_UPSERT                | Notifies about new incoming or outgoing calls.                                        |
| `labels.association`        | LABELS\_ASSOCIATION         | Associates labels with chats or contacts.                                             |
| `labels.edit`               | LABELS\_EDIT                | Notifies when a label is edited.                                                      |

## 🏢 Worker Session Management

For more robust session management, you can use an external worker. This is recommended for production environments.

- **[session-manager:files-v0.0.1](https://github.com/code-chat-br/session-manager)**
- **[session-manager:sqlite-v0.0.1](https://github.com/code-chat-br/session-manager/tree/sqlite)**

To use a worker, set the following environment variables in the API's `.env` file:

-   `PROVIDER_ENABLED=true`
-   `PROVIDER_HOST=127.0.0.1` (or the worker's host)
-   `PROVIDER_PORT=5656` (or the worker's port)
-   `PROVIDER_PREFIX=codechat` (a prefix for grouping instances)

## 📡 WebSocket

Real-time event streaming is available via WebSocket. For more details on how to connect and use it, please [read the WebSocket documentation](./src/websocket/Readme.md).

## 🐳 Docker Deployment

A `docker-compose.yml` file is provided for easy deployment of the entire application stack.

-   **DockerHub Image:** [codechat/api](https://hub.docker.com/r/codechat/api/tags)

To build and run the application using Docker Compose:

```sh
docker-compose up --build
```

---

## 📜 License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for details.

## 💖 Support the Project

This is an open-source project that I maintain in my free time. If you find it useful, please consider supporting its development.

#### Pix: `2b526ada-4ef4-4db4-bbeb-f60da2421fce`

#### PicPay

<div align="center">
  <a href="https://app.picpay.com/user/cleber.wilson.oliveira" target="_blank" rel="noopener noreferrer">
    <img src="./public/images/picpay-image.png" alt="Donate with PicPay" style="width: 50%;">
  </a>
</div>

> **Disclaimer:** This code is in no way affiliated with, authorized, maintained, sponsored, or endorsed by WhatsApp or any of its affiliates or subsidiaries. Use at your own risk. Do not use this for spamming.