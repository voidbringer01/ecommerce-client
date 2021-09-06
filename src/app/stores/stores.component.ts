import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/config';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';
import {StoreFilter} from '../pipes/stores-filter'
import { SharedStoreCategoriesService } from '../services/share-store-categories';
import { SharedStoreUserService } from '../services/share-store-user';
@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

  query:string;
  user:User;
  // stores:{username,categories:string[]}[] = [];
  stores:{userName:string, categories:string[]}[] = [];
  item_counts:number[] = [];
  loaded:boolean = false;
  page_num:number = 1;
  loop_iteration:number[] = [0,1,2,3] 
  max_page_num:number = 10 // edit
  colors:string[];
  distances:string[];
  letters = '0123456789ABCDEF';
  constructor(private router: Router, private http: HttpClient, private sharedAuthUserService:SharedAuthUserService, private sharedStoreCategoriesService:SharedStoreCategoriesService, private sharedStoreUserSerivce:SharedStoreUserService) { }

  ngOnInit(): void {
    // this.sharedStoreCategoriesService.sharedMessage()
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    this.http.get(config.ROOT_URL+ '/api/category/stores/countall').toPromise().then((response:{count})=>{
      this.max_page_num= Math.ceil(response.count/10);
    }).catch(err=>{console.log(err)})
    console.log('asd')
    this.getStores()
  }
  getStores(){
    this.http.get(config.ROOT_URL+ '/api/category/stores/skip/'+this.page_num).toPromise().then((response:{userName:string, categories:string[]}[])=>{
      console.log(response)
      if(response)
      {
        this.stores = [...response]
        this.colors = []
        this.distances = []
        let counter =0;
        if(this.user){
          this.stores = this.stores.filter(store=>{
          return store.userName!=this.user.username
          })
        }
        console.log(this.stores)
        for(let store of this.stores){
          for(let category of store.categories){
            let color = '#'
            color += this.letters[Math.floor(Math.random() * 16)]
            color += this.letters[Math.floor(Math.random() * 16)]
            color += this.letters[Math.floor(Math.random() * 16)]
            color += this.letters[Math.floor(Math.random() * 16)]
            color += this.letters[Math.floor(Math.random() * 16)]
            color += this.letters[Math.floor(Math.random() * 16)]
            this.colors.push(color)
            this.distances.push(counter*40+'px')
            counter++
          }
        }
        this.loaded = true
        // for(let i =0;i<this.stores.length;i++){
        //   this.item_counts[i] = 0
        // }
        // for(let i of this.stores){
        //   let x = i
        //   this.http.get(config.ROOT_URL+'/api/items/count/'+x).toPromise().then((res:{count})=>{
        //     this.item_counts[this.stores.indexOf(x)] = res.count
        //   }).catch(err=>{
        //     console.log(err)
        //   })
        // }
      }
    }).catch(err=>{
      console.log(err)
    })
  }

  visitStore(cat){
    // this.sharedStoreService.nextMessage(cat)
    localStorage.setItem('store',cat.userName);
    let strBuild = '';
    for(let i =0;i<cat.categories.length;i++){
      if(i!=0)
        strBuild+=':'
      strBuild+=cat.categories[i]
    }
    localStorage.setItem('stores-categories',strBuild)
    this.sharedStoreCategoriesService.nextMessage(cat.categories)
    this.sharedStoreUserSerivce.nextMessage(cat.userName)
    this.router.navigate(['/store-preview'])
  }

  navigate(evt,id){
    switch(id){
      case 'first':
        this.page_num = 1
        this.getStores();
        break;
      case 'previous':
        if(this.page_num>1){
          this.page_num --;
          this.getStores();
        }
        break;
      case 'last':
        this.page_num = this.max_page_num;
        this.getStores();
        break;
      case 'next':
        if(this.page_num<this.max_page_num){
          this.page_num++
          this.getStores();
        }
        break;
      default:
        break;
    }
  }
}
