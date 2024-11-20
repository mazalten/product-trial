import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button';
import { ProductsService } from 'app/products/data-access/products.service';
import { Product } from 'app/products/data-access/product.model';
import { Cart } from 'app/products/data-access/cart.model';
import { CartService } from 'app/products/data-access/cart.service';

@Component({
    providers: [DialogService, MessageService, ProductsService],
    standalone: true,
    imports: [TableModule, ButtonModule],
    template: `
        <p-table [value]="cart.products" responsiveLayout="scroll" [rows]="5" [responsive]="true">
            <ng-template pTemplate="header">
                <tr>
                    <th pSortableColumn="code">Code</th>
                    <th pSortableColumn="name">Nom</th>
                    <th pSortableColumn="price">Categorie</th>
                    <th pSortableColumn="inventoryStatus">Quantité</th>
                    <th style="width:4em"></th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
                <tr>
                    <td>{{ product.code }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.category }}</td>
                    <td>
                        {{ product.quantity }}
                    </td>
                    <td>
                        <p-button type="button" [text]="true" [rounded]="true" icon="pi pi-minus" (onClick)="removeProduct(product)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>`
})
export class ProductListCard implements OnInit {
    constructor(private cartService: CartService, private dialogService: DialogService, private ref: DynamicDialogRef) { }

    cart!: Cart;

    ngOnInit() {
        this.cart = this.cartService.getCart();
        console.log('Produits du panier:', this.cart.products);
    }

    removeProduct(product: Product) {
        this.cartService.removeFromCart(product.id);
    }

    closeDialog(data: any) {
        this.ref.close(data);
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }
}