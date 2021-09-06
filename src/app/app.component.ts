import { Component } from '@angular/core';
import { User } from './models/User';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'e-commerce';
  constructor(){
  }

  // getUserFromChild(user){
  //   console.log('ASDASD')
  //   this.user = user;
  //   console.log(this.user)
  // }
}
