/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename path.config.ts                                                     │
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
 * │ @constant ROOT_DIR @constant INSTANCE_DIR                                    │
 * │ @constant SRC_DIR  @constant AUTH_DIR                                        │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { join } from 'path';

/**
 * @constant {string} ROOT_DIR
 * @description The root directory of the application.
 */
export const ROOT_DIR = process.cwd();

/**
 * @constant {string} INSTANCE_DIR
 * @description The directory where instances are stored.
 */
export const INSTANCE_DIR = join(ROOT_DIR, 'instances');

/**
 * @constant {string} SRC_DIR
 * @description The source directory of the application.
 */
export const SRC_DIR = join(ROOT_DIR, 'src');

/**
 * @constant {string} AUTH_DIR
 * @description The directory where authentication files are stored.
 */
export const AUTH_DIR = join(ROOT_DIR, 'store', 'auth');

/**
 * @constant {string} TYPEBOT_DIR
 * @description The directory where Typebot files are stored.
 */
export const TYPEBOT_DIR = join(ROOT_DIR, 'store', 'typebot');
