import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';
import {config} from '../../config';

@Component({
  selector: 'app-join-support-form',
  templateUrl: './join-support-form.component.html',
  styleUrls: ['./join-support-form.component.css']
})
export class JoinSupportFormComponent implements OnInit {
  valid_title:string=''
  valid_dc:string = ''
  user:User;
  constructor(private router: Router, private http: HttpClient,private sharedAuthUserService:SharedAuthUserService, private _elementRef : ElementRef) { }

  ngOnInit(): void {
    
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)

    if(!this.user){
      this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
        // console.log(res)
        if(res){
          this.user = res;
          this.sharedAuthUserService.nextMessage(res)
        }
      }).catch(err=>{
        console.log(err)
        this.router.navigate([''])
      })
    }

  }

  apply(evt){
    var letterNumbersDotRegex = /^[a-zA-Z0-9.!?\s]+$/;
    var letterNumbersRegex = /^[a-zA-Z0-9\s]+$/;
    let data = evt.target.description.value
    let username = evt.target.itemTitle.value
    let validated = true;
    if(!letterNumbersRegex.test(username) || username.length < 5 || username.length > 25){
      validated = false;
      this.valid_title = 'Username nije ispravan'
    }else{
      this.valid_title = ''
    }
    
    if(!letterNumbersDotRegex.test(data) || data.length < 5 || data.length > 150){
      console.log('asd')
      validated = false;
      this.valid_dc = 'CV nije ispravan'
    }else{
      this.valid_dc = ''
    }

    if(validated){
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))

      this.http.post(config.ROOT_URL + '/api/support',{username:username,data:data},{headers:headers}).toPromise().then(
        response=>{
          console.log(response)
          this.router.navigate([''])
        }
      )
    }
  }
}
