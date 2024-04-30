import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-manage-equip-dialog',
  templateUrl: './manage-equip-dialog.component.html',
  styleUrl: './manage-equip-dialog.component.scss'
})
export class ManageEquipDialogComponent {

  public form: FormGroup;
  public armorsSelection: Item[] = [];
  public mainHandSelection: Item[] = [];
  public offHandSelection: Item[] = [];
  public othersSelection: Item[] = [];

  public sets: FormArray;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ManageEquipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inventory: Item[], sets: any[] }
  ) {
    this.form = this.fb.group({
      armor: '',
      others: [],
      sets: this.fb.array([])
    });
    this.sets = this.fb.array([]);
  }

  ngOnInit(): void {
    this.armorsSelection = this.data.inventory.filter(item => item.CA > 0 && !item.shield);
    this.form.get('armor').setValue(this.armorsSelection.filter(item => item.weared)[0]);
    
    this.mainHandSelection = this.data.inventory.filter(item => item.damageFormula !== '');
    this.offHandSelection = this.mainHandSelection.concat(this.data.inventory.filter(item => item.CA > 0 && item.shield));
    this.othersSelection = this.data.inventory.filter(item => item.CA === 0 && item.damageFormula === '');
    this.form.get('others').patchValue(this.othersSelection.filter(item => item.weared));
    
    this.sets = this.form.get('sets') as FormArray;
    if (this.data.sets.length > 0) {
        this.data.sets.forEach(set => {
            // Utilizza find per ottenere l'oggetto Item corrispondente ai valori di mainHand e offHand
            const mainHandItem = this.mainHandSelection.find(item => item.name === (set.mainHand ? set.mainHand.name : ''));
            const offHandItem = this.offHandSelection.find(item => item.name === (set.offHand ? set.offHand.name : ''));
            this.sets.push(this.fb.group({
                name: [set.name, Validators.required],
                mainHand: [mainHandItem], // Utilizza direttamente l'oggetto Item
                offHand: [offHandItem], // Utilizza direttamente l'oggetto Item
                dualWield: [set.dualWield] || false,
                versatile: [set.versatile] || false
            }));
        });
    }
  }

  public addSet(): void {
    const set = this.fb.group({
      name: ['', Validators.required],
      mainHand: '',
      offHand: '',
      dualWield: false,
      versatile: false,
    });
    set.get('offHand').disable();
    this.sets.push(set);

    set.get('mainHand').valueChanges.subscribe(value => {
      if (value) {
        set.get('offHand').enable();
      } else {
        set.get('offHand').setValue('');
        set.get('offHand').disable();
      }
    });
  }

  public removeSet(index: number): void {
    this.sets.removeAt(index);
  }

  public resetForm(): void {
    this.form.reset();
    this.sets.clear();
  }

  public confirm(): void {
    const result: any[] = [];
    if (this.form.value.armor) result.push(this.form.value.armor);
    if (this.form.value.others && this.form.value.others.length > 0) result.push(...this.form.value.others);
    // const result: any[] = [this.form.value.armor, ...this.form.value.others];
    result.forEach(item => {
      item.weared = true;
    });
    this.dialogRef.close({
      status: 'success',
      weared: result,
      sets: this.form.value.sets
    });
  }
}
