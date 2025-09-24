/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ @author jrCleber                                                             │
 * │ @filename group.controller.ts                                                │
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
 * │ @constructs ViewsController                                                  │
 * │ @param {WAMonitoringService} waMonit                                         │
 * ├──────────────────────────────────────────────────────────────────────────────┤
 * │ @important                                                                   │
 * │ For any future changes to the code in this file, it is recommended to        │
 * │ contain, together with the modification, the information of the developer    │
 * │ who changed it and the date of modification.                                 │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import {
  CreateGroupDto,
  GroupJid,
  GroupPictureDto,
  GroupUpdateParticipantDto,
} from '../dto/group.dto';
import { InstanceDto } from '../dto/instance.dto';
import { WAMonitoringService } from '../services/monitor.service';

/**
 * @class GroupController
 * @description Controller for handling group-related operations.
 */
export class GroupController {
  /**
   * @constructor
   * @param {WAMonitoringService} waMonitor - The WhatsApp monitoring service.
   */
  constructor(private readonly waMonitor: WAMonitoringService) {}

  /**
   * @method createGroup
   * @description Creates a new group.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {CreateGroupDto} create - The data for creating the group.
   * @returns {Promise<any>} The result of the group creation.
   */
  public async createGroup({ instanceName }: InstanceDto, create: CreateGroupDto) {
    return await this.waMonitor.waInstances.get(instanceName).createGroup(create);
  }

  /**
   * @method updateGroupPicture
   * @description Updates the group picture.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {GroupPictureDto} update - The data for updating the group picture.
   * @returns {Promise<any>} The result of the update.
   */
  public async updateGroupPicture(
    { instanceName }: InstanceDto,
    update: GroupPictureDto,
  ) {
    return await this.waMonitor.waInstances.get(instanceName).updateGroupPicture(update);
  }

  /**
   * @method findGroupInfo
   * @description Finds group information.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {GroupJid} groupJid - The group JID.
   * @returns {Promise<any>} The group information.
   */
  public async findGroupInfo({ instanceName }: InstanceDto, groupJid: GroupJid) {
    return await this.waMonitor.waInstances.get(instanceName).findGroup(groupJid);
  }

  /**
   * @method allGroups
   * @description Fetches all groups.
   * @param {InstanceDto} instanceDto - The instance data.
   * @returns {Promise<any>} A list of all groups.
   */
  public async allGroups({ instanceName }: InstanceDto) {
    return await this.waMonitor.waInstances.get(instanceName).findAllGroups();
  }

  /**
   * @method inviteCode
   * @description Gets the invite code for a group.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {GroupJid} groupJid - The group JID.
   * @returns {Promise<any>} The invite code.
   */
  public async inviteCode({ instanceName }: InstanceDto, groupJid: GroupJid) {
    return await this.waMonitor.waInstances.get(instanceName).invitationCode(groupJid);
  }

  /**
   * @method revokeInviteCode
   * @description Revokes the invite code for a group.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {GroupJid} groupJid - The group JID.
   * @returns {Promise<any>} The result of the revocation.
   */
  public async revokeInviteCode({ instanceName }: InstanceDto, groupJid: GroupJid) {
    return await this.waMonitor.waInstances
      .get(instanceName)
      .revokeInvitationCode(groupJid);
  }

  /**
   * @method findParticipants
   * @description Finds the participants of a group.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {GroupJid} groupJid - The group JID.
   * @returns {Promise<any>} The list of participants.
   */
  public async findParticipants({ instanceName }: InstanceDto, groupJid: GroupJid) {
    return await this.waMonitor.waInstances.get(instanceName).findParticipants(groupJid);
  }

  /**
   * @method updateGParticipate
   * @description Updates the participants of a group.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {GroupUpdateParticipantDto} update - The data for updating the participants.
   * @returns {Promise<any>} The result of the update.
   */
  public async updateGParticipate(
    { instanceName }: InstanceDto,
    update: GroupUpdateParticipantDto,
  ) {
    return await this.waMonitor.waInstances.get(instanceName).updateGParticipant(update);
  }

  /**
   * @method leaveGroup
   * @description Leaves a group.
   * @param {InstanceDto} instanceDto - The instance data.
   * @param {GroupJid} groupJid - The group JID.
   * @returns {Promise<any>} The result of leaving the group.
   */
  public async leaveGroup({ instanceName }: InstanceDto, groupJid: GroupJid) {
    return await this.waMonitor.waInstances.get(instanceName).leaveGroup(groupJid);
  }
}
