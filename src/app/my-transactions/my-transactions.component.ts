import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from '../models/transaction';
import { SharedCategoryService } from '../services/shared-category';
import { config } from 'src/config';
import { SharedAuthUserService } from '../services/auth-user-service';
import { User } from '../models/User';
import { SharedService } from '../services/shared-data-service';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.css']
})
export class MyTransactionsComponent implements OnInit {
  transactions:Transaction[] = [];
  loaded:boolean = false;
  item_counts:number[] = [];
  item_names:string[] = []
  user:User;
  page_num:number = 1;
  loop_iteration:number[] = [0,1,2,3] 
  trans_to_delete:Transaction;
  max_page_num:number = 10 // edit
  constructor(private sharedService:SharedService, private router: Router, private http: HttpClient,  private sharedAuthUserService:SharedAuthUserService, private _elementRef : ElementRef) { }

  ngOnInit(): void {
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    if(!this.user){
      this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
        // console.log(res)
        this.sharedService.nextMessage(true)
        this.sharedAuthUserService.nextMessage(res)

        this.http.get(config.ROOT_URL+ '/api/transactions/buyer/countall/'+this.user._id,{headers:headers}).toPromise().then((response:{count})=>{
          console.log(response)
          this.max_page_num= Math.ceil(response.count/10);
          console.log(this.max_page_num)
          this.getTransactions()
        }).catch(err=>{console.log(err)})
        
      }).catch(err=>{
        console.log(err)
        this.router.navigate([''])
      })
    }
    else{
      this.http.get(config.ROOT_URL+ '/api/transactions/buyer/countall/'+this.user._id,{headers:headers}).toPromise().then((response:{count})=>{
      console.log(response)
      this.max_page_num= Math.ceil(response.count/10);
      console.log(this.max_page_num)
      this.getTransactions()
    }).catch(err=>{console.log(err)})
  }
  }


  getTransactions(){ let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.get(config.ROOT_URL+ '/api/transactions/buyer/skip/'+this.user._id+'/'+this.page_num,{headers:headers}).toPromise().then((response:Array  <Transaction>)=>{
      if(response)
      {
        this.transactions = [...response]
        console.log(this.transactions)
        let count = this.transactions.length
        for(let i of this.transactions){
          let x = i
          this.http.get(config.ROOT_URL+'/api/items/name/'+i.item).toPromise().then((response:{name})=>{
            this.item_names[this.transactions.indexOf(x)] = response.name
            count--;
            if (count == 0)
              this.loaded = true
          })
        }
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
        if(count==0)
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
        this.getTransactions();
        break;
      case 'previous':
        if(this.page_num>1){
          this.page_num --;
          this.getTransactions();
        }
        break;
      case 'last':
        this.page_num = this.max_page_num>0?this.max_page_num:1;
        this.getTransactions();
        break;
      case 'next':
        if(this.page_num<this.max_page_num){
          this.page_num++
          this.getTransactions();
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
      event.target.parentElement.parentElement.style.display='none'
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))
      this.http.delete(config.ROOT_URL+'/api/transactions/'+this.trans_to_delete._id,{headers:headers}).toPromise().then(res=>{
        this.transactions = this.transactions.filter((item)=>{
          console.log(item._id)
          console.log(this.trans_to_delete._id)
          return item._id!=this.trans_to_delete._id
        })
        console.log('Uspesno brisanje')
      }).catch(err=>{
        console.log('greska')
      })
      // this.makeRequest(this.shopItemObserved)
      // let str = localStorage.getItem('items')
      // let arr = str.split(':');
      // let strBuildUp='';
      // for(let item of arr){
      //   let temp = item.split(';')
      //   if(this.trans_to_delete._id!=temp[0]){
      //     if(strBuildUp!='' && arr.length-1>arr.indexOf(item))
      //       strBuildUp+=':'
      //     strBuildUp += item
      //   }else{
      //     this.transactions = this.transactions.filter((item)=>{
      //       console.log(item._id)
      //       console.log(temp[0])
      //       return item._id!=temp[0]
      //     })
      //   }
      // }
    }
  }

  deleteItem(tra){
    this.trans_to_delete = tra;
    console.log(this.trans_to_delete)
    let x = this._elementRef.nativeElement.querySelector('#outside')
    // console.log(x)
    x.style.display = "block";  
  }
}
