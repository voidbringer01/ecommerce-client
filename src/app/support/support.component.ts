import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';
import {config} from '../../config'
import { Router } from '@angular/router';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  loaded:boolean = true;
  page_num:number = 1;
  tickets:string[] = [];
  valid_dc:string =''
  valid_title:string = ''
  max_page_num:number = 10 // edit
  user:User;
  success_msg: string;
  status_of_app:string='';
  constructor(private sharedAuthUserService:SharedAuthUserService, private http:HttpClient, private router:Router) { }

  ngOnInit(): void {

    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
      // console.log(res)
      if(res){
        this.user = res;
        this.sharedAuthUserService.nextMessage(this.user)

        this.http.get(config.ROOT_URL+'/api/support/'+res.username,{headers:headers}).toPromise().then((res2:string)=>{
         
          this.status_of_app = res2
        })

        this.http.get(config.ROOT_URL+ '/api/tickets/countall/'+this.user._id,{headers:headers}).toPromise().then((response:{count})=>{
          this.max_page_num= Math.ceil(response.count/10);
          this.getTickets()
        }).catch(err=>{console.log(err)})
        this.http.get(config.ROOT_URL+'/api/tickets/')
      }
    }).catch(err=>{
      console.log(err)
    })



  }
  getTickets(){
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.get(config.ROOT_URL+ '/api/tickets/skip/'+this.page_num+'/'+this.user._id,{headers:headers}).toPromise().then((response:Array  <string>)=>{
      if(response)
      {

        this.tickets = [...response]
        this.loaded = true
        console.log(this.tickets)
        
      }
    }).catch(err=>{
      console.log(err)
    })
  }

  navigate(evt,id){
    switch(id){
      case 'first':
        this.page_num = 1
        this.getTickets();
        break;
      case 'previous':
        if(this.page_num>1){
          this.page_num --;
          this.getTickets();
        }
        break;
      case 'last':
        this.page_num = this.max_page_num;
        this.getTickets();
        break;
      case 'next':
        if(this.page_num<this.max_page_num){
          this.page_num++
          this.getTickets();
        }
        break;
      default:
        break;
    }
  }

  onChange(evt){

  }
  apply(){
    if(this.user)
      this.router.navigate(['submit-app'])
    else
      this.router.navigate(['login'])
  }
  submitTicket(evt){
    console.log(evt.target.itemTitle.value)
    console.log(evt.target.description.value)
    let title = evt.target.itemTitle.value
    let dcs = evt.target.description.value
    let user_id = this.user._id
    let validated = true

    var letterNumbersRegex = /^[a-zA-Z0-9\s]+$/;
    var letterNumbersDotRegex = /^[a-zA-Z0-9.!?\s]+$/;
    
    if(!letterNumbersRegex.test(title) || title.length < 4 || title.length >25){
      validated = false
      this.valid_title = 'Title nije dobar.'
    }else{
      this.valid_title = ''
    }
    if(!letterNumbersDotRegex.test(dcs) || dcs.length < 5 || dcs.length >50){
      validated = false
      this.valid_dc = 'Description nije dobar.'
    }else{
      this.valid_dc = ''
    }
    if(validated){
      
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))
      this.http.post(config.ROOT_URL + '/api/tickets',{user_id:user_id,issue:title,data:dcs},{headers:headers}).toPromise().then(
        response=>{
          console.log(response)
          this.success_msg = 'Uspesno ste popunili tiket.'
          setTimeout(()=>{window.location.reload()},1500)
        }
      )
    }
  }
}
