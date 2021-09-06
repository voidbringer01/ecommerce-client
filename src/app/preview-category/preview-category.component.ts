import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {config} from '../../config';
import { ShopItem } from '../models/ShopItem';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';
import { SharedCategoryService } from '../services/shared-category';
import { SharedShopItemService } from '../services/shop-item-service';

@Component({
  selector: 'app-preview-category',
  templateUrl: './preview-category.component.html',
  styleUrls: ['./preview-category.component.css']
})
export class PreviewCategoryComponent implements OnInit {

  query:string;
  user:User;
  shopItems:ShopItem[] = [];
  loaded:boolean = false;
  shopItemObserved:ShopItem = null;
  observedCategory:string;
  root_url:string;
  constructor(private sharedAuthUserService: SharedAuthUserService,private sharedShopItemService:SharedShopItemService, private router: Router, private http: HttpClient, private _elementRef : ElementRef, private sharedCategoryService:SharedCategoryService) { }

  ngOnInit(): void {
    this.root_url = config.ROOT_URL+'/'
    this.sharedCategoryService.sharedMessage.subscribe(observed_category => this.observedCategory = observed_category)
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    this.sharedShopItemService.sharedMessage.subscribe(shopItem => this.shopItemObserved = shopItem)  
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    if(!this.observedCategory){
      this.observedCategory = localStorage.getItem('category')
    }
      this.http.get(config.ROOT_URL+ '/api/items/category/'+this.observedCategory).toPromise().then((response:Array<ShopItem>)=>{
        if(response)
        {
          this.shopItems = [...response]
          this.loaded = true
          this.shopItems = this.shopItems.filter((item)=>item.userName!=this.user.username)
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
        this.loaded = true
      })
  
  }

  previewItem(shopItem:ShopItem){
    this.sharedShopItemService.nextMessage(shopItem)
    this.router.navigate(['/shop-item'])
    // this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
  }
}
