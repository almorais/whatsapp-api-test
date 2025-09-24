/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename instance.controller.ts                                             │
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
 * │ @constructs InstanceController                                               │
 * │ @param {WAMonitoringService} waMonit                                         │
 * │ @param {ConfigService} configService                                         │
 * │ @param {RepositoryBroker} repository                                         │
 * │ @param {EventEmitter2} eventEmitter                                          │
 * │ @param {AuthService} authService                                             │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { delay } from '@whiskeysockets/baileys';
import EventEmitter2 from 'eventemitter2';
import { ConfigService } from '../../config/env.config';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '../../exceptions';
import { InstanceDto } from '../dto/instance.dto';
import { WAMonitoringService } from '../services/monitor.service';
import { Logger } from '../../config/logger.config';
import { Request } from 'express';
import { Repository } from '../../repository/repository.service';
import { InstanceService, OldToken } from '../services/instance.service';
import { WAStartupService } from '../services/whatsapp.service';
import { isString } from 'class-validator';
import { ProviderFiles } from '../../provider/sessions';
import { Websocket } from '../../websocket/server';

/**
 * @class InstanceController
 * @description Controller for handling WhatsApp instances.
 */
export class InstanceController {
  /**
   * @constructor
   * @param {WAMonitoringService} waMonitor - The WhatsApp monitoring service.
   * @param {ConfigService} configService - The configuration service.
   * @param {Repository} repository - The repository for database operations.
   * @param {EventEmitter2} eventEmitter - The event emitter.
   * @param {InstanceService} instanceService - The instance service.
   * @param {ProviderFiles} providerFiles - The provider for session files.
   * @param {Websocket} ws - The WebSocket server.
   */
  constructor(
    private readonly waMonitor: WAMonitoringService,
    private readonly configService: ConfigService,
    private readonly repository: Repository,
    private readonly eventEmitter: EventEmitter2,
    private readonly instanceService: InstanceService,
    private readonly providerFiles: ProviderFiles,
    private readonly ws: Websocket,
  ) {}

  private readonly logger = new Logger(this.configService, InstanceController.name);

  /**
   * @method createInstance
   * @description Creates a new WhatsApp instance.
   * @param {InstanceDto} instance - The instance data.
   * @param {Request} req - The Express request object.
   * @returns {Promise<any>} The created instance data.
   * @throws {InternalServerErrorException} If there is an error creating the session.
   */
  public async createInstance(instance: InstanceDto, req: Request) {
    const created = await this.instanceService.createInstance(instance);
    try {
      req.session[instance.instanceName] = Buffer.from(
        JSON.stringify(created.Auth),
      ).toString('base64');

      return created;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  /**
   * @method reloadConnection
   * @description Reloads the connection for a WhatsApp instance.
   * @param {InstanceDto} instanceDto - The instance data.
   * @returns {Promise<any>} The connection state after reloading.
   */
  public async reloadConnection({ instanceName }: InstanceDto) {
    try {
      const instance = this.waMonitor.waInstances[instanceName];
      const state = instance?.connectionStatus?.state;

      switch (state) {
        case 'open':
          await instance.reloadConnection();
          await delay(2000);
          return await this.connectionState({ instanceName });
        default:
          return await this.connectionState({ instanceName });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * @method connectToWhatsapp
   * @description Connects a WhatsApp instance to WhatsApp.
   * @param {InstanceDto} instanceDto - The instance data.
   * @returns {Promise<any>} The QR code or connection status.
   * @throws {NotFoundException} If the instance is not found.
   * @throws {BadRequestException} If the instance is already connected or there is an error.
   */
  public async connectToWhatsapp({ instanceName }: InstanceDto) {
    const find = await this.repository.instance.findUnique({
      where: { name: instanceName },
    });

    if (!find) {
      throw new NotFoundException('Instance not found');
    }

    try {
      let instance: WAStartupService;
      instance = this.waMonitor.waInstances.get(instanceName);
      const info = instance?.getInstance();
      if (info?.status.state === 'open') {
        throw new Error('Instance already connected');
      }

      const state = info?.status.state || 'close';

      if (!instance || !info?.status || info?.status?.state === 'refused') {
        instance = new WAStartupService(
          this.configService,
          this.eventEmitter,
          this.repository,
          this.providerFiles,
          this.ws,
        );
        await instance.setInstanceName(instanceName);
        this.waMonitor.addInstance(instanceName, instance);
      }

      switch (state) {
        case 'close':
          await instance.connectToWhatsapp();
          await delay(3000);
          return instance.qrCode;
        case 'connecting':
          return instance.qrCode;
        default:
          return info?.status;
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error?.message);
    }
  }

  /**
   * @method updateInstance
   * @description Updates a WhatsApp instance.
   * @param {InstanceDto} instance - The instance data to update.
   * @returns {Promise<any>} The updated instance data.
   * @throws {BadRequestException} If there is an error during the update.
   */
  public async updateInstance(instance: InstanceDto) {
    try {
      const instanceData = await this.instanceService.updateInstance(instance);
      return instanceData;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error?.message);
    }
  }

  /**
   * @method connectionState
   * @deprecated
   * @description Gets the connection state of a WhatsApp instance.
   * @param {InstanceDto} instanceDto - The instance data.
   * @returns {Promise<any>} The connection state.
   */
  public async connectionState({ instanceName }: InstanceDto) {
    const instance = this.waMonitor.waInstances.get(instanceName);
    if (!instance) {
      return {
        state: 'close',
        statusReason: 400,
      };
    }
    return this.waMonitor.waInstances.get(instanceName).getInstance().status;
  }

  /**
   * @method fetchInstance
   * @description Fetches a WhatsApp instance.
   * @param {InstanceDto} instanceDto - The instance data.
   * @returns {Promise<any>} The fetched instance data.
   * @throws {BadRequestException} If the instance is not found.
   */
  public async fetchInstance({ instanceName }: InstanceDto) {
    try {
      const instance = (await this.instanceService.fetchInstance(instanceName))[0];
      if (instance) {
        const i = this.waMonitor.waInstances.get(instanceName);
        if (i) {
          instance['Whatsapp'] = {
            connection: this.waMonitor.waInstances.get(instanceName).getInstance().status,
          };
          return instance;
        }
        instance['Whatsapp'] = {
          connection: {
            state: 'close',
            statusReason: 400,
          },
        };
        return instance;
      }
      throw new Error('Instance not found');
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  /**
   * @method fetchInstances
   * @description Fetches all WhatsApp instances or a specific one.
   * @param {InstanceDto} instanceDto - The instance data (optional).
   * @returns {Promise<any>} The list of instances.
   * @throws {BadRequestException} If instanceName is not a string or the instance is not found.
   */
  public async fetchInstances({ instanceName }: InstanceDto) {
    if (instanceName && !isString(instanceName)) {
      throw new BadRequestException('instanceName must be a string');
    }
    if (instanceName) {
      const i = await this.instanceService.fetchInstance(instanceName);
      if (i.length === 0) {
        throw new BadRequestException('Instance not found');
      }
      return i;
    }

    return await this.instanceService.fetchInstance();
  }

  /**
   * @method logout
   * @description Logs out a WhatsApp instance.
   * @param {InstanceDto} instanceDto - The instance data.
   * @returns {Promise<any>} A confirmation message.
   * @throws {InternalServerErrorException} If there is an error during logout.
   */
  public async logout({ instanceName }: InstanceDto) {
    try {
      await this.waMonitor.waInstances
        .get(instanceName)
        ?.client?.logout('Log out instance: ' + instanceName);
      return { error: false, message: 'Instance logged out' };
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  /**
   * @method deleteInstance
   * @description Deletes a WhatsApp instance.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {boolean} [force] - Whether to force delete the instance.
   * @returns {Promise<any>} The deleted instance data.
   * @throws {BadRequestException} If the instance is still connected.
   */
  public async deleteInstance({ instanceName }: InstanceDto, force?: boolean) {
    const instance = this.waMonitor.waInstances.get(instanceName);
    if (instance && instance.getInstance()?.status?.state === 'open') {
      throw new BadRequestException([
        'Deletion failed',
        'The instance needs to be disconnected',
      ]);
    }

    const del = await this.instanceService.deleteInstance({ instanceName }, force);
    del['deletedAt'] = new Date();
    return del;
  }

  /**
   * @method refreshToken
   * @description Refreshes the authentication token for an instance.
   * @param {InstanceDto} instance - The instance data.
   * @param {OldToken} oldToken - The old token.
   * @param {Request} req - The Express request object.
   * @returns {Promise<void>}
   */
  public async refreshToken(instance: InstanceDto, oldToken: OldToken, req: Request) {
    const token = await this.instanceService.refreshToken(oldToken);

    req.session[instance.instanceName] = Buffer.from(JSON.stringify(token)).toString(
      'base64',
    );
  }
}
