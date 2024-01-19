import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-settings-tab-view',
  templateUrl: './settings-tab-view.component.html',
  styleUrl: './settings-tab-view.component.scss'
})
export class SettingsTabViewComponent {

  public sheetColorData: string = '';
  public campaignIdData: string = '';
  public campaignData: any;

  constructor(private charService: CharacterService, private formService: FormService, private campaignService: CampaignService, private router: Router) { }
  
  @Input() set sheetColor(sheetColor: string) {
    this.sheetColorData = sheetColor.split('40')[0];
  }

  @Input() set campaignId(id: string) {
    this.campaignIdData = id;
    if (this.campaignIdData !== '') {
      this.campaignService.getCampaignById(this.campaignIdData).then((data) => {
        this.campaignData = data;
        console.log(this.campaignData);
        
      });
    }
  }

  public updateSheetColor(event: any) {
    const newColor = event + '40';
    this.charService.updateCharacterSheetColorById(window.location.href.split('/').pop()!, newColor).then(() => {
      window.location.reload();
    });
  }

  public resetColor() {
    this.charService.updateCharacterSheetColorById(window.location.href.split('/').pop()!, '#FFFFFF40').then(() => {
      window.location.reload();
    });
  }

  public parseExport() {
    const formValue = this.formService.formSubject.value.value;
    formValue.informazioniBase.urlImmaginePersonaggio = '';
    formValue.informazioniBase.nomeImmaginePersonaggio = '';
    const jsonFile = JSON.stringify(this.formService.formSubject.value.value);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonFile);
    const exportButton = document.getElementById('export-button');
    const characterName = this.formService.formSubject.value.value.informazioniBase.nomePersonaggio.split(' ')[0];
    const fileName = characterName + '_' + (new Date().getTime().toString()) + '.json';
    exportButton.setAttribute("href", dataStr );
    exportButton.setAttribute("download", fileName);
  }

  public jumpToCampaign(id: string) {
    this.router.navigate(['/campaign-view/' + this.campaignIdData]);
  }
}
