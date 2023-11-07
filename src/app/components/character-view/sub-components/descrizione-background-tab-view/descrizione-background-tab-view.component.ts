import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-descrizione-background-tab-view',
  templateUrl: './descrizione-background-tab-view.component.html',
  styleUrls: ['./descrizione-background-tab-view.component.scss']
})
export class DescrizioneBackgroundTabViewComponent {

  public backgroundNameData: string = '';

  public backgroundData: {
    trattiCaratteriali: string,
    ideali: string,
    legami: string,
    difetti: string,
  };

  public storiaData: string = '';

  public caratteristicheFisicheData: {
    eta: number,
    altezza: number,
    peso: number,
    occhi: string,
    carnagione: string,
    capelli: string,
  };

  constructor() { }

  @Input() set backgroundName(backgroundName: string) {
    this.backgroundNameData = backgroundName;
  }

  @Input() set background(background: any) {
    this.backgroundData = background;
  }

  @Input() set storia(storia: string) {
    this.storiaData = storia;
  }

  @Input() set caratteristicheFisiche(caratteristicheFisiche: any) {
    this.caratteristicheFisicheData = caratteristicheFisiche;
  }
}
