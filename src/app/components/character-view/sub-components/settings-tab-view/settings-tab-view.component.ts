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

  public charData: any;
  public sheetColorData: string = '';
  public campaignIdData: string = '';
  public campaignData: any;

  constructor(private charService: CharacterService, private formService: FormService, private campaignService: CampaignService, private router: Router) { }
  
  // @Input() set sheetColor(sheetColor: string) {
  //   this.sheetColorData = sheetColor.split('40')[0];
  // }

  @Input() set character(character: any) {
    this.charData = character;
    this.sheetColorData = character.status.sheetColor.split('40')[0];
    this.campaignIdData = character.campaignId;
    if (this.campaignIdData !== '') {
      this.campaignService.getCampaignById(this.campaignIdData).then((data) => {
        this.campaignData = data;
      });
    }
  }

  public updateSheetColor(event: any) {
    const newColor = event + '40';
    this.charService.updateCharacterSheetColorById(window.location.href.split('/').pop()!, newColor).then(() => {
      // window.location.reload();
    });
  }

  public resetColor() {
    this.charService.updateCharacterSheetColorById(window.location.href.split('/').pop()!, '#FFFFFF40').then(() => {
      // window.location.reload();
    });
  }

  public toggleWeightRule(event: any) {
    this.charService.updateWeightRule(window.location.href.split('/').pop()!, event.checked);
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

  exportPDF() {
    console.log("Solo per tester");
    
    // const endpoint = "https://fastapi-production-6b43.up.railway.app/api/schedabase/";
    // fetch(endpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(this.formService.formSubject.value.value),
    //   redirect: 'follow'
    // }).then(res => {
    //   return res.blob();
    // }).then(blob => {
    //   var a = document.createElement("a");
    //   a.href = window.URL.createObjectURL(blob);
    //   a.download = this.formService.formSubject.value.value.informazioniBase.nomePersonaggio.split(' ')[0] + '.pdf';
    //   document.body.appendChild(a);
    //   a.click();
    // });
  }

  public jumpToCampaign(id: string) {
    this.router.navigate(['/campaign-view/' + this.campaignIdData]);
  }
}
