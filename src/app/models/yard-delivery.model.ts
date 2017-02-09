import { Yard } from './yard.model';
import { Status } from './status.model';

export class YardDelivery {
    id: number;
    yardName: string;
    quantity: number;
    status: Status;

    constructor(){
        this.status = new Status();
        this.quantity = 0;
    }
}
