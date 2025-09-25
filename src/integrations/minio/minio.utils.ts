/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename message.model.ts                                                   │
 * │ Developed by: Cleber Wilson                                                  │
 * │ Creation date: Dez 05, 2023                                                  │
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
 * │ @function bucketExists @function createBucket                                │
 * │ @function getObjectUrl  @function uploadFile                                 │
 * │ @constant minioClient @constant BUCKET                                       │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import * as MinIo from 'minio';
import { join } from 'path';
import { Readable, Transform } from 'stream';
import { BadRequestException } from '../../exceptions';
import { Bucket, ConfigService } from '../../config/env.config';

const BUCKET = new ConfigService().get<Bucket>('S3');

interface Metadata extends MinIo.ItemBucketMetadata {
  'Content-Type': string;
  'custom-header-keyRemoteJid': string;
  'custom-header-pushName': string;
  'custom-header-messageId': string;
  'custom-header-fromMe': string;
  'custom-header-mediaType': string;
}

const minioClient = (() => {
  if (BUCKET?.ENABLE) {
    return new MinIo.Client({
      endPoint: BUCKET.ENDPOINT,
      port: BUCKET.PORT,
      useSSL: BUCKET.USE_SSL,
      accessKey: BUCKET.ACCESS_KEY,
      secretKey: BUCKET.SECRET_KEY,
    });
  }
})();

const bucketName = process.env.S3_BUCKET;

/**
 * @function bucketExists
 * @private
 * @description Checks if the configured S3 bucket exists.
 * @returns {Promise<boolean>} A promise that resolves to true if the bucket exists, false otherwise.
 */
const bucketExists = async () => {
  if (minioClient) {
    try {
      const list = await minioClient.listBuckets();
      return list.find((bucket) => bucket.name === bucketName);
    } catch (error) {
      return false;
    }
  }
};

/**
 * @function createBucket
 * @private
 * @description Creates the S3 bucket if it does not already exist.
 * @returns {Promise<boolean>} A promise that resolves to true if the bucket is created or already exists, false otherwise.
 */
const createBucket = async () => {
  if (minioClient) {
    try {
      const exists = await bucketExists();
      if (!exists) {
        await minioClient.makeBucket(bucketName);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
};

createBucket();

/**
 * @function uploadFile
 * @description Uploads a file to the S3 bucket.
 * @param {string} fileName - The name of the file to upload.
 * @param {Buffer | Transform | Readable} file - The file content as a buffer, transform stream, or readable stream.
 * @param {number} size - The size of the file.
 * @param {Metadata} metadata - The metadata for the file.
 * @returns {Promise<any>} A promise that resolves with the result of the upload operation.
 */
const uploadFile = async (
  fileName: string,
  file: Buffer | Transform | Readable,
  size: number,
  metadata: Metadata,
) => {
  if (minioClient) {
    const objectName = join('codechat_v1', fileName);
    try {
      metadata['custom-header-application'] = 'codechat-api-v1';
      const o = await minioClient.putObject(bucketName, objectName, file, size, metadata);

      await minioClient.setObjectTagging(
        bucketName,
        objectName,
        {
          mediaType: metadata['custom-header-mediaType'],
          application: metadata['custom-header-application'],
          sender: metadata['custom-header-keyRemoteJid'],
          contentType: metadata['Content-Type'],
          fromMe: metadata['custom-header-fromMe'],
        },
        { versionId: '_1""' },
      );
      return o;
    } catch (error) {
      console.log('ERROR: ', error);
      return error;
    }
  }
};

/**
 * @function getObjectUrl
 * @description Generates a presigned URL for an object in the S3 bucket.
 * @param {string} fileName - The name of the file.
 * @param {number} [expiry] - The expiry time for the URL in seconds.
 * @returns {Promise<string>} A promise that resolves to the presigned URL.
 * @throws {BadRequestException} If there is an error generating the URL.
 */
const getObjectUrl = async (fileName: string, expiry?: number) => {
  if (minioClient) {
    try {
      const objectName = join('codechat_v1', fileName);
      if (expiry) {
        return await minioClient.presignedGetObject(bucketName, objectName, expiry);
      }
      return await minioClient.presignedGetObject(bucketName, objectName);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
};

export { uploadFile, getObjectUrl, BUCKET };