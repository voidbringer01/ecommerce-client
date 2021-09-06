import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/config';
import { User } from '../models/User';
import {CatFilter} from '../pipes/cat-filter'
import { SharedAuthUserService } from '../services/auth-user-service';
import { SharedCategoryService } from '../services/shared-category';
import { SharedService } from '../services/shared-data-service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  query:string;
  categories:string[] = [];
  item_counts:number[] = [];
  loaded:boolean = false;
  page_num:number = 1;
  loop_iteration:number[] = [0,1,2,3] 
  max_page_num:number = 10 // edit
  observed_category:string;
  user:User;
  constructor(private router: Router, private http: HttpClient, private sharedCategoryService: SharedCategoryService, private sharedService:SharedService,private sharedAuthUserService: SharedAuthUserService) { }

  ngOnInit(): void {
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))

    this.sharedCategoryService.sharedMessage.subscribe(observed_category => this.observed_category = observed_category)
    this.sharedAuthUserService.sharedMessage.subscribe(user=>this.user = user)
    this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
      // console.log(res)
      this.sharedService.nextMessage(true)
      this.user = res
      this.sharedAuthUserService.nextMessage(res)
    }).catch(err=>{
      console.log(err)
    })

    this.http.get(config.ROOT_URL+ '/api/category/countall').toPromise().then((response:{count})=>{
      this.max_page_num= Math.ceil(response.count/10);
    }).catch(err=>{console.log(err)})
    this.getCategories()


  }

  getCategories(){
    this.http.get(config.ROOT_URL+ '/api/category/skip/'+this.page_num).toPromise().then((response:Array  <string>)=>{
      if(response)
      {

        this.categories = [...response]
        this.loaded = true
        for(let i =0;i<this.categories.length;i++){
          this.item_counts[i] = 0
        }
        if(this.user){
          for(let i of this.categories){
            let x = i
            this.http.get(config.ROOT_URL+'/api/items/count/'+x+'/'+this.user.username).toPromise().then((res:{count})=>{
              this.item_counts[this.categories.indexOf(x)] = res.count
            }).catch(err=>{
              console.log(err)
            })
          }
        }else{
          for(let i of this.categories){
            let x = i
            this.http.get(config.ROOT_URL+'/api/items/count/'+x).toPromise().then((res:{count})=>{
              this.item_counts[this.categories.indexOf(x)] = res.count
            }).catch(err=>{
              console.log(err)
            })
          }
        }
      }
    }).catch(err=>{
      console.log(err)
    })
  }

  visitCategory(cat){
    localStorage.setItem('category',cat)
    this.sharedCategoryService.nextMessage(cat)
    this.router.navigate(['/cat-preview'])
  }

  navigate(evt,id){
    switch(id){
      case 'first':
        this.page_num = 1
        this.getCategories();
        break;
      case 'previous':
        if(this.page_num>1){
          this.page_num --;
          this.getCategories();
        }
        break;
      case 'last':
        this.page_num = this.max_page_num;
        this.getCategories();
        break;
      case 'next':
        if(this.page_num<this.max_page_num){
          this.page_num++
          this.getCategories();
        }
        break;
      default:
        break;
    }
  }
}
