/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename chat.dto.ts                                                        │
 * │ Developed by: Cleber Wilson                                                  │
 * │ Creation date: Nov 27, 2022                                                  │
 * │ Contact: contato@codechat.dev                                                │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @copyright © Cleber Wilson 2022. All rights reserved.                        │
 * │ Licensed under the Apache License, Version 2.0                               │
 * │                                                                              │
 * │  @license "https://github.com/code-chat-br/whatsapp-api/blob/main/LICENSE"   │
 * │                                                                              │
 * │ You may not use this file except in compliance with the License.             │
 * │ You may obtain a copy of the License at                                      │
 * │                                                                              │
 * │    http://www.apache.org/licenses/LICENSE-2.0                                │
 * │                                                                              │
 * │ Unless required by applicable law or agreed to in writing, software          │
 * │ distributed under the License is distributed on an "AS IS" BASIS,            │
 * │ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.     │
 * │                                                                              │
 * │ See the License for the specific language governing permissions and          │
 * │ limitations under the License.                                               │
 * │                                                                              │
 * │ @class                                                                       │
 * │ @constructs OnWhatsAppDto                                                    │
 * │ @param {String} jid @param {Boolean} exists @param {String} name             │
 * │                                                                              │
 * │ @class WhatsAppNumberDto @class NumberDto @class Key @class ReadMessageDto   │
 * │ @class LastMessage @class ArchiveChatDto @class DeleteMessage                │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { WAPresence } from '@whiskeysockets/baileys';

/**
 * @class OnWhatsAppDto
 * @description DTO for checking if a number is on WhatsApp.
 */
export class OnWhatsAppDto {
  /**
   * @constructor
   * @param {string} jid - The JID of the contact.
   * @param {boolean} exists - Whether the contact exists on WhatsApp.
   * @param {string} [lid] - The LID of the contact.
   * @param {string} [name] - The name of the contact.
   */
  constructor(
    public readonly jid: string,
    public readonly exists: boolean,
    public readonly lid?: string,
    public readonly name?: string,
  ) {}
}

/**
 * @class WhatsAppNumberDto
 * @description DTO for a list of WhatsApp numbers.
 */
export class WhatsAppNumberDto {
  numbers: string[];
}

/**
 * @class NumberDto
 * @description DTO for a single number.
 */
export class NumberDto {
  number: string;
}

/**
 * @class UpdatePresenceDto
 * @extends NumberDto
 * @description DTO for updating presence status.
 */
export class UpdatePresenceDto extends NumberDto {
  presence: WAPresence;
}

/**
 * @class Key
 * @description DTO for a message key.
 */
class Key {
  id: string;
  fromMe: boolean;
  remoteJid: string;
}
/**
 * @class ReadMessageDto
 * @description DTO for marking messages as read.
 */
export class ReadMessageDto {
  readMessages: Key[];
}

/**
 * @class ReadMessageIdDto
 * @description DTO for marking messages as read by ID.
 */
export class ReadMessageIdDto {
  messageId: number[];
}

/**
 * @class LastMessage
 * @description DTO for the last message in a chat.
 */
class LastMessage {
  key: Key;
  messageTimestamp?: number;
}

/**
 * @class ArchiveChatDto
 * @description DTO for archiving a chat.
 */
export class ArchiveChatDto {
  lastMessage: LastMessage;
  archive: boolean;
}

/**
 * @class MessageId
 * @description DTO for a message ID.
 */
export class MessageId {
  id: string;
}

/**
 * @class DeleteMessage
 * @extends MessageId
 * @description DTO for deleting a message.
 */
export class DeleteMessage extends MessageId {
  everyOne?: 'true' | 'false';
}

/**
 * @class RejectCallDto
 * @description DTO for rejecting a call.
 */
export class RejectCallDto {
  callId: string;
  callFrom: string;
}

/**
 * @class EditMessage
 * @extends MessageId
 * @description DTO for editing a message.
 */
export class EditMessage extends MessageId {
  text: string;
}
