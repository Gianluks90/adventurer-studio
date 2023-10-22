import { Component } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';
import { MenuService } from 'src/app/services/menu.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.scss']
})
export class CharacterViewComponent {

  public character: any;
  public menuIcon = 'menu';

  constructor(
    private menuService: MenuService,
    private characterService: CharacterService,
    private sidenavService: SidenavService) {}

  ngOnInit(): void {
    const characterId = window.location.href.split('/').pop();
    this.characterService.getCharacterById(characterId).then((character) => {
      this.character = character;
    });
    // this.menuService.hiddenButton = ['bozza','pubblica']
  }

  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }
}
