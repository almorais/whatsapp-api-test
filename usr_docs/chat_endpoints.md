# Chat Endpoints

This document details the API endpoints for chat-related operations.

---

## 1. Check if Numbers Exist on WhatsApp

-   **Method:** `POST`
-   **Path:** `/chat/whatsappNumbers/:instanceName`
-   **Description:** Checks if a list of numbers are valid WhatsApp accounts.
-   **Request Body:**
    ```json
    {
      "numbers": ["1234567890", "0987654321"]
    }
    ```
-   **Successful Response (200 OK):**
    ```json
    [
      {
        "jid": "1234567890@s.whatsapp.net",
        "exists": true
      },
      {
        "jid": "0987654321@s.whatsapp.net",
        "exists": false
      }
    ]
    ```

---

## 2. Mark Messages as Read

-   **Method:** `PUT`
-   **Path:** `/chat/markMessageAsRead/:instanceName`
-   **Description:** Marks one or more messages as read.
-   **Request Body:**
    ```json
    {
      "readMessages": [
        {
          "id": "MESSAGE_ID_1",
          "fromMe": false,
          "remoteJid": "SENDER_JID@s.whatsapp.net"
        }
      ]
    }
    ```
-   **Successful Response (200 OK):**
    -   An empty response body with a 200 status code indicates success.

---

## 3. Read Messages by ID

-   **Method:** `PATCH`
-   **Path:** `/chat/readMessages/:instanceName`
-   **Description:** Marks messages as read using their database IDs.
-   **Request Body:**
    ```json
    {
      "messageId": [1, 2, 3]
    }
    ```
-   **Successful Response (200 OK):**
    -   An empty response body with a 200 status code indicates success.

---

## 4. Update Presence

-   **Method:** `PATCH`
-   **Path:** `/chat/updatePresence/:instanceName`
-   **Description:** Updates the presence status for a specific chat (e.g., 'composing', 'recording').
-   **Request Body:**
    ```json
    {
      "number": "1234567890@s.whatsapp.net",
      "presence": "composing"
    }
    ```
-   **Successful Response (200 OK):**
    -   An empty response body with a 200 status code indicates success.

---

## 5. Archive Chat

-   **Method:** `PUT`
-   **Path:** `/chat/archiveChat/:instanceName`
-   **Description:** Archives or un-archives a chat.
-   **Request Body:**
    ```json
    {
      "lastMessage": {
        "key": {
          "id": "MESSAGE_ID",
          "fromMe": false,
          "remoteJid": "CHAT_JID@s.whatsapp.net"
        },
        "messageTimestamp": 1678886400
      },
      "archive": true
    }
    ```
-   **Successful Response (200 OK):**
    -   An empty response body with a 200 status code indicates success.

---

## 6. Delete Message

-   **Method:** `DELETE`
-   **Path:** `/chat/deleteMessage/:instanceName` or `/chat/deleteMessageForEveryone/:instanceName`
-   **Description:** Deletes a message for the user or for everyone.
-   **Request Body:**
    ```json
    {
      "id": "MESSAGE_ID",
      "everyOne": "true"
    }
    ```
-   **Successful Response (200 OK or 201 CREATED):**
    -   An empty response body with a success status code.

---

## 7. Delete Chat

-   **Method:** `DELETE`
-   **Path:** `/chat/deleteChat/:instanceName`
-   **Description:** Deletes a chat.
-   **Query Params:**
    -   `chatId` (string, required): The JID of the chat to delete.
-   **Successful Response (200 OK):**
    -   An empty response body with a 200 status code.

---

## 8. Fetch Profile Picture URL

-   **Method:** `GET` or `POST`
-   **Path:** `/chat/fetchProfilePictureUrl/:instanceName`
-   **Description:** Retrieves the profile picture URL of a contact.
-   **Request Body (for POST):**
    ```json
    {
      "number": "1234567890@s.whatsapp.net"
    }
    ```
-   **Successful Response (200 OK):**
    ```json
    {
      "profilePictureUrl": "http://example.com/pic.jpg"
    }
    ```

---

## 9. Find Contacts

-   **Method:** `POST`
-   **Path:** `/chat/findContacts/:instanceName`
-   **Description:** Fetches contacts based on a query.
-   **Request Body:**
    ```json
    {
      "where": {
        "pushName": "John Doe"
      }
    }
    ```
-   **Successful Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "remoteJid": "1234567890@s.whatsapp.net",
        "pushName": "John Doe",
        ...
      }
    ]
    ```

---

## 10. Retrieve Media from Message

-   **Method:** `POST`
-   **Path:** `/chat/mediaData/:instanceName`
-   **Description:** Retrieves media from a message, either as binary data or as form-data.
-   **Request Body:**
    -   A JSON object representing the message from the database.
-   **Query Params:**
    -   `binary` (boolean, optional): If `true`, returns the raw binary file.
-   **Successful Response (200 OK):**
    -   If `binary=true`, returns the file.
    -   Otherwise, returns `multipart/form-data`.

---

## 11. Find Messages

-   **Method:** `POST`
-   **Path:** `/chat/findMessages/:instanceName`
-   **Description:** Fetches messages based on a query.
-   **Request Body:**
    ```json
    {
      "where": {
        "keyRemoteJid": "1234567890@s.whatsapp.net"
      },
      "page": 1,
      "offset": 20,
      "sort": "desc"
    }
    ```
-   **Successful Response (200 OK):**
    -   An array of message objects.

---

## 12. Find Chats

-   **Method:** `GET`
-   **Path:** `/chat/findChats/:instanceName`
-   **Description:** Fetches all chats.
-   **Query Params:**
    -   `type` (string, optional): Filter chats by type.
-   **Successful Response (200 OK):**
    -   An array of chat objects.

---

## 13. Reject Call

-   **Method:** `POST`
-   **Path:** `/chat/rejectCall/:instanceName`
-   **Description:** Rejects an incoming call.
-   **Request Body:**
    ```json
    {
      "callId": "CALL_ID",
      "callFrom": "CALLER_JID@s.whatsapp.net"
    }
    ```
-   **Successful Response (200 OK):**
    -   An empty response body with a 200 status code.

---

## 14. Assert Sessions

-   **Method:** `POST`
-   **Path:** `/chat/assertSessions/:instanceName`
-   **Description:** Checks if sessions exist for the given numbers.
-   **Request Body:**
    ```json
    {
      "numbers": ["1234567890", "0987654321"]
    }
    ```
-   **Successful Response (200 OK):**
    -   An array of session assertion results.

---

## 15. Edit Message

-   **Method:** `POST`
-   **Path:** `/chat/editMessage/:instanceName`
-   **Description:** Edits a previously sent text message.
-   **Request Body:**
    ```json
    {
      "id": "MESSAGE_ID",
      "text": "This is the new message text."
    }
    ```
-   **Successful Response (200 OK):**
    -   The updated message object.