import { Component } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';
import { MenuService } from 'src/app/services/menu.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.scss']
})
export class CharacterViewComponent {

  public character: any;
  public competenzeAbilita: any;
  public linguaggiCompetenze: any;
  public trucchettiIncantesimi: any;

  // public menuIcon = 'menu';

  constructor(
    private menuService: MenuService,
    private characterService: CharacterService,
    private sidenavService: SidenavService,
    private formService: FormService) { }

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    this.characterService.getCharacterById(characterId).then((character) => {
      this.character = character;
      console.log(this.character);
      
      
      this.competenzeAbilita = {
        abilita: this.character.competenzaAbilita,
        bonusCompetenza: this.character.tiriSalvezza.bonusCompetenza,
        caratteristiche: this.character.caratteristiche
      };

      this.linguaggiCompetenze = {
        linguaggi: this.character.altreCompetenze.linguaggi || [],
        armi: this.character.altreCompetenze.armi || [],
        armature: this.character.altreCompetenze.armature || [],
        strumenti: this.character.altreCompetenze.strumenti || [],
        altro: this.character.altreCompetenze.altro || []
      };

      this.trucchettiIncantesimi = {
        lista: this.character.trucchettiIncantesimi,
        classeIncantatore: this.character.classeIncantatore,
        caratteristicaIncantatore: this.character.caratteristicaIncantatore,
        bonusAttaccoIncantesimi: this.character.bonusAttaccoIncantesimi,
        CD: this.character.CDTiroSalvezza
      }
      
      this.formService.initForm(characterId!); // Un po raffazzonato, va sistemato usando solo il formSubject
    });

  }

  public openSidenav() {
    this.sidenavService.toggle();
  }
}
