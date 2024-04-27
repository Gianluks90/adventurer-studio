import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrl: './item-tooltip.component.scss'
})
export class ItemTooltipComponent {

  public itemData: Item = new Item();
  @Input() set item(item: Item) {
    this.itemData = item;
  }

  public getDamagesString(item: Item, formula: string): string {
    if (!formula || formula === '') return '';
    const termini = formula.replace(/\s/g, '').split('+');

    let minimo = 0;
    let massimo = 0;
    termini.forEach(termine => {
      if (termine.includes('d')) {
        const [numDadi, numFacce] = termine.split('d').map(Number);
        minimo += numDadi;
        massimo += numDadi * numFacce;
      } else {
        const costante = parseInt(termine);
        minimo += costante;
        massimo += costante;
      }
    });

    if (minimo === massimo) return `${minimo} danno/i (${item.damageType})`;
    return `${minimo}-${massimo}` + ' danni (' + item.damageType + ')';
  }

  public getPropsString(item: Item): string {
    const result: string[] = [];
    if (item.weaponProperties) {
      const weaponProperties: string[] = item.weaponProperties.map((prop) => {
        if (prop.name === 'lancio' || prop.name === 'gittata') return (prop.name[0].toUpperCase() + prop.name.slice(1)) + ' (' + item.range + ')';
        if (prop.name === 'versatile') return (prop.name[0].toUpperCase() + prop.name.slice(1)) + ' (' + item.versatileDice + ')';
        return prop.name[0].toUpperCase() + prop.name.slice(1);
      });
      result.push(...weaponProperties);
    }
    if (item.traits) {
      const magicTraits: string[] = item.traits.map((trait) => {
        return trait.title[0].toUpperCase() + trait.title.slice(1);
      });
      result.push(...magicTraits);
    }
    if (item.artifactProperties) {
      const artifactProperties: string[] = item.artifactProperties.map((prop) => {
        return prop.title[0].toUpperCase() + prop.title.slice(1);
      });
      result.push(...artifactProperties);
    }
    return result.join(', ');
    // return [...weaponProperties, ...magicTraits, ...artifactProperties].join(', ');
  }

  setColor(rarity: string): string {
    switch (rarity) {
      case 'Comune':
        return '#212121'
        break;
      case 'Non comune':
        return '#00ff01'
        break;
      case 'Raro':
        return '#6d9eeb'
        break;
      case 'Molto raro':
        return '#9a00ff'
        break;
      case 'Leggendario':
        return '#e29138'
        break;
      case 'Unico':
        return '#e06467'
        break;
      case 'Oggetto chiave':
        return '#DDD605'
        break;
      default:
        return '#212121'
        break;
    }
  }
}
