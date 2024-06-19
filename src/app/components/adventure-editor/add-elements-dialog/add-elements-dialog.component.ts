import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewAdventureChapterDialogComponent } from '../new-adventure-chapter-dialog/new-adventure-chapter-dialog.component';

@Component({
  selector: 'app-add-elements-dialog',
  templateUrl: './add-elements-dialog.component.html',
  styleUrl: './add-elements-dialog.component.scss'
})
export class AddElementsDialogComponent {

  public mockTitle: string = 'Lorem ipsum';
  public mockDescription: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies.';
  public list: FormArray | null = null;
  public rows: FormArray | null = null;
  public enemies: FormArray | null = null;

  public form: FormGroup | null;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NewAdventureChapterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { element: any, resources: any }) {
    this.form = this.fb.group({
      id: this.randomId(),
      type: ['', Validators.required],
      bookmarked: false
    });

    console.log(this.data.resources);

    if (this.data.element) {
      switch (this.data.element.type) {
        case 'title':
          this.form.addControl('text', this.fb.control('', [Validators.required, Validators.minLength(3)]));
          this.form.addControl('color', this.fb.control('#212121'));
          break;
        case 'subtitle':
          this.form.addControl('text', this.fb.control('', [Validators.required, Validators.minLength(3)]));
          this.form.addControl('color', this.fb.control('#212121'));
          break;
        case 'simple-text':
          this.form.addControl('text', this.fb.control('', Validators.required));
          break;
        case 'descriptive-text':
          this.form.addControl('text', this.fb.control('', Validators.required));
          this.form.addControl('textColor', this.fb.control('#212121'));
          this.form.addControl('backgroundColor', this.fb.control('#6dbbef'));
          break;
        case 'note':
          this.form.addControl('title', this.fb.control('', Validators.required));
          this.form.addControl('text', this.fb.control('', Validators.required));
          this.form.addControl('textColor', this.fb.control('#212121'));
          this.form.addControl('backgroundColor', this.fb.control('#6def98'));
          break;
        case 'list':
          this.form.addControl('items', this.fb.array([]));
          this.form.addControl('bulleted', this.fb.control(false));
          this.list = this.form.get('items') as FormArray;
          this.data.element.items.forEach((item: any) => {
            const listItem = this.fb.group({
              id: item.id,
              title: item.title,
              text: item.text
            });
            this.list?.push(listItem);
          });
          this.form?.get('bulleted')?.valueChanges.subscribe((value) => {
            if (value) {
              this.list?.controls.forEach((control) => {
                control.get('title')?.clearValidators();
                control.get('title')?.updateValueAndValidity();
              });
            } else {
              this.list?.controls.forEach((control) => {
                control.get('title')?.setValidators([Validators.required]);
                control.get('title')?.updateValueAndValidity();
              });
            }
          });
          break;
        case 'image':
          this.form.addControl('src', this.fb.control('', Validators.required));
          this.form.addControl('caption', this.fb.control(''));
          break;
        case 'table':
          this.form.addControl('header_left', this.fb.control('', Validators.required));
          this.form.addControl('header_left_width', this.fb.control(''));
          this.form.addControl('header_right', this.fb.control('', Validators.required));
          this.form.addControl('rows', this.fb.array([]));
          this.form.addControl('caption', this.fb.control(''));
          this.rows = this.form.get('rows') as FormArray;
          this.data.element.rows.forEach((row: any) => {
            const tableRow = this.fb.group({
              id: row.id,
              left: row.left,
              right: row.right
            });
            this.rows?.push(tableRow);
          });
          break;
        case 'skill-check':
          this.form?.addControl('cd', this.fb.control('', Validators.required));
          this.form?.addControl('skill', this.fb.control('', Validators.required));
          this.form?.addControl('success', this.fb.control('', Validators.required));
          this.form?.addControl('criticalSuccess', this.fb.control(''));
          this.form?.addControl('failure', this.fb.control('', Validators.required));
          this.form?.addControl('criticalFailure', this.fb.control(''));
          break;
        case 'organization':
          this.form.addControl('organizations', this.fb.control([], Validators.required));
          break;
        case 'npc':
          this.form.addControl('npcs', this.fb.control([], Validators.required));
          break;
        case 'addon':
          this.form.addControl('addon', this.fb.control('', Validators.required));
          break;
        case 'encounter':
          this.form?.addControl('enemies', this.fb.array([]));
          this.enemies = this.form.get('enemies') as FormArray;
          break;
      }
      this.form.patchValue(this.data.element);
    }

    this.form.get('type')?.valueChanges.subscribe((value) => {
      this.cleanFormGroup(this.form, ['id', 'type', 'bookmarked']);
      switch (value) {
        case 'title':
          this.form?.addControl('text', this.fb.control('', [Validators.required, Validators.minLength(3)]));
          this.form?.addControl('color', this.fb.control('#212121'));
          break;
        case 'subtitle':
          this.form?.addControl('text', this.fb.control('', [Validators.required, Validators.minLength(3)]));
          this.form?.addControl('color', this.fb.control('#212121'));
          break;
        case 'simple-text':
          this.form?.addControl('text', this.fb.control('', Validators.required));
          break;
        case 'descriptive-text':
          this.form?.addControl('text', this.fb.control('', Validators.required));
          this.form?.addControl('textColor', this.fb.control('#212121'));
          this.form?.addControl('backgroundColor', this.fb.control('#6dbbef'));
          break;
        case 'note':
          this.form?.addControl('title', this.fb.control('', Validators.required));
          this.form?.addControl('text', this.fb.control('', Validators.required));
          this.form?.addControl('textColor', this.fb.control('#212121'));
          this.form?.addControl('backgroundColor', this.fb.control('#FFFF00'));
          break;
        case 'list':
          this.form?.addControl('items', this.fb.array([]));
          this.form?.addControl('bulleted', this.fb.control(false));
          this.list = this.form.get('items') as FormArray;
          break;
        case 'image':
          this.form?.addControl('src', this.fb.control('', Validators.required));
          this.form?.addControl('caption', this.fb.control(''));
          break;
        case 'table':
          this.form?.addControl('header_left', this.fb.control('', Validators.required));
          this.form?.addControl('header_left_width', this.fb.control(''));
          this.form?.addControl('header_right', this.fb.control('', Validators.required));
          this.form?.addControl('rows', this.fb.array([]));
          this.form?.addControl('caption', this.fb.control(''));
          this.rows = this.form.get('rows') as FormArray;
          break;
        case 'skill-check':
          this.form?.addControl('cd', this.fb.control('', Validators.required));
          this.form?.addControl('skill', this.fb.control('', Validators.required));
          this.form?.addControl('success', this.fb.control('', Validators.required));
          this.form?.addControl('criticalSuccess', this.fb.control(''));
          this.form?.addControl('failure', this.fb.control('', Validators.required));
          this.form?.addControl('criticalFailure', this.fb.control(''));
          break;
        case 'organization':
          this.form?.addControl('organizations', this.fb.control([], Validators.required));
          break;
        case 'npc':
          this.form?.addControl('npcs', this.fb.control([], Validators.required));
          break;
        case 'addon':
          this.form?.addControl('addons', this.fb.control('', Validators.required));
          break;
        case 'encounter':
          this.form?.addControl('enemies', this.fb.array([]));
          this.enemies = this.form.get('enemies') as FormArray;
          break;
      }
    });
  }

  private cleanFormGroup(formGroup: FormGroup, controlsToKeep: string[]): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (!controlsToKeep.includes(key)) {
        formGroup.removeControl(key);
      }
    });
    this.list = null;
  }

  private randomId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public addListItem(): void {
    const item = this.fb.group({
      id: this.randomId(),
      title: ['', Validators.required],
      text: ['', Validators.required]
    });
    this.list?.push(item);

    if (this.form.value.bulleted) {
      this.list?.controls.forEach((control) => {
        control.get('title')?.clearValidators();
        control.get('title')?.updateValueAndValidity();
      });
    }

    this.form?.get('bulleted')?.valueChanges.subscribe((value) => {
      if (value) {
        this.list?.controls.forEach((control) => {
          control.get('title')?.clearValidators();
          control.get('title')?.updateValueAndValidity();
        });
      } else {
        this.list?.controls.forEach((control) => {
          control.get('title')?.setValidators([Validators.required]);
          control.get('title')?.updateValueAndValidity();
        });
      }
    });
  }

  public removeListItem(index: number): void {
    this.list?.removeAt(index);
  }

  public addTableRow(): void {
    const row = this.fb.group({
      id: this.randomId(),
      left: ['', Validators.required],
      right: ['', Validators.required]
    });
    this.rows?.push(row);
  }

  public removeTableRow(index: number): void {
    this.rows?.removeAt(index);
  }

  public resetWidth(): void {
    this.form?.get('header_left_width')?.setValue('');
  }

  public selectedAddons: any[] = [];
  // get addons(): FormArray {
  //   return this.form.get('enemies') as FormArray;
  // }

  private addEnemy(addon: any) {
    const group = this.fb.group({
      addon: [addon, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.enemies.push(group);
    this.selectedAddons.push(addon); // Aggiungi l'addon ai selezionati
  }

  public removeEnemy(index: number) {
    const removedAddon = this.enemies.at(index).value.addon;
    this.enemies.removeAt(index);
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
    return this.enemies.value.map((e: any) => e.addon);
  }

  public confirm(): void {
    this.dialogRef.close({ status: this.data.element ? 'edited' : 'success', element: this.form.value });
  }
}
