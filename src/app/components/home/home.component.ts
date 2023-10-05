import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.hiddenButton = ['bozza','pubblica','indietro']
  }
}
