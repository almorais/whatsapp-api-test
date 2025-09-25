# Webhook Endpoints

This document details the API endpoints for managing webhooks.

---

## 1. Set Webhook

-   **Method:** `PUT`
-   **Path:** `/webhook/set/:instanceName`
-   **Description:** Creates or updates the webhook configuration for an instance.
-   **Request Body:**
    ```json
    {
      "url": "https://your-webhook-url.com/handler",
      "enabled": true,
      "events": {
        "qrcodeUpdated": true,
        "messagesUpsert": true,
        "connectionUpdated": true
      }
    }
    ```
    *   **`url`** (string, required): The URL where webhook events will be sent.
    *   **`enabled`** (boolean, required): Toggles the webhook on or off.
    *   **`events`** (object, optional): An object specifying which events to subscribe to. If omitted, all events are subscribed to by default. See the [main README](./README.md#🔌-webhooks) for a full list of available events.

-   **Successful Response (201 CREATED):**
    ```json
    {
      "id": 1,
      "url": "https://your-webhook-url.com/handler",
      "enabled": true,
      "events": {
        "qrcodeUpdated": true,
        "messagesUpsert": true,
        "connectionUpdated": true,
        // ... other events will be false or omitted
      },
      "instanceId": 1
    }
    ```
-   **Error Response (400 BAD REQUEST):**
    ```json
    {
      "message": "Instance not found"
    }
    ```

---

## 2. Find Webhook

-   **Method:** `GET`
-   **Path:** `/webhook/find/:instanceName`
-   **Description:** Retrieves the current webhook configuration for an instance.
-   **Request Params:**
    -   `instanceName` (string, required): The name of the instance.
-   **Successful Response (200 OK):**
    ```json
    {
      "id": 1,
      "url": "https://your-webhook-url.com/handler",
      "enabled": true,
      "events": {
        "qrcodeUpdated": true,
        "messagesUpsert": true,
        "connectionUpdated": true
      },
      "instanceId": 1,
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:15:00.000Z"
    }
    ```
    -   If no webhook is configured, the response body will be empty.