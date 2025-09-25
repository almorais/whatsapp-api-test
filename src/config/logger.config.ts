/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename logger.config.ts                                                   │
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
 * │ @function formatDateLog @param {Number} timestamp                            │
 * │ @enum {Color} @enum {Command} @enum {Level} @enum {Type} @enum {Background}  │
 * │                                                                              │
 * │ @class                                                                       │
 * │ @constructs Logger @param {String} context                                   │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { LoggerMiddleware } from '../middle/logger.middle';
import { ConfigService, Log } from './env.config';
import dayjs from 'dayjs';

/**
 * @function formatDateLog
 * @description Formats a timestamp into a readable date string.
 * @param {number} timestamp - The timestamp to format.
 * @returns {string} The formatted date string.
 */
const formatDateLog = (timestamp: number) =>
  dayjs(timestamp)
    .toDate()
    .toString()
    .replace(/\sGMT.+/, '');

enum Color {
  LOG = '\x1b[32m',
  INFO = '\x1b[34m',
  WARN = '\x1b[33m',
  ERROR = '\x1b[31m',
  DEBUG = '\x1b[36m',
  VERBOSE = '\x1b[37m',
  DARK = '\x1b[30m',
}

enum Command {
  RESET = '\x1b[0m',
  BRIGHT = '\x1b[1m',
  UNDERSCORE = '\x1b[4m',
}

enum Level {
  LOG = Color.LOG + '%s' + Command.RESET,
  DARK = Color.DARK + '%s' + Command.RESET,
  INFO = Color.INFO + '%s' + Command.RESET,
  WARN = Color.WARN + '%s' + Command.RESET,
  ERROR = Color.ERROR + '%s' + Command.RESET,
  DEBUG = Color.DEBUG + '%s' + Command.RESET,
  VERBOSE = Color.VERBOSE + '%s' + Command.RESET,
}

enum Type {
  LOG = 'LOG',
  WARN = 'WARN',
  INFO = 'INFO',
  DARK = 'DARK',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  VERBOSE = 'VERBOSE',
}

enum Background {
  LOG = '\x1b[42m',
  INFO = '\x1b[44m',
  WARN = '\x1b[43m',
  DARK = '\x1b[40m',
  ERROR = '\x1b[41m',
  DEBUG = '\x1b[46m',
  VERBOSE = '\x1b[47m',
}

/**
 * @class Logger
 * @description A custom logger class for the application.
 * It supports different log levels, contexts, and color-coded output.
 */
export class Logger {
  /**
   * @constructor
   * @param {ConfigService} configService - The configuration service instance.
   * @param {string} [context='Logger'] - The context for the logger.
   */
  constructor(
    private readonly configService: ConfigService,
    private context = 'Logger',
  ) {}

  private subCtx: string;

  /**
   * @method setContext
   * @description Sets the context for the logger.
   * @param {string} value - The context value.
   */
  public setContext(value: string) {
    this.context = value;
  }

  /**
   * @method subContext
   * @description Sets a sub-context for the logger.
   * @param {string} [value] - The sub-context value.
   */
  public subContext(value?: string) {
    if (!value) return (this.subCtx = undefined);
    this.subCtx = value;
  }

  /**
   * @method console
   * @private
   * @description The core logging method. It formats and prints the log message to the console.
   * @param {any} value - The value to log.
   * @param {Type} type - The type of the log.
   * @returns {any} The logged value.
   */
  private console(value: any, type: Type) {
    const types: Type[] = [];

    this.configService.get<Log>('LOG').LEVEL.forEach((level) => types.push(Type[level]));

    const typeValue = typeof value;
    const isObject = typeValue === 'object';

    if (types.includes(type)) {
      if (this.configService.get<Log>('LOG').COLOR) {
        console.log(
          /*Command.UNDERSCORE +*/ Command.BRIGHT + Level[type],
          '[CodeChat]',
          Command.BRIGHT + Color[type],
          process.pid.toString(),
          Command.RESET,
          Command.BRIGHT + Color[type],
          '-',
          Command.BRIGHT + Color.VERBOSE,
          `${formatDateLog(Date.now())}  `,
          Command.RESET,
          Color[type] + Background[type] + Command.BRIGHT,
          `${type} ` + Command.RESET,
          Color.WARN + Command.BRIGHT,
          `[${this.context}]` + Command.RESET,
          Color[type] + Command.BRIGHT,
          `[${this.subCtx || typeValue}]` + Command.RESET,
          Color[type],
          !isObject ? value : '',
          Command.RESET,
        );
        if (isObject) {
          console.log(value, '\n');
        }
      } else {
        console.log(
          '[CodeChat]',
          process.pid.toString(),
          '-',
          `${formatDateLog(Date.now())}  `,
          `${type} `,
          `[${this.context}]`,
          `[${typeValue}]`,
          value,
        );
      }
    }

    return value;
  }

  /**
   * @method log
   * @description Logs a message with the 'LOG' level.
   * @param {T} value - The value to log.
   * @returns {T} The logged value.
   */
  public log<T>(value: T): T {
    return this.console(value, Type.LOG);
  }

  /**
   * @method info
   * @description Logs a message with the 'INFO' level.
   * @param {T} value - The value to log.
   * @returns {T} The logged value.
   */
  public info<T>(value: T): T {
    return this.console(value, Type.INFO);
  }

  /**
   * @method warn
   * @description Logs a message with the 'WARN' level.
   * @param {T} value - The value to log.
   * @returns {T} The logged value.
   */
  public warn<T>(value: T): T {
    return this.console(value, Type.WARN);
  }

  /**
   * @method error
   * @description Logs a message with the 'ERROR' level.
   * @param {T} value - The value to log.
   * @returns {T} The logged value.
   */
  public error<T>(value: T): T {
    return this.console(value, Type.ERROR);
  }

  /**
   * @method verbose
   * @description Logs a message with the 'VERBOSE' level.
   * @param {T} value - The value to log.
   * @returns {T} The logged value.
   */
  public verbose<T>(value: T): T {
    return this.console(value, Type.VERBOSE);
  }

  /**
   * @method debug
   * @description Logs a message with the 'DEBUG' level.
   * @param {T} value - The value to log.
   * @returns {T} The logged value.
   */
  public debug<T>(value: T): T {
    return this.console(value, Type.DEBUG);
  }

  /**
   * @method dark
   * @description Logs a message with the 'DARK' level.
   * @param {T} value - The value to log.
   * @returns {T} The logged value.
   */
  public dark<T>(value: T): T {
    return this.console(value, Type.DARK);
  }
}
