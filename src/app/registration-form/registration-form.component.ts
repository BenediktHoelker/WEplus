import { Component, OnInit } from '@angular/core';

import { Delivery } from '../shared/delivery.model';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
	delivery = new Delivery();
  constructor() { }

  ngOnInit() {
  }

}