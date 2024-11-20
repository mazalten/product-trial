import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'footer',
    standalone: true,
    imports: [ButtonModule],
    template:  `
        <div class="flex w-full justify-content-end mt-3">
            <p-button type="button" label="Fermer" icon="pi pi-times" (onClick)="closeDialog({ buttonType: 'Cancel' })" />
        </div> `
})
export class Footer {
    constructor(public ref: DynamicDialogRef) {}

    closeDialog(data: any) {
        this.ref.close(data);
    }
}