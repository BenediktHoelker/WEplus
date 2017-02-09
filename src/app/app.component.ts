import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MdSidenav } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { Delivery } from './models/delivery.model';
import { DeviationType } from './models/deviation-type.model';
import { Filter } from './models/filter.model';
import { FilterGroup } from './models/filter-group.model';
import { Yard } from './models/yard.model';

import { normalize } from 'normalizr';
import { deliverySchema, deviationTypeSchema, yardSchema } from './models/schemas';
import { DeliveryDetailComponent } from './containers/delivery-detail';
import { DeliveryService } from './shared/delivery.service';
import {
  ADD_DEVIATION_TYPES, ADD_YARDS,
  CREATE_DELIVERY, REMOVE_DELIVERY, SELECT_DELIVERY, UPDATE_DELIVERY,
  CREATE_YARD, FILTER_LOCATION, SELECT_YARD,
  ADD_FILTERS, ADD_FILTER_GROUPS, SELECT_FILTER,
  FILTER_DEVIATION_TYPE, SHOW_ALL_D, SHOW_WITH_DEVIATION, SHOW_WITHOUT_DEVIATION,
  SHOW_ALL_P, SHOW_PROCESSED, SHOW_NOT_PROCESSED,
  SHOW_ALL_R, SHOW_REGISTERED, SHOW_NOT_REGISTERED,
  ADD_STATUSSES
} from './reducers/actions';

import * as fromRoot from './reducers';
import * as delivery from './actions/delivery';
import * as deviation from './actions/deviation';
import * as deviationTypes from './actions/deviation-type';
import * as filter from './actions/filter';
import * as status from './actions/status';
import * as yardDelivery from './actions/yard-delivery';
import * as yard from './actions/yard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "WEPLUS";
  @ViewChild(DeliveryDetailComponent) private detailComponent: DeliveryDetailComponent;
  @ViewChild('sidenav') sidenav: MdSidenav;

  private filtersVisible: boolean;
  private isLoading: boolean;
  private subscription;
  private yardDeliveries = [];
  private model$: Observable<any>;

  constructor(
    private deliveryService: DeliveryService,
    private store: Store<fromRoot.State>
  ) {
    const processingPayload = {
      result: [0, 1, 2],
      name: "Processing",
      filterEntities: [
        { id: 0, friendly: "All", actionType: SHOW_ALL_P },
        { id: 1, friendly: "Processed", actionType: SHOW_PROCESSED },
        { id: 2, friendly: "Not Processed", actionType: SHOW_NOT_PROCESSED }],
      selectedFilterId: 0
    };
    this.store.dispatch(new filter.LoadSuccessAction(processingPayload));

    const registrationPayload = {
      result: [0, 1, 2],
      name: "Registration",
      filterEntities: [
        { id: 0, friendly: "All", actionType: SHOW_ALL_R },
        { id: 1, friendly: "Registered", actionType: SHOW_REGISTERED },
        { id: 2, friendly: "Not Registered", actionType: SHOW_NOT_REGISTERED }],
      selectedFilterId: 0
    };
    this.store.dispatch(new filter.LoadSuccessAction(registrationPayload));

    const deviationPayload = {
      result: [0, 1, 2],
      name: "Deviation",
      filterEntities: [
        { id: 0, friendly: "All", actionType: SHOW_ALL_D },
        { id: 1, friendly: "Deviation", actionType: SHOW_WITH_DEVIATION },
        { id: 2, friendly: "No Deviation", actionType: SHOW_WITHOUT_DEVIATION }],
      selectedFilterId: 0
    };
    this.store.dispatch(new filter.LoadSuccessAction(deviationPayload));

    const locationPayload = {
      result: [0, 1, 2],
      name: "Location",
      filterEntities: [
        { id: 0, friendly: "All", actionType: FILTER_LOCATION, payload: "All" },
        { id: 1, friendly: "Yard 1", actionType: FILTER_LOCATION, payload: "Yard 1" },
        { id: 2, friendly: "Yard 2", actionType: FILTER_LOCATION, payload: "Yard 2" },
        { id: 3, friendly: "Yard 3", actionType: FILTER_LOCATION, payload: "Yard 3" }],
    selectedFilterId: 0
  };
    this.store.dispatch(new filter.LoadSuccessAction(locationPayload));

this.model$ = Observable.combineLatest(
  this.store.select(fromRoot.getFilterGroups),
  (filterGroups) => {
    return {
      filterGroups
    }
  });
  }

ngOnInit() {
  this.filtersVisible = true;
}

createDelivery(): void {
  this.selectDelivery();
  this.store.dispatch({ type: CREATE_DELIVERY, payload: { yardDeliveries: this.yardDeliveries } });
  this.detailComponent.newDeliveryFocusEventEmitter.emit(true);
}

openSidenav(): void {
  this.sidenav.open();
}

toggleFilters(): void {
  this.filtersVisible = !this.filtersVisible;
}

removeDelivery(delivery: Delivery) {
  this.selectDelivery();
  if (delivery.id) {
    this.deliveryService.removeDelivery(delivery)
      .subscribe(response => { this.store.dispatch({ type: REMOVE_DELIVERY, payload: delivery }); });
  }
  else {
    this.store.dispatch({ type: REMOVE_DELIVERY, payload: delivery });
  }
}

/*If no delivery is passed, the first delivery in the store is selected (c.f. constructor of AppComponent)*/
selectDelivery(delivery ?: Delivery) {
  this.store.dispatch({ type: SELECT_DELIVERY, payload: delivery });
}


updateFilter(filterGroup) {
  // this.selectDelivery();
  // this.store.dispatch({
  //   type: SELECT_FILTER,
  //   payload: { type: filterGroup.type, selectedFilterId: filterGroup.selectedFilterId }
  // });
  const filter = filterGroup.filterEntities[filterGroup.selectedFilterId];
  this.store.dispatch({ type: filter.actionType, payload: filter.payload });
}

updateYardFilter(yard: Yard) {
  this.selectDelivery();
  this.store.dispatch({ type: SELECT_YARD, payload: yard });
  this.store.dispatch({ type: FILTER_LOCATION, payload: yard });
}
}
