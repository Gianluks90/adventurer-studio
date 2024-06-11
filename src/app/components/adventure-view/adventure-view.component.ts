import { Component, Input } from '@angular/core';
import { Adventure } from '../adventure-editor/models/adventure';
import { MatDialog } from '@angular/material/dialog';
import { AddOrganizationDialogComponent } from '../utilities/npcs/add-organization-dialog/add-organization-dialog.component';
import { AdventureService } from 'src/app/services/adventure.service';

@Component({
  selector: 'app-adventure-view',
  templateUrl: './adventure-view.component.html',
  styleUrl: './adventure-view.component.scss'
})
export class AdventureViewComponent {

  constructor(private dialog: MatDialog, private adventureService: AdventureService) { }

  public adventureData: Adventure | null = null;
  @Input() set adventure(adventure: Adventure) {
    this.adventureData = adventure;
    // this.createSubtitle();
  }

  public editOrg(chapterIndex: number, elementIndex: number, orgIndex: number): void {
    const org = this.adventureData.chapters[chapterIndex].elements[elementIndex].organizations[orgIndex];
    this.dialog.open(AddOrganizationDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      disableClose: true,
      data: { organizations: this.adventureData.chapters[chapterIndex].elements[elementIndex].organizations, organization: org }
    }).afterClosed().subscribe((result: any) => {
      switch (result.status) {
        case 'edited':
          this.adventureData.chapters[chapterIndex].elements[elementIndex].organizations[orgIndex] = result.organization;
          this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
          break;
        case 'deleted':
          this.adventureData.chapters[chapterIndex].elements[elementIndex].organizations.splice(orgIndex, 1);
          this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
          break;
      }
    });
  
  }
}