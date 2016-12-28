import { Component, OnChanges } from '@angular/core';

import { Delivery } from './shared/delivery.model';
import { DeliveryService } from './shared/delivery.service';
import { Yard } from './shared/yard.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnChanges {
    title = 'WEplus';
    deliveries: Delivery[];
    selectedDelivery: Delivery;
    registeredDeliveries: Delivery[];
    yards: Yard[];
    counter: number;

    constructor(
        private deliveryService: DeliveryService
    ) { }

    createDelivery(): void {
        let newDelivery = this.deliveryService.createDelivery();
        this.selectedDelivery = newDelivery;
        this.deliveries.unshift(newDelivery);
    }

    getDeliveries(): void {
        this.deliveryService.getDeliveries().subscribe((deliveries) => {
            this.deliveries = deliveries;
            this.selectedDelivery = deliveries[0]
        });
    }

    getRegisteredDeliveries(): void {
        this.registeredDeliveries = this.deliveries.filter(this.isNotRegistered);
    }

    getYards(): void {
        this.deliveryService.getYards().subscribe((yards) => { this.yards = yards; });
    }

    ngOnInit() {
        this.getDeliveries();
        this.getYards();
    }

    ngOnChanges() {
        this.getRegisteredDeliveries();
    }

    onSelect(delivery: Delivery): void {
        this.selectedDelivery = delivery;
    }

    private isNotRegistered(delivery): boolean {
        return !delivery.isRegistered;
    }
}
