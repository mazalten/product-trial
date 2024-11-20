import {
  Component,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { BadgeModule } from 'primeng/badge';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { ProductListCard } from "./products/ui/product-card/productlistdemo";
import { MessageService } from "primeng/api";
import { Footer } from "./products/ui/product-card/footer";
import { CartService } from "./products/data-access/cart.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, BadgeModule],
})
export class AppComponent{
  title = "ALTEN SHOP";

  constructor(public dialogService: DialogService, public messageService: MessageService, public cartService : CartService) {}

    ref: DynamicDialogRef | undefined;
    totalQuantity: number = 0;
    private cartSubscription: Subscription = new Subscription;

    ngOnInit(): void {
      // Récupérer la somme des quantités dès que le composant est initialisé
      this.cartSubscription = this.cartService.getCartObservable().subscribe((cart) => {
        this.totalQuantity = this.cartService.getTotalQuantity();  // Mettre à jour la somme des quantités
      });
            console.log('Somme des quantités:', this.totalQuantity);
    }

    public showCart() {
        this.ref = this.dialogService.open(ProductListCard, {
            header: 'Panier',
            width: '50vw',
            contentStyle: { overflow: 'auto' },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            templates: {
                footer: Footer
            }
        });

        this.ref.onClose.subscribe((data: any) => {
            let summary_and_detail;
            if (data) {
                const buttonType = data?.buttonType;
                summary_and_detail = buttonType ? { summary: 'No Product Selected', detail: `Pressed '${buttonType}' button` } : { summary: 'Product Selected', detail: data?.name };
            } else {
                summary_and_detail = { summary: 'No Product Selected', detail: 'Pressed Close button' };
            }
            this.messageService.add({ severity: 'info', ...summary_and_detail, life: 3000 });
        });

        this.ref.onMaximize.subscribe((value) => {
            this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
        });
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }
}
