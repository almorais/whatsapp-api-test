/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename chat.controller.ts                                                 │
 * │ Developed by: Cleber Wilson                                                  │
 * │ Creation date: Jul 17, 2022                                                  │
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
 * │ @constructs ChatController                                                   │
 * │ @param {WAMonitoringService} waMonit                                         │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import {
  ArchiveChatDto,
  DeleteMessage,
  NumberDto,
  ReadMessageDto,
  UpdatePresenceDto,
  WhatsAppNumberDto,
  ReadMessageIdDto,
  RejectCallDto,
  EditMessage,
} from '../dto/chat.dto';
import { InstanceDto } from '../dto/instance.dto';
import { WAMonitoringService } from '../services/monitor.service';
import { Query } from '../../repository/repository.service';
import { Contact, Message } from '@prisma/client';

/**
 * @class ChatController
 * @description Controller for handling chat-related operations.
 */
export class ChatController {
  /**
   * @constructor
   * @param {WAMonitoringService} waMonitor - The WhatsApp monitoring service.
   */
  constructor(private readonly waMonitor: WAMonitoringService) {}

  /**
   * @method whatsappNumber
   * @description Checks if a given number is a valid WhatsApp number.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {WhatsAppNumberDto} data - The data containing the number to check.
   * @returns {Promise<any>} The result of the check.
   */
  public async whatsappNumber({ instanceName }: InstanceDto, data: WhatsAppNumberDto) {
    return await this.waMonitor.waInstances.get(instanceName).whatsappNumber(data);
  }

  /**
   * @method readMessage
   * @deprecated
   * @description Marks a message as read.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {ReadMessageDto} data - The data for the message to be marked as read.
   * @returns {Promise<any>} The result of the operation.
   */
  public async readMessage({ instanceName }: InstanceDto, data: ReadMessageDto) {
    return await this.waMonitor.waInstances.get(instanceName).markMessageAsRead(data);
  }

  /**
   * @method readMessagesForId
   * @description Marks multiple messages as read by their IDs.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {ReadMessageIdDto} data - The data containing the message IDs.
   * @returns {Promise<any>} The result of the operation.
   */
  public async readMessagesForId({ instanceName }: InstanceDto, data: ReadMessageIdDto) {
    return await this.waMonitor.waInstances.get(instanceName).readMessages(data);
  }

  /**
   * @method archiveChat
   * @description Archives a chat.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {ArchiveChatDto} data - The data for archiving the chat.
   * @returns {Promise<any>} The result of the operation.
   */
  public async archiveChat({ instanceName }: InstanceDto, data: ArchiveChatDto) {
    return await this.waMonitor.waInstances.get(instanceName).archiveChat(data);
  }

  /**
   * @method deleteChat
   * @description Deletes a chat.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {string} data - The chat ID to delete.
   * @returns {Promise<any>} The result of the operation.
   */
  public async deleteChat({ instanceName }: InstanceDto, data: string) {
    return await this.waMonitor.waInstances.get(instanceName).deleteChat(data);
  }

  /**
   * @method deleteMessage
   * @description Deletes a message.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {DeleteMessage} data - The data for deleting the message.
   * @returns {Promise<any>} The result of the operation.
   */
  public async deleteMessage({ instanceName }: InstanceDto, data: DeleteMessage) {
    return await this.waMonitor.waInstances.get(instanceName).deleteMessage(data);
  }

  /**
   * @method fetchProfilePicture
   * @description Fetches the profile picture of a contact.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {NumberDto} data - The data containing the contact's number.
   * @returns {Promise<any>} The profile picture URL.
   */
  public async fetchProfilePicture({ instanceName }: InstanceDto, data: NumberDto) {
    return await this.waMonitor.waInstances.get(instanceName).profilePicture(data.number);
  }

  /**
   * @method fetchContacts
   * @description Fetches contacts based on a query.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {Query<Contact>} query - The query for fetching contacts.
   * @returns {Promise<any>} The list of contacts.
   */
  public async fetchContacts({ instanceName }: InstanceDto, query: Query<Contact>) {
    return await this.waMonitor.waInstances.get(instanceName).fetchContacts(query);
  }

  /**
   * @method updatePresence
   * @description Updates the presence status.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {UpdatePresenceDto} data - The data for updating the presence.
   * @returns {Promise<any>} The result of the operation.
   */
  public async updatePresence({ instanceName }: InstanceDto, data: UpdatePresenceDto) {
    return await this.waMonitor.waInstances.get(instanceName).updatePresence(data);
  }

  /**
   * @method getBinaryMediaFromMessage
   * @description Gets the binary media from a message.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {Message} message - The message object.
   * @returns {Promise<any>} The binary media data.
   */
  public async getBinaryMediaFromMessage(
    { instanceName }: InstanceDto,
    message: Message,
  ) {
    return await this.waMonitor.waInstances.get(instanceName).getMediaMessage(message);
  }

  /**
   * @method fetchMessages
   * @description Fetches messages based on a query.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {Query<Message>} query - The query for fetching messages.
   * @returns {Promise<any>} The list of messages.
   */
  public async fetchMessages({ instanceName }: InstanceDto, query: Query<Message>) {
    return await this.waMonitor.waInstances.get(instanceName).fetchMessages(query);
  }

  /**
   * @method fetchChats
   * @description Fetches chats.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {string} [type] - The type of chats to fetch.
   * @returns {Promise<any>} The list of chats.
   */
  public async fetchChats({ instanceName }: InstanceDto, type?: string) {
    return await this.waMonitor.waInstances.get(instanceName).fetchChats(type);
  }

  /**
   * @method rejectCall
   * @description Rejects an incoming call.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {RejectCallDto} data - The data for rejecting the call.
   * @returns {Promise<any>} The result of the operation.
   */
  public async rejectCall({ instanceName }: InstanceDto, data: RejectCallDto) {
    return await this.waMonitor.waInstances.get(instanceName).rejectCall(data);
  }

  /**
   * @method assertSessions
   * @description Asserts the existence of sessions.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {WhatsAppNumberDto} data - The data containing the numbers to check.
   * @returns {Promise<any>} The result of the assertion.
   */
  public async assertSessions({ instanceName }: InstanceDto, data: WhatsAppNumberDto) {
    return await this.waMonitor.waInstances
      .get(instanceName)
      .assertSessions(data.numbers);
  }

  /**
   * @method editMessage
   * @description Edits a message.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {EditMessage} data - The data for editing the message.
   * @returns {Promise<any>} The result of the operation.
   */
  public async editMessage({ instanceName }: InstanceDto, data: EditMessage) {
    return await this.waMonitor.waInstances.get(instanceName).editMessage(data);
  }
}
