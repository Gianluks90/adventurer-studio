import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditPrivilegioTrattoDialogComponent } from './edit-privilegio-tratto-dialog/edit-privilegio-tratto-dialog.component';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-privilegi-tratti-tab-view',
  templateUrl: './privilegi-tratti-tab-view.component.html',
  styleUrls: ['./privilegi-tratti-tab-view.component.scss']
})
export class PrivilegiTrattiTabViewComponent {

  public charId: string = '';
  public privilegiTrattiData: any[] = [];
  public razzaData: string = '';
  public sottorazzaData: string = '';
  public classiData: any[] = [];
  public tags: string[] = [];
  public isCampaign: boolean = false;
  constructor(private matDialog: MatDialog, private charService: CharacterService) { 
    this.isCampaign = window.location.href.includes('campaign');
  }


  @Input() set character(character: any) {
    this.charId = character.id;
    this.privilegiTrattiData = character.privilegiTratti;
    this.tags = [...new Set(this.privilegiTrattiData.map((privilegioTratto: any) => privilegioTratto.tag.toLowerCase()))];
    this.tags = this.tags.filter((tag: string) => tag !== '').sort();
    this.razzaData = character.informazioniBase.razza;
    this.sottorazzaData = character.informazioniBase.sottorazza;
    this.classiData = character.informazioniBase.classi;
  }

  public openEditDialog(index: number): void {
    this.matDialog.open(EditPrivilegioTrattoDialogComponent, {
      width: window.innerWidth < 600 ? '90%' : '60%',
      autoFocus: false,
      data: {
        privilegioTratto: this.privilegiTrattiData[index],
      }
    }).afterClosed().subscribe((result: any) => {
      if (result && result.status === 'success') {
        this.privilegiTrattiData[index] = result.data;
        this.tags = [...new Set(this.privilegiTrattiData.map((privilegioTratto: any) => privilegioTratto.tag.toLowerCase()))];
        this.tags = this.tags.filter((tag: string) => tag !== '').sort();
        this.charService.updatePrivilegiTratti(this.charId, this.privilegiTrattiData);
      }
    });
  } 

  public collapseAll() {
    const details: NodeListOf<HTMLDetailsElement> = document.querySelectorAll('details');
    details.forEach((detail: HTMLDetailsElement) => {
      if (detail.id !== 'details-t') return;
      detail.open = false;
    });
  }

}
