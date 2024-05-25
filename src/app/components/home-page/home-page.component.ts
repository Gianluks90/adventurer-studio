import { Component } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  constructor(
    private menuService: MenuService,
    private sidenavService: SidenavService) {}

    public menuIcon = 'menu';
    public showDisclaimer = false;

  ngOnInit(): void {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'close';
    }
    localStorage.getItem('disclaimer') === 'true' ? this.showDisclaimer = true : this.showDisclaimer = false;
  }

  public openSidenav() {
    const menuButton = document.getElementById('menu-button');
    if (this.sidenavService.isOpen()) {
      this.menuIcon = 'menu';
    }
    this.sidenavService.toggle();
  }

  public toggleDisclaimer() {
    this.showDisclaimer = !this.showDisclaimer;
    localStorage.setItem('disclaimer', this.showDisclaimer.toString());
  }
}
