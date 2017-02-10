import { Action } from '@ngrx/store';
import { Delivery } from '../models/delivery';
import { Yard } from '../models/yard';
import { type } from '../util';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 * 
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique. 
 */
export const ActionTypes = {
  CREATE_DELIVERY: type('[Delivery] Create'),
  CREATE_DELIVERY_SUCCESS: type('[Delivery] Create Success'),
  CREATE_DELIVERY_FAIL: type('[Delivery] Create Fail'),
  REMOVE_DELIVERY: type('[Delivery] Remove'),
  SELECT_DELIVERY: type('[Delivery] Select'),
  UPDATE_DELIVERY: type('[Delivery] Update'),
  LOAD: type('[Deliveries] Load'),
  LOAD_SUCCESS: type('[Deliveries] Load Success'),
  LOAD_FAIL: type('[Deliveries] Load Fail'),
};


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 * 
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

/**
 * Create Delivery Actions
 */
export class CreateAction implements Action {
  type = ActionTypes.CREATE_DELIVERY;
}

export class CreateSuccessAction implements Action {
  type = ActionTypes.CREATE_DELIVERY_SUCCESS;

  constructor(public payload: { entities: any, result: any }) { }
}

export class CreateFailAction implements Action {
  type = ActionTypes.CREATE_DELIVERY_FAIL;

  constructor(public payload: any) { }
}


export class RemoveDeliveryAction implements Action {
  type = ActionTypes.REMOVE_DELIVERY;

  constructor(public payload: Delivery) { }
}

export class SelectDeliveryAction implements Action {
  type = ActionTypes.SELECT_DELIVERY;

  constructor(public payload: number) { }
}

export class UpdateDeliveryAction implements Action {
  type = ActionTypes.UPDATE_DELIVERY;

  constructor(public payload: Delivery) { }
}

/**
 * Load Deliveries Actions
 */
export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor() { }
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: { entities: any, result: any }) { }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: any) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = CreateAction
  | CreateSuccessAction
  | CreateFailAction
  | RemoveDeliveryAction
  | SelectDeliveryAction
  | UpdateDeliveryAction
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction;
