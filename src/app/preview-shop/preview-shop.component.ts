import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/config';
import { ShopItem } from '../models/ShopItem';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';
import { SharedStoreCategoriesService } from '../services/share-store-categories';
import { SharedStoreUserService } from '../services/share-store-user';
import { SharedService } from '../services/shared-data-service';
import { SharedShopItemService } from '../services/shop-item-service';

@Component({
  selector: 'app-preview-shop',
  templateUrl: './preview-shop.component.html',
  styleUrls: ['./preview-shop.component.css']
})
export class PreviewShopComponent implements OnInit {

  query:string;
  user:User;
  shopItems:ShopItem[] = [];
  categories:string[];
  loaded:boolean = false;
  shopItemObserved:ShopItem = null;
  root_url:string;
  username:string;
  constructor( private sharedService:SharedService,private sharedAuthUserService:SharedAuthUserService, private sharedShopItemService:SharedShopItemService, private router: Router, private http: HttpClient, private _elementRef : ElementRef, private sharedStoreCategoriesService:SharedStoreCategoriesService, private sharedStoreUserSerivce:SharedStoreUserService) { }

  ngOnInit(): void {
    this.sharedStoreUserSerivce.sharedMessage.subscribe(message=>this.username = message)
    this.sharedStoreCategoriesService.sharedMessage.subscribe(cats=>this.categories=cats) 
    this.root_url = config.ROOT_URL+'/'
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    if(!this.username)
      this.username = localStorage.getItem('store')
    if(this.categories.length==0){
      let someStr = localStorage.getItem('stores-categories')
      console.log(someStr)
      let someArr;
      if(someStr!=''){
        someArr = someStr.split(':')
        this.categories = someArr
      }
    }
    this.http.get(config.ROOT_URL+ '/api/items/'+this.username).toPromise().then((response:Array<ShopItem>)=>{
      if(response)
      {
        this.shopItems = [...response]
        this.loaded = true
        if(localStorage.getItem('items')!=null){
          let x = localStorage.getItem('items')
          let arr = x.split(':')
          for(let i =0;i<arr.length;i++){
            let temp = arr[i].split(';')
            this.shopItems = this.shopItems.filter((item)=>item._id!=temp[0])
          }
        }
      }
    }).catch(err=>{
      console.log(err)
    })
    // observable za kategorije i iteme
    // this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
  }

  previewItem(shopitem){
    
    this.sharedShopItemService.nextMessage(shopitem)
    this.router.navigate(['/shop-item'])
  }

}
