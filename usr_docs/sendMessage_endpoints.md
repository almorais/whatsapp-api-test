# Send Message Endpoints

This document details the API endpoints for sending various types of messages. All endpoints in this section use the `POST` method and return a `201 CREATED` status on success with the sent message object as the response body.

---

## 1. Send Text Message

-   **Path:** `/message/sendText/:instanceName`
-   **Description:** Sends a plain text message.
-   **Request Body:**
    ```json
    {
      "number": "RECIPIENT_JID@s.whatsapp.net",
      "options": {
        "delay": 1200,
        "presence": "composing"
      },
      "textMessage": {
        "text": "Hello, this is a test message."
      }
    }
    ```
-   **Successful Response:** A message object confirming the message was sent.

---

## 2. Send Media from URL

-   **Path:** `/message/sendMedia/:instanceName`
-   **Description:** Sends a media message (image, video, document, audio, sticker) from a public URL.
-   **Request Body:**
    ```json
    {
      "number": "RECIPIENT_JID@s.whatsapp.net",
      "mediaMessage": {
        "mediatype": "image",
        "media": "https://example.com/image.jpg",
        "caption": "This is a caption."
      }
    }
    ```
-   **Successful Response:** A message object.

---

## 3. Send Media from File

-   **Path:** `/message/sendMediaFile/:instanceName`
-   **Description:** Sends a media message by uploading a file.
-   **Request Body:** `multipart/form-data`
    -   `attachment`: The media file.
    -   `number`: RECIPIENT_JID@s.whatsapp.net
    -   `mediatype`: "image", "video", "document", etc.
    -   `caption` (optional): "This is a caption."
-   **Successful Response:** A message object.

---

## 4. Send WhatsApp Audio from URL

-   **Path:** `/message/sendWhatsAppAudio/:instanceName`
-   **Description:** Sends an audio message from a URL, formatted as a WhatsApp voice note.
-   **Request Body:**
    ```json
    {
      "number": "RECIPIENT_JID@s.whatsapp.net",
      "audioMessage": {
        "audio": "https://example.com/audio.ogg"
      }
    }
    ```
-   **Successful Response:** A message object.

---

## 5. Send WhatsApp Audio from File

-   **Path:** `/message/sendWhatsAppAudioFile/:instanceName`
-   **Description:** Sends an audio file as a WhatsApp voice note.
-   **Request Body:** `multipart/form-data`
    -   `attachment`: The audio file.
    -   `number`: RECIPIENT_JID@s.whatsapp.net
-   **Successful Response:** A message object.

---

## 6. Send Location

-   **Path:** `/message/sendLocation/:instanceName`
-   **Description:** Sends a location message.
-   **Request Body:**
    ```json
    {
      "number": "RECIPIENT_JID@s.whatsapp.net",
      "locationMessage": {
        "latitude": 34.0522,
        "longitude": -118.2437,
        "name": "Los Angeles",
        "address": "CA, USA"
      }
    }
    ```
-   **Successful Response:** A message object.

---

## 7. Send Contact

-   **Path:** `/message/sendContact/:instanceName`
-   **Description:** Sends one or more contacts.
-   **Request Body:**
    ```json
    {
      "number": "RECIPIENT_JID@s.whatsapp.net",
      "contactMessage": [
        {
          "fullName": "John Doe",
          "wuid": "1234567890",
          "phoneNumber": "+1 (234) 567-890"
        }
      ]
    }
    ```
-   **Successful Response:** A message object.

---

## 8. Send Reaction

-   **Path:** `/message/sendReaction/:instanceName`
-   **Description:** Sends a reaction (emoji) to a specific message.
-   **Request Body:**
    ```json
    {
      "reactionMessage": {
        "key": {
          "id": "MESSAGE_ID",
          "remoteJid": "CHAT_JID@s.whatsapp.net",
          "fromMe": false
        },
        "reaction": "👍"
      }
    }
    ```
-   **Successful Response:** A message object.

---

## 9. Send Buttons

-   **Path:** `/message/sendButtons/:instanceName`
-   **Description:** Sends a message with interactive buttons.
-   **Request Body:**
    ```json
    {
        "number": "RECIPIENT_JID@s.whatsapp.net",
        "buttonsMessage": {
            "title": "Button Title",
            "description": "Button Description",
            "buttons": [
                {"type": "reply", "displayText": "Reply Me", "id": "custom_id_1"},
                {"type": "call", "displayText": "Call Me", "phoneNumber": "+1234567890"}
            ]
        }
    }
    ```
-   **Successful Response:** A message object.

---

## 10. Send List

-   **Path:** `/message/sendList/:instanceName`
-   **Description:** Sends a message with a list of options.
-   **Request Body:**
    ```json
    {
      "number": "RECIPIENT_JID@s.whatsapp.net",
      "listMessage": {
        "title": "List Title",
        "description": "List Description",
        "sections": [
          {
            "buttonText": "Click to see options",
            "list": [
              {
                "title": "Section 1",
                "rows": [
                  {"title": "Option 1", "description": "Desc 1", "id": "opt_1"},
                  {"title": "Option 2", "description": "Desc 2", "id": "opt_2"}
                ]
              }
            ]
          }
        ]
      }
    }
    ```
-   **Successful Response:** A message object.

---

## 11. Send Link with Preview

-   **Path:** `/message/sendLink/:instanceName`
-   **Description:** Sends a message with a URL and generates a link preview.
-   **Request Body:**
    ```json
    {
      "number": "RECIPIENT_JID@s.whatsapp.net",
      "linkMessage": {
        "link": "https://www.google.com",
        "text": "Check out this link!",
        "title": "Google",
        "description": "Search the world's information."
      }
    }
    ```
-   **Successful Response:** A message object.