import { Component } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {

  public character: any;

  constructor(
    private menuService: MenuService,
    private characterService: CharacterService) {}

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    this.characterService.getCharacterById(characterId).then((character) => {
      this.character = character;
      console.log('C', this.character);
    });
    this.menuService.hiddenButton = ['bozza','pubblica']
  }
}
