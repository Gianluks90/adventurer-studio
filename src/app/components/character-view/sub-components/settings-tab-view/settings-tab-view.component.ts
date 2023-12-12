import { Component, Input } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-settings-tab-view',
  templateUrl: './settings-tab-view.component.html',
  styleUrl: './settings-tab-view.component.scss'
})
export class SettingsTabViewComponent {

  sheetColorData: string = '';

  constructor(private charService: CharacterService, private formService: FormService) { }
  
  @Input() set sheetColor(sheetColor: string) {
    this.sheetColorData = sheetColor.split('40')[0];
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
    const jsonFile = JSON.stringify(this.formService.formSubject.value.value);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonFile);
    const exportButton = document.getElementById('export-button');
    const characterName = this.formService.formSubject.value.value.informazioniBase.nomePersonaggio.split(' ')[0];
    const fileName = characterName + '_' + (new Date().getTime().toString()) + '.json';
    exportButton.setAttribute("href", dataStr );
    exportButton.setAttribute("download", fileName);
  }
}
