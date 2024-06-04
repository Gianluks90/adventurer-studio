import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-campaign-encounter-tab',
  templateUrl: './campaign-encounter-tab.component.html',
  styleUrls: ['./campaign-encounter-tab.component.scss']
})
export class CampaignEncounterTabComponent {

  public form: FormGroup;
  public selectedAddons: any[] = [];

  public charData: any[] = [];
  @Input() set characters(characters: any[]) {
    this.charData = characters;
    if (!this.charData) return;
    if (this.form) {
      this.form.patchValue({ characters: this.charData });
    }
  }

  public addonsData: any;
  @Input() set campaign(campaign: any) {
    this.addonsData = campaign.addons;
    if (!this.addonsData) return;
  }

  public isOwnerData: boolean = false;
  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner || false;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      characters: [[], [Validators.required, Validators.minLength(1)]],
      addons: this.fb.array([], Validators.required)
    });
  }

  ngOnInit() {
    if (this.charData.length > 0) {
      this.form.get('characters')?.setValue(this.charData);
    }
  }

  get addons(): FormArray {
    return this.form.get('addons') as FormArray;
  }

  private addEnemy(addon: any) {
    const group = this.fb.group({
      addon: [addon, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.addons.push(group);
    this.selectedAddons.push(addon); // Aggiungi l'addon ai selezionati
  }

  public removeEnemy(index: number) {
    const removedAddon = this.addons.at(index).value.addon;
    this.addons.removeAt(index);
    this.selectedAddons = this.selectedAddons.filter(addon => addon !== removedAddon); // Rimuovi l'addon dai selezionati
  }

  public onAddonSelectionChange(event: any) {
    const selectedAddons = event.value;
    const currentAddons = this.getSelectedAddons();
  
    selectedAddons.forEach((addon: any) => {
      if (!currentAddons.includes(addon)) {
        this.addEnemy(addon);
      }
    });
  
    currentAddons.forEach((addon: any, index: number) => {
      if (!selectedAddons.includes(addon)) {
        this.removeEnemy(index);
      }
    });
  }
  
  private getSelectedAddons(): any[] {
    return this.addons.value.map((e: any) => e.addon);
  }
}
