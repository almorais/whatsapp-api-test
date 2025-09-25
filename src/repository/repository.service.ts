/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename message.model.ts                                                   │
 * │ Developed by: Cleber Wilson                                                  │
 * │ Creation date: Dez 02, 2023                                                  │
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
 * │ @class Repository                                                            │
 * │ @type {ITypebotModel}                                                        │
 * │ @type {CreateLogs}                                                           │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

/**
 * @class Query
 * @template T
 * @description Represents a query object for database operations.
 */
export class Query<T> {
  /**
   * @property {T} where
   * @description The where clause for the query.
   */
  where?: T;
  /**
   * @property {'asc' | 'desc'} sort
   * @description The sort order for the query.
   */
  sort?: 'asc' | 'desc';
  /**
   * @property {number} page
   * @description The page number for pagination.
   */
  page?: number;
  /**
   * @property {number} offset
   * @description The offset for the query.
   */
  offset?: number;
}

import { Prisma, PrismaClient, Webhook } from '@prisma/client';
import { WebhookEvents } from '../whatsapp/dto/webhook.dto';
import { BadRequestException, NotFoundException } from '../exceptions';
import { Logger } from '../config/logger.config';
import { ConfigService, Database } from '../config/env.config';

type CreateLogs = {
  context: string;
  description?: string;
  type: 'error' | 'info' | 'warning' | 'log';
  content: any;
};

/**
 * @class Repository
 * @extends PrismaClient
 * @description A service class that extends the PrismaClient to provide database interaction functionalities.
 * It includes methods for connecting and disconnecting from the database, and for performing CRUD operations.
 */
export class Repository extends PrismaClient {
  /**
   * @constructor
   * @param {ConfigService} configService - The configuration service instance.
   */
  constructor(private readonly configService: ConfigService) {
    super();
  }

  private readonly logger = new Logger(this.configService, Repository.name);

  /**
   * @method onModuleInit
   * @description A lifecycle hook that connects to the database when the module is initialized.
   */
  public async onModuleInit() {
    await this.$connect();
    this.logger.info('Repository:Connected - ON');
  }

  /**
   * @method onModuleDestroy
   * @description A lifecycle hook that disconnects from the database when the module is destroyed.
   */
  public async onModuleDestroy() {
    await this.$disconnect();
    this.logger.warn('Repository:Prisma - OFF');
  }

  /**
   * @method updateWebhook
   * @description Updates a webhook in the database.
   * @param {number} webhookId - The ID of the webhook to update.
   * @param {Partial<Webhook> & { events?: WebhookEvents }} data - The data to update the webhook with.
   * @returns {Promise<any>} A promise that resolves with the updated webhook.
   * @throws {NotFoundException} If the webhook is not found.
   * @throws {BadRequestException} If there is an error during the update.
   */
  public async updateWebhook(
    webhookId: number,
    data: Partial<Webhook> & { events?: WebhookEvents },
  ) {
    const find = await this.webhook.findUnique({
      where: {
        id: webhookId,
      },
    });
    if (!find) {
      throw new NotFoundException(['Webhook not found', `Webhook id: ${webhookId}`]);
    }
    try {
      for await (const [key, value] of Object.entries(data?.events)) {
        if (value === undefined) {
          continue;
        }

        if (!find?.events) {
          break;
        }

        const k = `ARRAY['${key}']`;
        const v = `to_jsonb(${value}::boolean)`;

        await this.$queryRaw(
          Prisma.sql`UPDATE "Webhook" SET events = jsonb_set(events, ${Prisma.raw(
            k,
          )}, ${Prisma.raw(v)}) WHERE id = ${webhookId}`,
        );
      }

      const updated = await this.webhook.update({
        where: {
          id: webhookId,
        },
        data: {
          url: data?.url,
          enabled: data?.enabled,
          events: !find?.events ? data?.events : undefined,
        },
        select: {
          id: true,
          url: true,
          enabled: true,
          events: true,
          instanceId: true,
        },
      });

      return updated;
    } catch (error) {
      throw new BadRequestException([error?.message, error?.stack]);
    }
  }

  /**
   * @method createLogs
   * @description Creates activity logs in the database.
   * @param {string} instance - The instance name.
   * @param {CreateLogs} logs - The log data to create.
   * @returns {Promise<any>} A promise that resolves when the logs are created.
   */
  public async createLogs(instance: string, logs: CreateLogs) {
    if (!this.configService.get<Database>('DATABASE').DB_OPTIONS?.LOGS) {
      return;
    }
    return await this.activityLogs.create({
      data: {
        ...logs,
        Instance: {
          connect: {
            name: instance,
          },
        },
      },
    });
  }
}
