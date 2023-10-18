import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  constructor(
    private menuService: MenuService,
    private sidenavService: SidenavService) {}

    public menuIcon = 'menu';

  ngOnInit(): void {
    // this.menuService.hiddenButton = ['bozza','pubblica','indietro']
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'close';
    }
  }

  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      // menuButton!.style.setProperty('left', 16 + 'px');
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }
}
