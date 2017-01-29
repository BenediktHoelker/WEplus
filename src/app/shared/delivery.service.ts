import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { Delivery } from '../models/delivery.model';
import { Deviation } from '../models/deviation.model';
import { DeviationType } from '../models/deviation-type.model';
import { Status } from '../models/status.model';
import { Yard } from '../models/yard.model';
import { YardDelivery } from '../models/yard-delivery.model';

const deliveriesUrl = 'http://localhost:3000/api/deliveries';
const deviationTypesUrl = 'http://localhost:3000/api/deviationTypes';
const yardsUrl = 'http://localhost:3000/api/yards';

// const deliveriesUrl = 'https://weplus-api.herokuapp.com/api/deliveries';
// const deviationTypesUrl = 'https://weplus-api.herokuapp.com/api/deviationTypes';
// const yardsUrl = 'https://weplus-api.herokuapp.com/api/yards';

@Injectable()
export class DeliveryService {
  private headers = this.createHeaders('application/json');
  private options = this.createRequestOptions(this.headers);

  constructor(private http: Http) { }

  createHeaders(contentType: string): Headers {
    return new Headers({ 'Content-Type': contentType });
  }

  createYardDelivery(yard: Yard): YardDelivery {
    let newYardDelivery = new YardDelivery();
    newYardDelivery.yard = yard;
    return newYardDelivery;
  }

  createDeviation(): Deviation {
    return new Deviation();
  }

  createRequestOptions(headers: Headers, search?: URLSearchParams): RequestOptions {
    return new RequestOptions({ headers: headers, search: search });
  }

  getDeliveries(): Observable<Delivery[]> {
    return this.http.get(deliveriesUrl)
      .map(res => res.json().map(
        delivery => {
          console.log(delivery);
          let newDelivery = Object.assign(new Delivery(), delivery);
          let newYardDeliveries = [];
          let newYardDelivery;
          let status;
          newDelivery.status = Object.assign(new Status(), delivery.status);
          delivery.yardDeliveries.map(yardDelivery => {
            newYardDelivery = yardDelivery;
            newYardDelivery.status = Object.assign(new Status(), yardDelivery.status);
            newYardDeliveries.push(newYardDelivery);
            console.log(yardDelivery);
          });
          newDelivery.yardDeliveries = newYardDeliveries;
          return newDelivery;
        })) //Object.assign for converting to JSON to Delivery instance
      .catch(this.handleError);
  }
  // newYardDelivery.status = Object.assign(new Status(), delivery.yardDeliveries.filter(
  //   oldYardDelivery => { console.log(oldYardDelivery.status) }));
  // oldYardDelivery => { oldYardDelivery.yard._id === newYardDelivery.yard._id)[0].status});

  getYards(): Observable<Yard[]> {
    return this.http.get(yardsUrl)
      .map(res => res.json() as Yard[])
      .catch(this.handleError);
  }

  getDeviationTypes(): Observable<DeviationType[]> {
    return this.http.get(deviationTypesUrl)
      .map(res => res.json() as DeviationType[])
      .catch(this.handleError);
  }

  removeDelivery(deliveryToBeRemoved: Delivery): Observable<Delivery> {
    let params = new URLSearchParams();
    let headers = new Headers();
    params.set('_id', deliveryToBeRemoved._id.toString());
    headers.append('Content-Type', 'x-www-form-encoded');

    let options = this.createRequestOptions(headers, params)
    return this.http.delete(deliveriesUrl, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  removeDeviation(deviationToBeRemoved: Deviation, deviations: Deviation[]): Deviation[] {
    let index = deviations.indexOf(deviationToBeRemoved, 0);
    if (index > -1) {
      deviations.splice(index, 1);
    }
    return deviations;
  }

  submitDelivery(deliveryToBeSubmitted: Delivery): Observable<Delivery> {
    return this.http.post(deliveriesUrl, deliveryToBeSubmitted, this.options)
      .map(res => {
        let newDelivery = Object.assign(new Delivery(), res.json);
        newDelivery.status = Object.assign(new Status(), res.json().status);
        let newYardDeliveries = [];
        let newYardDelivery;
        res.json().yardDeliveries.map(yardDelivery => {
          newYardDelivery = yardDelivery;
          newYardDelivery.status = Object.assign(new Status(), yardDelivery.status);
          newYardDeliveries.push(newYardDelivery);
        });
        newDelivery.yardDeliveries = newYardDeliveries;
        return newDelivery;
      });
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}

