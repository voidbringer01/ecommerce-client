import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopItem } from '../models/ShopItem';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';
import {config} from '../../config';
import { SharedShopItemService } from '../services/shop-item-service';
import { HeaderCardCountService } from '../services/header-cart-count-service';
import { SharedService } from '../services/shared-data-service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  query:string;
  user:User;
  shopItems:ShopItem[] = [];
  loaded:boolean = false;
  // shopItemObserved:ShopItem = null;
  // observedCategory:string;
  shopItemToDelete:ShopItem;
  root_url:string;
  shopItemsIds:string[] = []
  shopItemsCount:number[] = []
  showSuccess:boolean = false;
  valid_title:string = ''
  constructor(private sharedService:SharedService,private sharedAuthUserService: SharedAuthUserService, private router: Router, private http: HttpClient, private _elementRef : ElementRef, private sharedShopItemService:SharedShopItemService, private headerCardCountService:HeaderCardCountService) { }

  ngOnInit(): void {
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.root_url = config.ROOT_URL+'/'
    this.getItemsFromStorage()
    this.shopItems = new Array(this.shopItemsIds.length)
    for(let id of this.shopItemsIds){
      let x = id
      this.http.get(config.ROOT_URL+'/api/items/id/'+x).toPromise().then((res:ShopItem)=>{
        console.log(res)
        this.shopItems[this.shopItemsIds.indexOf(x)] = res
        // console.log(res)
        // console.log(this.shopItems))
          this.loaded = true
          console.log(this.shopItems)
      })
    }
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    if(!this.user){
        // private sharedService:SharedService
      this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
        // console.log(res)
        this.sharedService.nextMessage(true)
        this.sharedAuthUserService.nextMessage(res)
      }).catch(err=>{
        console.log(err)
        this.router.navigate([''])
      })
    }
   
  }

  getItemsFromStorage(){
    let str = localStorage.getItem('items')
    if(str){
      let items = str.split(':')
      for(let item of items){
        let temp = item.split(';')
        this.shopItemsIds.push(temp[0])
        this.shopItemsCount.push(Number.parseInt(temp[1]))
      } 
      console.log(this.shopItemsIds)
    }
  }

  previewItem(shopitem){
    this.sharedShopItemService.nextMessage(shopitem)
    this.router.navigate(['/shop-item'])
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
      // this.makeRequest(this.shopItemObserved)
      let str = localStorage.getItem('items')
      let arr = str.split(':');
      let strBuildUp='';
      for(let item of arr){
        let temp = item.split(';')
        if(this.shopItemToDelete._id!=temp[0]){
          if(strBuildUp!='' && arr.length-1>arr.indexOf(item))
            strBuildUp+=':'
          strBuildUp += item
        }else{
          this.shopItems = this.shopItems.filter((item)=>{
            console.log(item._id)
            console.log(temp[0])
            return item._id!=temp[0]
          })
        }
      }
      
      localStorage.removeItem('items')
      if(strBuildUp!=''){
        localStorage.setItem('items',strBuildUp)
      }
      console.log(strBuildUp)
      console.log('make request')

    if(localStorage.getItem('items')!=null){
      let spl = localStorage.getItem('items').split(':')
      this.headerCardCountService.nextMessage(spl.length)
    }else
      this.headerCardCountService.nextMessage(0)
    }
  }

  deleteItem(shopItem:ShopItem){
    // let cnfm = confirm('Da li stvarno zelite da izbrisite ovaj item?')
    this.shopItemToDelete = shopItem;
    let x = this._elementRef.nativeElement.querySelector('#outside')
    // console.log(x)
    x.style.display = "block";  
  }

  checkout(){
    // console.log(this.user._id)
    let adress = this._elementRef.nativeElement.querySelector('#shipping-adress')
    console.log(adress)
    if(adress.value.length>0){
      this.valid_title = ''
      let data:{buyer,seller,buyerAddress,item,amount}[] = [];
      // add if user
      // data.buyer = this.user._id
      // data.buyerAddress = adress.value

      let itemAmount = this._elementRef.nativeElement.querySelectorAll('.quantity')
      console.log(itemAmount)
      
      for(let i =0;i<this.shopItems.length;i++){
        let temp:{buyer,seller,buyerAddress,item,amount} = {} as {buyer,seller,buyerAddress,item,amount};
        temp.buyer = this.user._id
        temp.buyerAddress = adress.value
        temp.amount = itemAmount[i].value
        // temp.seller = 
        temp.item = this.shopItems[i]._id
        temp.seller = this.shopItems[i].userName
        if(temp.amount>0)
          data.push(temp)
      }
      console.log(data)
      // seller
      // item
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))
      for(let item of data){
        this.http.post(config.ROOT_URL+'/api/transactions',{...item},{headers:headers}).toPromise().then((res:{msg})=>{
          // console.log(res)
          if(res.msg=='OK'){
            localStorage.removeItem('items')
            this.showSuccess = true;
            setTimeout((asd)=>{
              this.shopItems = []
              this.headerCardCountService.nextMessage(0)
              this.router.navigate(['/my-transactions'])
            },2000)
          }
        }).catch(err=>{ 
          console.log(err)
        })
      }
    }else{
      this.valid_title = 'Morate uneti shipping adress.'
    }
  }
}
