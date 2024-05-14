import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-description-tooltip',
  templateUrl: './description-tooltip.component.html',
  styleUrl: './description-tooltip.component.scss'
})
export class DescriptionTooltipComponent {

  constructor() { }

  public infoData: any;
  @Input() set info(info: string) {
    this.infoData = this.infos[info];
  }

  private infos: any = {
    // Char View / Status Component
    competenzaTS: {
      title: 'Competenza Tiro Salvezza',
      description: 'Il Personaggio è competente in questo tiro salvezza (viene sommato il bonus competenza).'
    },

    // HealthBar Component
    puntiFerita: {
      title: 'Punti Ferita',
      description: 'I punti ferita rappresentano la salute del Personaggio. Quando i punti ferita scendono a 0 il Personaggio è morente.'
    },
    puntiFeritaTemp: {
      title: 'Punti Ferita Temporanei',
      description: 'I punti ferita temporanei sono punti ferita aggiuntivi che vengono persi prima dei punti ferita normali e non possono essere ricaricati.'
    },

    // Char View / Tab Abilità e Competenze
    competenzaAbilita: {
      title: 'Competenza Abilità',
      description: 'Il Personaggio è competente in questa abilità (viene sommato bonus competenza).'
    },
    maestriaAbilita: {
      title: 'Maestria Abilità',
      description: 'Il Personaggio è maestro in questa abilità (viene sommato, raddoppiato, il bonus di competenza).'
    }
  }
}
