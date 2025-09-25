/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename sendMessage.controller.ts                                          │
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
 * │ @constructs SendMessageController                                            │
 * │ @param {WAMonitoringService} waMonit                                         │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { isBase64, isNumberString, isURL } from 'class-validator';
import { BadRequestException } from '../../exceptions';
import { InstanceDto } from '../dto/instance.dto';
import {
  AudioMessageFileDto,
  MediaFileDto,
  SendAudioDto,
  SendButtonsDto,
  SendContactDto,
  SendLinkDto,
  SendListDto,
  SendListLegacyDto,
  SendLocationDto,
  SendMediaDto,
  SendReactionDto,
  SendTextDto,
} from '../dto/sendMessage.dto';
import { WAMonitoringService } from '../services/monitor.service';

/**
 * @class SendMessageController
 * @description Controller for sending various types of messages.
 */
export class SendMessageController {
  /**
   * @constructor
   * @param {WAMonitoringService} waMonitor - The WhatsApp monitoring service.
   */
  constructor(private readonly waMonitor: WAMonitoringService) {}

  /**
   * @method sendText
   * @description Sends a text message.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendTextDto} data - The text message data.
   * @returns {Promise<any>} The result of the send operation.
   */
  public async sendText({ instanceName }: InstanceDto, data: SendTextDto) {
    return await this.waMonitor.waInstances.get(instanceName).textMessage(data);
  }

  /**
   * @method sendMedia
   * @description Sends a media message from a URL.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendMediaDto} data - The media message data.
   * @returns {Promise<any>} The result of the send operation.
   * @throws {BadRequestException} If the media is base64 or if fileName is missing for documents.
   */
  public async sendMedia({ instanceName }: InstanceDto, data: SendMediaDto) {
    if (isBase64(data?.mediaMessage?.media)) {
      throw new BadRequestException('Owned media must be a url');
    }
    if (data.mediaMessage.mediatype === 'document' && !data.mediaMessage?.fileName) {
      throw new BadRequestException(
        'The "fileName" property must be provided for documents',
      );
    }
    if (isURL(data?.mediaMessage?.media as string)) {
      return await this.waMonitor.waInstances.get(instanceName).mediaMessage(data);
    }
  }

  /**
   * @method sendMediaFile
   * @description Sends a media message from a file.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {MediaFileDto} data - The media file data.
   * @param {string} fileName - The name of the file.
   * @returns {Promise<any>} The result of the send operation.
   * @throws {BadRequestException} If the delay is not an integer.
   */
  public async sendMediaFile(
    { instanceName }: InstanceDto,
    data: MediaFileDto,
    fileName: string,
  ) {
    if (data?.delay && !isNumberString(data.delay)) {
      throw new BadRequestException('The "delay" property must have an integer.');
    } else {
      data.delay = Number.parseInt(data?.delay as never);
    }
    return await this.waMonitor.waInstances
      .get(instanceName)
      .mediaFileMessage(data, fileName);
  }

  /**
   * @method sendWhatsAppAudio
   * @description Sends a WhatsApp audio message from a URL.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendAudioDto} data - The audio message data.
   * @returns {Promise<any>} The result of the send operation.
   * @throws {BadRequestException} If the audio is base64 or not a valid URL.
   */
  public async sendWhatsAppAudio({ instanceName }: InstanceDto, data: SendAudioDto) {
    if (isBase64(data?.audioMessage.audio)) {
      throw new BadRequestException('Owned media must be a url');
    }
    if (!isURL(data.audioMessage.audio, { protocols: ['http', 'https'] })) {
      throw new BadRequestException('Unknown error');
    }

    return await this.waMonitor.waInstances.get(instanceName).audioWhatsapp(data);
  }

  /**
   * @method sendWhatsAppAudioFile
   * @description Sends a WhatsApp audio message from a file.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {AudioMessageFileDto} data - The audio file data.
   * @param {string} fileName - The name of the file.
   * @returns {Promise<any>} The result of the send operation.
   * @throws {BadRequestException} If the delay is not an integer.
   */
  public async sendWhatsAppAudioFile(
    { instanceName }: InstanceDto,
    data: AudioMessageFileDto,
    fileName: string,
  ) {
    if (data?.delay && !isNumberString(data.delay)) {
      throw new BadRequestException('The "delay" property must have an integer.');
    } else {
      data.delay = Number.parseInt(data?.delay as never);
    }
    if (data?.convertAudio) {
      data.convertAudio = data.convertAudio === 'true';
    }
    return await this.waMonitor.waInstances
      .get(instanceName)
      .audioWhatsAppFile(data, fileName);
  }

  /**
   * @method sendLocation
   * @description Sends a location message.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendLocationDto} data - The location message data.
   * @returns {Promise<any>} The result of the send operation.
   */
  public async sendLocation({ instanceName }: InstanceDto, data: SendLocationDto) {
    return await this.waMonitor.waInstances.get(instanceName).locationMessage(data);
  }

  /**
   * @method sendContact
   * @description Sends a contact message.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendContactDto} data - The contact message data.
   * @returns {Promise<any>} The result of the send operation.
   */
  public async sendContact({ instanceName }: InstanceDto, data: SendContactDto) {
    return await this.waMonitor.waInstances.get(instanceName).contactMessage(data);
  }

  /**
   * @method sendReaction
   * @description Sends a reaction to a message.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendReactionDto} data - The reaction message data.
   * @returns {Promise<any>} The result of the send operation.
   * @throws {BadRequestException} If the reaction is not an emoji.
   */
  public async sendReaction({ instanceName }: InstanceDto, data: SendReactionDto) {
    if (!data.reactionMessage.reaction.match(/[^\(\)\w\sà-ú"-\+]+/)) {
      throw new BadRequestException('"reaction" must be an emoji');
    }
    return await this.waMonitor.waInstances.get(instanceName).reactionMessage(data);
  }

  /**
   * @method sendButtons
   * @description Sends a message with buttons.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendButtonsDto} data - The buttons message data.
   * @returns {Promise<any>} The result of the send operation.
   */
  public async sendButtons({ instanceName }: InstanceDto, data: SendButtonsDto) {
    return await this.waMonitor.waInstances.get(instanceName).buttonsMessage(data);
  }

  /**
   * @method sendList
   * @description Sends a list message.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendListDto} data - The list message data.
   * @returns {Promise<any>} The result of the send operation.
   */
  public async sendList({ instanceName }: InstanceDto, data: SendListDto) {
    return await this.waMonitor.waInstances.get(instanceName).listButtons(data);
  }

  /**
   * @method sendListLegacy
   * @description Sends a legacy list message.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendListLegacyDto} data - The legacy list message data.
   * @returns {Promise<any>} The result of the send operation.
   */
  public async sendListLegacy({ instanceName }: InstanceDto, data: SendListLegacyDto) {
    return await this.waMonitor.waInstances.get(instanceName).listLegacy(data);
  }

  /**
   * @method sendLinkPreview
   * @description Sends a link with a preview.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {SendLinkDto} data - The link message data.
   * @returns {Promise<any>} The result of the send operation.
   */
  public async sendLinkPreview({ instanceName }: InstanceDto, data: SendLinkDto) {
    return await this.waMonitor.waInstances.get(instanceName).linkMessage(data);
  }
}
