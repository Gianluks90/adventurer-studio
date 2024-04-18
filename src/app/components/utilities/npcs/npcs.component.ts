import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NPC } from 'src/app/models/npcModel';
import { CharacterService } from 'src/app/services/character.service';
import { AddNpcDialogComponent } from './add-npc-dialog/add-npc-dialog.component';
import { AddOrganizationDialogComponent } from './add-organization-dialog/add-organization-dialog.component';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
  selector: 'app-npcs',
  templateUrl: './npcs.component.html',
  styleUrl: './npcs.component.scss'
})
export class NpcsComponent {

  public npcsData: NPC[] = [];
  public adddonsData: any[] = [];
  public organizationsData: any[] = [];
  public isTab: boolean = false;
  public isDM: boolean = false;
  public isOwner: boolean = false;
  public isCampaign: boolean = false;
  public isCharacterPage: boolean = false;
  public addonTimer: any = null;

  constructor(
    private dialog: MatDialog,
    private charService: CharacterService,
    private campaignService: CampaignService) {
    this.isCampaign = window.location.href.includes('campaign-view') || false;
    this.isCharacterPage = window.location.href.includes('character-view') || false;
  }

  @Input() set npcs(npcs: any[]) {
    this.npcsData = npcs;
    this.sortNpcs();
  }

  @Input() set addons(addons: any[]) {
    this.adddonsData = addons;
    this.sortAddons();
  }

  @Input() set organizations(organizations: any[]) {
    this.organizationsData = organizations;
  }

  @Input() set tab(tab: boolean) {
    this.isTab = tab;
  }

  @Input() set isCampaignOwner(isOwner: boolean) {
    this.isOwner = isOwner;
  }

  @Input() set dm(isDM: boolean) {
    this.isDM = isDM;
  }

  public openAddNpcDialog(npc?: any, index?: number, isTab?: boolean) {
    this.dialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { npcs: this.npcsData, npc: npc, isTab: isTab }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          if (!this.isCampaign) {
            this.charService.addAlly(window.location.href.split('/').pop(), result.npc).then(() => {
              this.npcsData.push(NPC.fromData(result.npc));
              this.sortNpcs();
            });
          } else {
            this.campaignService.addAlly(window.location.href.split('/').pop(), result.npc).then(() => {
              // this.npcsData.push(NPC.fromData(result.npc));
              this.sortNpcs();
            });
          }
          break;
        case 'edited':
          this.calcModifiers(result.npc);
          this.npcsData[index] = result.npc;
          if (!this.isCampaign) {
            this.charService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          } else {
            this.campaignService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          }
          // this.charService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          break;
        case 'deleted':
          this.npcsData.splice(index, 1);
          if (!this.isCampaign) {
            this.charService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          } else {
            this.campaignService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          }
          // this.charService.updateAllies(window.location.href.split('/').pop(), this.npcsData);
          break;
      }
    });
  }

  public openAddonDialog(addon?: any, index?: number) {
    this.dialog.open(AddNpcDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { npcs: this.adddonsData, npc: addon, isTab: true }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          if (!this.isCampaign) {
            this.charService.addAddon(window.location.href.split('/').pop(), result.npc).then(() => {
              this.adddonsData.push(NPC.fromData(result.npc));
              this.sortAddons();
            });
          } else {
            this.campaignService.addAddon(window.location.href.split('/').pop(), result.npc).then(() => {
              // this.adddonsData.push(NPC.fromData(result.npc));
              this.sortAddons();
            });
          }
          break;
        case 'edited':
          this.calcModifiers(result.npc);
          this.adddonsData[index] = result.npc;
          if (!this.isCampaign) {
            this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          } else {
            this.campaignService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          }
          // this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          break;
        case 'deleted':
          this.adddonsData.splice(index, 1);
          if (!this.isCampaign) {
            this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          } else {
            this.campaignService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          }
          // this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
          break;
      }
    });
  }

  public openAddOrganizationDialog(organization?: any, index?: number) {
    this.dialog.open(AddOrganizationDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { organizations: this.organizationsData, organization: organization }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'success':
          if (!this.isCampaign) {
            this.charService.addOrganization(window.location.href.split('/').pop(), result.organization).then(() => {
              this.organizationsData.push(result.organization);
            });
          } else {
            this.campaignService.addOrganization(window.location.href.split('/').pop(), result.organization).then(() => {
              // this.organizationsData.push(result.organization);
            });
          }
          // this.charService.addOrganization(window.location.href.split('/').pop(), result.organization).then(() => {
          //   this.organizationsData.push(result.organization);
          // });
          break;
        case 'edited':
          this.organizationsData[index] = result.organization;
          if (!this.isCampaign) {
            this.charService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          } else {
            this.campaignService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          }
          // this.charService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          break;
        case 'deleted':
          this.organizationsData.splice(index, 1);
          if (!this.isCampaign) {
            this.charService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          } else {
            this.campaignService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          }
          // this.charService.updateOrganizations(window.location.href.split('/').pop(), this.organizationsData);
          break;
      }
    });
  }

  filterSearch(event: any) {
    const filter = event.target.value.toLowerCase().trim();
    this.adddonsData = this.adddonsData.map((item) => {
      return {
        ...item, filtered: !item.name.toLowerCase().includes(filter)
      }
    });
  }

  private sortNpcs() {
    this.npcsData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  private sortAddons() {
    this.adddonsData.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  private calcModifiers(npc: NPC) {
    npc.strengthMod = Math.floor((npc.strength - 10) / 2);
    npc.dexterityMod = Math.floor((npc.dexterity - 10) / 2);
    npc.constitutionMod = Math.floor((npc.constitution - 10) / 2);
    npc.intelligenceMod = Math.floor((npc.intelligence - 10) / 2);
    npc.wisdomMod = Math.floor((npc.wisdom - 10) / 2);
    npc.charismaMod = Math.floor((npc.charisma - 10) / 2);
  }

  // public updateNpcHP(action: string, index: number) {
  //   switch (action) {
  //     case 'add':
  //       this.adddonsData[index].HP = this.adddonsData[index].HP + 1 > this.adddonsData[index].HPmax ? this.adddonsData[index].HPmax : this.adddonsData[index].HP + 1;
  //       break;
  //     case 'sub':
  //       this.adddonsData[index].HP = this.adddonsData[index].HP - 1 < 0 ? 0 : this.adddonsData[index].HP - 1;
  //       break;
  //     default:
  //       break;
  //   }
  // }

  public updateNpcHP(action: string, index: number) {
    if (this.addonTimer) {
      clearTimeout(this.addonTimer);
    }
    switch (action) {
      case 'add':
        this.adddonsData[index].HP = this.adddonsData[index].HP + 1 > this.adddonsData[index].HPmax ? this.adddonsData[index].HPmax : this.adddonsData[index].HP + 1;
        break;
      case 'sub':
        this.adddonsData[index].HP = this.adddonsData[index].HP - 1 < 0 ? 0 : this.adddonsData[index].HP - 1;
        break;
      default:
        break;
    }
    this.addonTimer = setTimeout(() => {
      this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
      this.addonTimer = null;
    }, 3000);
  }

  public fullRestore(index: number) {
    this.adddonsData[index].HP = this.adddonsData[index].HPmax;
    this.charService.updateAddons(window.location.href.split('/').pop(), this.adddonsData);
  }

}
