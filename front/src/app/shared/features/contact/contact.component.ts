import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  EventEmitter,
  Output,
} from "@angular/core";
import { Contact } from "app/products/data-access/contact.model";
import { FormsModule } from "@angular/forms";
import { CardModule } from 'primeng/card';
import { MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  standalone: true,
  imports: [RouterLink, ButtonModule, InputTextModule, InputTextareaModule, FormsModule, CardModule, ToastModule],
})
export class ContactComponent {

  constructor(private messageService: MessageService) { }

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<Contact>();

  newContact(): Contact {
    return {
      mail: '',
      message: ''
    };
  }

  onCancel() {
    this.cancel.emit();
  }

  onSave() {
    this.messageService.add({ severity: 'success', summary: 'Succés', detail: 'Demande de contact envoyée avec succès' });
  }
}
