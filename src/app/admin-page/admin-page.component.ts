import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from '../../config';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient,  private sharedAuthUserService:SharedAuthUserService, private _elementRef : ElementRef) { }
  applications:{_id,username,data,status}[] = [];
  loaded:boolean = false;
  item_counts:number[] = [];
  item_names:string[] = []
  user:User;
  page_num:number = 1;
  loop_iteration:number[] = [0,1,2,3] 
  ticket_to_delete:{user_id,issue,data,state};
  max_page_num:number = 10 // edit
  ngOnInit(): void {
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)

    if(!this.user){
      
      this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
        // console.log(res)
        this.sharedAuthUserService.nextMessage(res)

        this.http.get(config.ROOT_URL+ '/api/support/countall',{headers:headers}).toPromise().then((response:{count})=>{
          console.log(response)
          this.max_page_num= Math.ceil(response.count/10);
          this.getApplications()
        }).catch(err=>{console.log(err)})

      }).catch(err=>{
        console.log(err)
        this.router.navigate([''])
      })
    }else{
      this.http.get(config.ROOT_URL+ '/api/support/countall',{headers:headers}).toPromise().then((response:{count})=>{
        console.log(response)
        this.max_page_num= Math.ceil(response.count/10);
        this.getApplications()
      }).catch(err=>{console.log(err)})
    }
  }
  getApplications(){
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.get(config.ROOT_URL+ '/api/support/skip/'+this.page_num,{headers:headers}).toPromise().then((response:Array  <{_id,username,data,status}>)=>{
      console.log(response)
      if(response)
      {
        this.applications = [...response]
        // for(let i =0;i<this.transactions.length;i++){
        //   this.item_counts[i] = 0
        // }
        // for(let i of this.transactions){
        //   let x = i
        //   this.http.get(config.ROOT_URL+'/api/items/count/'+x).toPromise().then((res:{count})=>{
        //     this.item_counts[this.transactions.indexOf(x)] = res.count
        //   }).catch(err=>{
        //     console.log(err)
        //   })
        // }
        this.loaded = true
      }
    }).catch(err=>{
      this.loaded = true
      console.log(err)
    })
  }

  
  navigate(evt,id){
    switch(id){
      case 'first':
        this.page_num = 1
        this.getApplications()
        break;
      case 'previous':
        if(this.page_num>1){
          this.page_num --;
          this.getApplications();
        }
        break;
      case 'last':
        this.page_num = this.max_page_num>0?this.max_page_num:1;
        this.getApplications();
        break;
      case 'next':
        if(this.page_num<this.max_page_num){
          this.page_num++
          this.getApplications();
        }
        break;
      default:
        break;
    }
  }

  outside(evt){
    console.log(evt.target.id)
    if(evt.target.id=='outside'){
      evt.target.style.display='none'
    }
  }

  
  confirmModal(event,conf){
    console.log(conf)
    if(conf==false){
       event.target.parentElement.parentElement.style.display='none'
    }else{
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))
      event.target.parentElement.parentElement.style.display='none'
      this.ticket_to_delete.state = 'canceled'
      // this.http.put(config.ROOT_URL+'/api/transactions/'+this.ticket_to_delete._id,{state:'canceled'},{headers:headers}).toPromise().then((res)=>{
      //   console.log(res)
      // })



      //ovde treba cancel transaction

      // this.http.delete(config.ROOT_URL+'/api/transactions/'+this.trans_to_delete._id).toPromise().then(res=>{
      //   this.transactions = this.transactions.filter((item)=>{
      //     console.log(item._id)
      //     console.log(this.trans_to_delete._id)
      //     return item._id!=this.trans_to_delete._id
      //   })
      //   console.log('Uspesno brisanje')
      // }).catch(err=>{
      //   console.log('greska')
      //})
     
    }
  }

  cancelTransaction(tra){
    this.ticket_to_delete = tra;
    console.log(this.ticket_to_delete)
    let x = this._elementRef.nativeElement.querySelector('#outside')
    // console.log(x)
    x.style.display = "block";  
  }
  accept(evt,ticket){
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.put(config.ROOT_URL+ '/api/support/'+ticket._id+'/accepted',{},{headers:headers}).toPromise().then((response:{msg})=>{
      if(response.msg='OK')
        ticket.status ='accepted'
    }).catch(err=>{
      console.log(err)
    })
  }
  decline(evt,ticket){
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.put(config.ROOT_URL+ '/api/support/'+ticket._id+'/declined',{},{headers:headers}).toPromise().then((response:{msg})=>{
      if(response.msg='OK')
        ticket.status ='accepted'
    }).catch(err=>{
      console.log(err)
    })
  }
}
