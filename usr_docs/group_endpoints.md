# Group Endpoints

This document details the API endpoints for group-related operations.

---

## 1. Create Group

-   **Method:** `POST`
-   **Path:** `/group/create/:instanceName`
-   **Description:** Creates a new WhatsApp group.
-   **Request Body:**
    ```json
    {
      "subject": "My New Group",
      "description": "This is an optional description.",
      "participants": ["1234567890", "0987654321"]
    }
    ```
-   **Successful Response (201 CREATED):**
    ```json
    {
      "id": "GROUP_JID@g.us",
      "owner": "CREATOR_JID@s.whatsapp.net",
      "subject": "My New Group",
      "creation": 1678886400,
      "participants": [ ... ]
    }
    ```

---

## 2. Update Group Picture

-   **Method:** `PUT`
-   **Path:** `/group/updateGroupPicture/:instanceName`
-   **Description:** Updates the profile picture of a group.
-   **Request Body:**
    ```json
    {
      "groupJid": "GROUP_JID@g.us",
      "image": "base64-encoded-image-string"
    }
    ```
-   **Successful Response (201 CREATED):**
    -   An empty response body with a 201 status code indicates success.

---

## 3. Find Group Info

-   **Method:** `GET`
-   **Path:** `/group/findGroupInfos/:instanceName`
-   **Description:** Retrieves metadata for a specific group.
-   **Query Params:**
    -   `groupJid` (string, required): The JID of the group.
-   **Successful Response (200 OK):**
    ```json
    {
      "id": "GROUP_JID@g.us",
      "subject": "Group Name",
      ...
    }
    ```

---

## 4. Find All Groups

-   **Method:** `GET`
-   **Path:** `/group/findAllGroups/:instanceName`
-   **Description:** Retrieves a list of all groups the instance is a part of.
-   **Successful Response (200 OK):**
    ```json
    [
      {
        "id": "GROUP_JID_1@g.us",
        "subject": "Group 1"
      },
      {
        "id": "GROUP_JID_2@g.us",
        "subject": "Group 2"
      }
    ]
    ```

---

## 5. Get Group Invite Code

-   **Method:** `GET`
-   **Path:** `/group/inviteCode/:instanceName`
-   **Description:** Retrieves the invite code for a group.
-   **Query Params:**
    -   `groupJid` (string, required): The JID of the group.
-   **Successful Response (200 OK):**
    ```json
    {
      "inviteCode": "ABCDEFGHIJKL"
    }
    ```

---

## 6. Revoke Group Invite Code

-   **Method:** `PUT`
-   **Path:** `/group/revokeInviteCode/:instanceName`
-   **Description:** Revokes the current invite code for a group.
-   **Query Params:**
    -   `groupJid` (string, required): The JID of the group.
-   **Successful Response (201 CREATED):**
    -   An empty response body with a 201 status code indicates success.

---

## 7. Find Group Participants

-   **Method:** `GET`
-   **Path:** `/group/participants/:instanceName`
-   **Description:** Retrieves the list of participants for a group.
-   **Query Params:**
    -   `groupJid` (string, required): The JID of the group.
-   **Successful Response (200 OK):**
    ```json
    [
      {
        "id": "PARTICIPANT_JID_1@s.whatsapp.net",
        "admin": "admin"
      },
      {
        "id": "PARTICIPANT_JID_2@s.whatsapp.net",
        "admin": null
      }
    ]
    ```

---

## 8. Update Group Participants

-   **Method:** `PUT`
-   **Path:** `/group/updateParticipant/:instanceName`
-   **Description:** Adds, removes, promotes, or demotes participants in a group.
-   **Request Body:**
    ```json
    {
      "groupJid": "GROUP_JID@g.us",
      "action": "add",
      "participants": ["1234567890", "0987654321"]
    }
    ```
-   **Successful Response (201 CREATED):**
    -   An empty response body with a 201 status code indicates success.

---

## 9. Leave Group

-   **Method:** `DELETE`
-   **Path:** `/group/leaveGroup/:instanceName`
-   **Description:** Makes the instance leave a group.
-   **Query Params:**
    -   `groupJid` (string, required): The JID of the group.
-   **Successful Response (200 OK):**
    -   An empty response body with a 200 status code indicates success.