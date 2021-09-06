import { Component, ComponentFactoryResolver, ElementRef, OnInit } from '@angular/core';
import { ShopItem } from '../models/ShopItem';
import { User } from '../models/User';
import {SharedAuthUserService} from '../services/auth-user-service'
import {SharedService} from '../services/shared-data-service';
import {SharedShopItemService} from'../services/shop-item-service'
import {Router} from '@angular/router'
import {FilterPipe} from '../pipes/filterpipe'
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {config} from '../../config';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  query:string;
  authenticated:boolean;
  user:User;
  shopItems:ShopItem[] = [];
  categories:string[] = [];
  loaded:boolean = false;
  shopItemObserved:ShopItem = null;
  thumbnail:any;
  maxItems:Number;
  maxCats:Number;
  root_url:string;
  izaberi:string = '';
  constructor(private sanitizer: DomSanitizer, private sharedService:SharedService,private sharedAuthUserService:SharedAuthUserService, private sharedShopItemService:SharedShopItemService, private router: Router, private http: HttpClient, private _elementRef : ElementRef) { }

  ngOnInit(): void {
    this.root_url = config.ROOT_URL+'/'
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    // this.categories.push('automobili')
    // this.categories.push('laptopovi')
    this.sharedService.sharedMessage.subscribe(authenticated => this.authenticated = authenticated)
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    this.sharedShopItemService.sharedMessage.subscribe(shopItem => this.shopItemObserved = shopItem)  
    if(this.user){
      console.log(this.user)
      if(this.user.subbed){
        this.http.get(config.ROOT_URL+ '/api/category/'+this.user.username,{headers:headers}).toPromise().then((response:Array<string>)=>{
          if(response)
          {
            this.categories = [...response]
          }
        }).catch(err=>{
          console.log(err)
        })

        this.http.get(config.ROOT_URL+ '/api/items/'+this.user.username,{headers:headers}).toPromise().then((response:Array<ShopItem>)=>{
          if(response)
          {
            this.shopItems = [...response]
            this.loaded = true
          }
        }).catch(err=>{
          console.log(err)
        })
      } 
    }
    else{
      this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
        // console.log(res)
        this.sharedService.nextMessage(true)
        this.sharedAuthUserService.nextMessage(res)

        if(this.user.subbed){
          this.http.get(config.ROOT_URL+ '/api/category/'+this.user.username,{headers:headers}).toPromise().then((response:Array<string>)=>{
            if(response)
            {
              this.categories = [...response]
            }
          }).catch(err=>{
            console.log(err)
          })
  
          this.http.get(config.ROOT_URL+ '/api/items/'+this.user.username,{headers:headers}).toPromise().then((response:Array<ShopItem>)=>{
            if(response)
            {
              this.shopItems = [...response]
              this.loaded = true
            }
          }).catch(err=>{
            console.log(err)
          })
        } 

      }).catch(err=>{
        console.log(err)
        this.router.navigate([''])
      })
    }

    this.http.get(config.ROOT_URL+ '/api/plans/').toPromise().then((response:Array<{name,price,catNum,itemNum}>)=>{
      if(response)
      {
        console.log(response)
        for(let i =0;i<response.length;i++){
          console.log(this.user.subType)
          if(response[i].name.toLowerCase()==this.user.subType.toLowerCase()){
            this.maxItems = response[i].itemNum
            this.maxCats = response[i].catNum
          }
        }
      }
    }).catch(err=>{
      console.log(err)
    })

    // this.shopItems.push({user:this.user,itemTitle:'Kola',imageGallery:['asd','asd'],smallDescription:'Ovo je manji opis od itema',description:'Ovo je veliki opis',price:'250',suppliesLeft:2,category:'automobili'})
    // this.shopItems.push({user:this.user,itemTitle:'Kola2',imageGallery:['asd','asd'],smallDescription:'Ovo je manji opis od itema',description:'Ovo je veliki opis',price:'250',suppliesLeft:2,category:'automobili'})
    // this.shopItems.push({user:this.user,itemTitle:'Kola3',imageGallery:['asd','asd'],smallDescription:'Ovo je manji opis od itema',description:'Ovo je veliki opis',price:'250',suppliesLeft:1,category:'laptopovi'})
  }

  previewItem(shopItem:ShopItem){
    this.sharedShopItemService.nextMessage(shopItem)
    this.router.navigate(['/shop-item'])
    // this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
  }

  subscribe(form:NgForm){
    if(!form.value.plan){
      this.izaberi = 'Morate izabrati bar jednu opciju'
    }
    else{
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))
      // console.log(this.user._id) 
      this.http.put(config.ROOT_URL+ '/api/register/'+this.user._id,{subType:form.value.plan},{headers:headers}).toPromise().then(response=>{
        this.user.subbed=true
        // this.sharedAuthUserService.nextMessage(this.user)    
        this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
          // console.log(res)
          if(res){
            this.user = res;
            // console.log(this.user)
            this.sharedAuthUserService.nextMessage(this.user)
            this.http.get(config.ROOT_URL+ '/api/category/'+this.user.username,{headers:headers}).toPromise().then((response:Array<string>)=>{
              if(response)
              {
                this.categories = [...response]
              }
            }).catch(err=>{
              console.log(err)
            })
      
            this.http.get(config.ROOT_URL+ '/api/items/'+this.user.username,{headers:headers}).toPromise().then((response:Array<ShopItem>)=>{
              if(response)
              {
                this.shopItems = [...response]
                this.loaded = true
              }
            }).catch(err=>{
              console.log(err)
            })
          }
        }).catch(err=>{
          console.log(err)
        })
      })
    }
    // console.log(form.value.plan)
  }
  createNewItem(){
    this.router.navigate(['create-new-item'])
  }
  createNewCategory(){
    this.router.navigate(['create-new-category'])
  }
  deleteItem(shopItem:ShopItem){
      // let cnfm = confirm('Da li stvarno zelite da izbrisite ovaj item?')
     
      this.sharedShopItemService.nextMessage(shopItem)
      let x = this._elementRef.nativeElement.querySelector('#outside')
      // console.log(x)
      x.style.display = "block";

  }

  makeRequest(shopItem:ShopItem){
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.delete(config.ROOT_URL+ '/api/items/'+shopItem._id).toPromise().then((response:{msg:string})=>{
      console.log(response)
      console.log('izbrisali smo,refresh da vidite')
      window.location.reload()
    }).catch(err=>{
      console.log(err)
    })
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
      this.makeRequest(this.shopItemObserved)
    }
  }
}
