/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename sessions.ts                                                        │
 * │ Developed by: Cleber Wilson                                                  │
 * │ Creation date: May 31, 2024                                                  │
 * │ Contact: contato@codechat.dev                                                │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @copyright © Cleber Wilson 2023. All rights reserved.                        │
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
 * │ @type {AuthState}                                                            │
 * │ @function useMultiFileAuthStateRedisDb                                       │
 * │ @returns {Promise<AuthState>}                                                │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import axios, { Axios, AxiosError } from 'axios';
import { Auth, ConfigService, ProviderSession } from '../config/env.config';
import { Logger } from '../config/logger.config';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

type ResponseSuccess = { status: number; data?: any };
type ResponseProvider = Promise<[ResponseSuccess?, Error?]>;

/**
 * @class ProviderFiles
 * @description Provides an interface for interacting with a file-based session provider.
 * This class handles the creation, reading, writing, and deletion of session files.
 */
export class ProviderFiles {
  /**
   * @constructor
   * @param {ConfigService} configService - The configuration service instance.
   */
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(this.configService, ProviderFiles.name);

  private _client: Axios;

  /**
   * @property {Axios} client
   * @description The Axios client for making requests to the file provider.
   */
  public get client() {
    return this._client;
  }

  private readonly config = Object.freeze(
    this.configService.get<ProviderSession>('PROVIDER'),
  );

  /**
   * @property {boolean} isEnabled
   * @description Indicates whether the file provider is enabled.
   */
  get isEnabled() {
    return !!this.config?.ENABLED;
  }

  /**
   * @method onModuleInit
   * @description Initializes the module by connecting to the file provider and setting up the Axios client.
   * If the connection fails, the process will be terminated.
   */
  public async onModuleInit() {
    if (this.config.ENABLED) {
      const url = `http://${this.config.HOST}:${this.config.PORT}`;
      const globalApiToken =
        this.configService.get<Auth>('AUTHENTICATION').GLOBAL_AUTH_TOKEN;

      try {
        const response = await axios.options(url + '/ping');
        if (response?.data != 'pong') {
          throw new Error('Offline file provider.');
        }

        await axios.post(
          `${url}/session`,
          { group: this.config.PREFIX },
          { headers: { apikey: globalApiToken } },
        );
      } catch (error) {
        this.logger.error([
          'Failed to connect to the file server',
          error?.message,
          error?.stack,
        ]);
        const pid = process.pid;
        execSync(`kill -9 ${pid}`);
      }

      this._client = axios.create({
        baseURL: `${url}/session/${this.config.PREFIX}`,
        headers: {
          apikey: globalApiToken,
        },
      });
    }
  }

  /**
   * @method onModuleDestroy
   * @description A lifecycle hook that is called when the module is destroyed.
   */
  public async onModuleDestroy() {
    //
  }

  /**
   * @method create
   * @description Creates a new instance in the file provider.
   * @param {string} instance - The name of the instance to create.
   * @returns {ResponseProvider} A promise that resolves with the response from the provider.
   */
  public async create(instance: string): ResponseProvider {
    try {
      const response = await this._client.post('', { instance });
      return [{ status: response.status, data: response?.data }];
    } catch (error) {
      return [, error];
    }
  }

  /**
   * @method write
   * @description Writes data to a key for a specific instance.
   * @param {string} instance - The instance name.
   * @param {string} key - The key to write to.
   * @param {any} data - The data to write.
   * @returns {ResponseProvider} A promise that resolves with the response from the provider.
   */
  public async write(instance: string, key: string, data: any): ResponseProvider {
    try {
      const response = await this._client.post(`/${instance}/${key}`, data);
      return [{ status: response.status, data: response?.data }];
    } catch (error) {
      return [, error];
    }
  }

  /**
   * @method read
   * @description Reads data from a key for a specific instance.
   * @param {string} instance - The instance name.
   * @param {string} key - The key to read from.
   * @returns {ResponseProvider} A promise that resolves with the response from the provider.
   */
  public async read(instance: string, key: string): ResponseProvider {
    try {
      const response = await this._client.get(`/${instance}/${key}`);
      return [{ status: response.status, data: response?.data }];
    } catch (error) {
      return [, error];
    }
  }

  /**
   * @method delete
   * @description Deletes a key for a specific instance.
   * @param {string} instance - The instance name.
   * @param {string} key - The key to delete.
   * @returns {ResponseProvider} A promise that resolves with the response from the provider.
   */
  public async delete(instance: string, key: string): ResponseProvider {
    try {
      const response = await this._client.delete(`/${instance}/${key}`);
      return [{ status: response.status, data: response?.data }];
    } catch (error) {
      return [, error];
    }
  }

  /**
   * @method allInstances
   * @description Retrieves a list of all instances.
   * @returns {ResponseProvider} A promise that resolves with the list of instances.
   */
  public async allInstances(): ResponseProvider {
    try {
      const response = await this._client.get(`/list-instances`);
      return [{ status: response.status, data: response?.data as string[] }];
    } catch (error) {
      return [, error];
    }
  }

  /**
   * @method removeSession
   * @description Removes an entire session (instance).
   * @param {string} instance - The instance to remove.
   * @returns {ResponseProvider} A promise that resolves with the response from the provider.
   */
  public async removeSession(instance: string): ResponseProvider {
    try {
      const response = await this._client.delete(`/${instance}`);
      return [{ status: response.status, data: response?.data }];
    } catch (error) {
      return [, error];
    }
  }
}
