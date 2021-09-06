import { Component, OnInit, Output,EventEmitter} from '@angular/core';
import {config} from '../../config';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {ResponseMessage} from '../models/response'
import { User } from '../models/User';
import {SharedService} from '../services/shared-data-service';
import {SharedAuthUserService} from '../services/auth-user-service'

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  @Output() userEmiter:EventEmitter<User> = new EventEmitter<User>();
  user:User;
  authenticated:boolean;


  constructor(private http: HttpClient, private sharedService:SharedService, private sharedAuthUserService:SharedAuthUserService) { }

  ngOnInit(): void {
    this.sharedService.sharedMessage.subscribe(authenticated => this.authenticated = authenticated)
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
      // console.log(res)
      if(res){
        this.user = res;
        this.userEmiter.emit(this.user)
        console.log(this.user)
        this.authenticated = true;
        this.sharedService.nextMessage(this.authenticated)
        this.sharedAuthUserService.nextMessage(this.user)
      }else{
        this.authenticated = false;
        this.sharedService.nextMessage(false)
        this.sharedAuthUserService.nextMessage(null)
      }
    }).catch(err=>{
      console.log(err)
    })
  }

}
