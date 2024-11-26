import {
    Component,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { BadgeModule } from 'primeng/badge';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { ProductListCard } from "./products/ui/product-card/productlistCard";
import { MessageService } from "primeng/api";
import { Footer } from "./products/ui/product-card/footer";
import { CartService } from "./products/data-access/cart.service";
import { Subscription } from "rxjs";
import { AuthService } from "./services/auth.service";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    standalone: true,
    imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, BadgeModule, CommonModule, ButtonModule],
})
export class AppComponent {
    title = "ALTEN SHOP";

    constructor(public dialogService: DialogService, public messageService: MessageService, public cartService: CartService, private authService : AuthService, private router: Router) { }

    ref: DynamicDialogRef | undefined;
    totalQuantity: number = 0;
    private cartSubscription: Subscription = new Subscription;
    isAuthenticated: boolean = false;

    ngOnInit(): void {
        this.cartSubscription = this.cartService.getCartObservable().subscribe((cart) => {
            this.totalQuantity = this.cartService.getTotalQuantity();
        });
        this.isAuthenticated = this.authService.isLoggedIn();
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

    logout(): void {
        this.authService.logout();  // Efface le token
        this.isAuthenticated = false;  // Met à jour l'état d'authentification
        this.router.navigate(['/login']);  // Redirige vers la page de connexion
      }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }
}
