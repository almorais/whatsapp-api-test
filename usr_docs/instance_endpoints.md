# Instance Endpoints

This document details the API endpoints for managing WhatsApp instances.

---

## 1. Create Instance

-   **Method:** `POST`
-   **Path:** `/instance/create`
-   **Description:** Creates a new WhatsApp instance.
-   **Request Body:**
    ```json
    {
      "instanceName": "my-new-instance",
      "description": "An optional description for the instance.",
      "externalAttributes": {
        "key": "value"
      }
    }
    ```
-   **Successful Response (201 CREATED):**
    ```json
    {
      "id": 1,
      "name": "my-new-instance",
      "description": "An optional description for the instance.",
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z",
      "Auth": {
        "id": 1,
        "token": "your-jwt-token"
      }
    }
    ```
-   **Error Response (400 BAD REQUEST):**
    ```json
    {
      "message": "Instance already exists"
    }
    ```

---

## 2. Connect to WhatsApp

-   **Method:** `GET`
-   **Path:** `/instance/connect/:instanceName`
-   **Description:** Initiates a connection to WhatsApp for the specified instance and returns a QR code if the instance is not yet connected.
-   **Request Params:**
    -   `instanceName` (string, required): The name of the instance.
-   **Successful Response (200 OK):**
    -   If not connected, returns a QR code string.
    -   If already connecting, returns the existing QR code.
    -   If already open, returns the connection status.
    ```json
    {
      "qr": "base64-encoded-qr-code-string"
    }
    ```
-   **Error Response (404 NOT FOUND):**
    ```json
    {
      "message": "Instance not found"
    }
    ```

---

## 3. Get Connection State

-   **Method:** `GET`
-   **Path:** `/instance/connectionState/:instanceName`
-   **Description:** Retrieves the current connection state of the instance.
-   **Request Params:**
    -   `instanceName` (string, required): The name of the instance.
-   **Successful Response (200 OK):**
    ```json
    {
      "state": "open",
      "statusReason": 200
    }
    ```
    or
    ```json
    {
      "state": "close",
      "statusReason": 401
    }
    ```

---

## 4. Fetch Instance Details

-   **Method:** `GET`
-   **Path:** `/instance/fetchInstance/:instanceName`
-   **Description:** Fetches detailed information about a specific instance.
-   **Request Params:**
    -   `instanceName` (string, required): The name of the instance.
-   **Successful Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "my-instance",
      "description": "My instance description",
      "connectionStatus": "ONLINE",
      "ownerJid": "1234567890@s.whatsapp.net",
      "profilePicUrl": "http://example.com/pic.jpg",
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z",
      "Auth": { ... },
      "Webhook": { ... },
      "Whatsapp": {
        "connection": {
          "state": "open",
          "statusReason": 200
        }
      }
    }
    ```
-   **Error Response (400 BAD REQUEST):**
    ```json
    {
      "message": "Instance not found"
    }
    ```

---

## 5. Fetch All Instances

-   **Method:** `GET`
-   **Path:** `/instance/fetchInstances`
-   **Description:** Retrieves a list of all instances.
-   **Successful Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "my-instance-1",
        ...
      },
      {
        "id": 2,
        "name": "my-instance-2",
        ...
      }
    ]
    ```

---

## 6. Reload Connection

-   **Method:** `PATCH`
-   **Path:** `/instance/reload/:instanceName`
-   **Description:** Reloads the connection for a currently open instance.
-   **Request Params:**
    -   `instanceName` (string, required): The name of the instance.
-   **Successful Response (200 OK):**
    ```json
    {
      "state": "open",
      "statusReason": 200
    }
    ```

---

## 7. Update Instance

-   **Method:** `PATCH`
-   **Path:** `/instance/update/:instanceName`
-   **Description:** Updates the description of an instance.
-   **Request Params:**
    -   `instanceName` (string, required): The name of the instance to update.
-   **Request Body:**
    ```json
    {
      "description": "A new description for the instance."
    }
    ```
-   **Successful Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "my-instance",
      "description": "A new description for the instance.",
      ...
    }
    ```
-   **Error Response (400 BAD REQUEST):**
    ```json
    {
      "message": "Instance not found"
    }
    ```

---

## 8. Logout Instance

-   **Method:** `DELETE`
-   **Path:** `/instance/logout/:instanceName`
-   **Description:** Logs out the instance from WhatsApp.
-   **Request Params:**
    -   `instanceName` (string, required): The name of the instance.
-   **Successful Response (200 OK):**
    ```json
    {
      "error": false,
      "message": "Instance logged out"
    }
    ```

---

## 9. Delete Instance

-   **Method:** `DELETE`
-   **Path:** `/instance/delete/:instanceName`
-   **Description:** Deletes an instance. The instance must be disconnected first.
-   **Request Params:**
    -   `instanceName` (string, required): The name of the instance.
-   **Query Params:**
    -   `force` (boolean, optional): If `true`, deletes the instance and all its dependencies (messages, contacts, etc.).
-   **Successful Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "my-instance",
      ...,
      "deletedAt": "2023-10-27T10:30:00.000Z"
    }
    ```
-   **Error Response (400 BAD REQUEST):**
    ```json
    {
      "message": [
        "Deletion failed",
        "The instance needs to be disconnected"
      ]
    }
    ```

---

## 10. Refresh Token

-   **Method:** `PUT`
-   **Path:** `/instance/refreshToken/:instanceName`
-   **Description:** Refreshes the JWT for an instance.
-   **Request Params:**
    -   `instanceName` (string, required): The name of the instance.
-   **Request Body:**
    ```json
    {
      "oldToken": "your-old-jwt-token"
    }
    ```
-   **Successful Response (201 CREATED):**
    - The response body will be empty, but a new token will be set in the session.
-   **Error Response (400 BAD REQUEST):**
    ```json
    {
      "message": "Invalid \"oldToken\""
    }
    ```