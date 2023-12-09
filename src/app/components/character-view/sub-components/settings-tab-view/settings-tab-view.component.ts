import { Component, Input } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-settings-tab-view',
  templateUrl: './settings-tab-view.component.html',
  styleUrl: './settings-tab-view.component.scss'
})
export class SettingsTabViewComponent {

  sheetColorData: string = '';

  constructor(private charService: CharacterService) { }
  
  @Input() set sheetColor(sheetColor: string) {
    console.log('sheetColor', sheetColor);
    
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
}
