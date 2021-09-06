import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';
import {config} from '../../config';
import { ResponseMessage } from '../models/response';
import { SharedService } from '../services/shared-data-service';

@Component({
  selector: 'app-create-new-category',
  templateUrl: './create-new-category.component.html',
  styleUrls: ['./create-new-category.component.css']
})
export class CreateNewCategoryComponent implements OnInit {
  maxCats = [];
  categories:string[] = [];
  user:User;
  catMax:Number;
  katName:string = "";
  searchCategories:string[] = [];
  valid_title:string = "";
  constructor(private router: Router, private http: HttpClient,private sharedService:SharedService,private sharedAuthUserService:SharedAuthUserService, private _elementRef : ElementRef) { }

  ngOnInit(): void {
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)

    this.http.get(config.ROOT_URL+ '/api/plans/').toPromise().then((response:Array<{name,price,catNum,itemNum}>)=>{
      if(response)
      {
        for(let i =0;i<response.length;i++){
            this.maxCats.push({name:response[i].name,catNum:response[i].catNum})
        }
        if(this.user){    
          for(let i =0;i<this.maxCats.length;i++){

            // console.log(this.user)
            if(this.maxCats[i].name.toLowerCase()==this.user.subType.toLowerCase()){
              this.catMax = this.maxCats[i].catNum
              console.log(this.catMax)
            }
          }
        }
      }
    }).catch(err=>{
      console.log(err)
    })
    if(!this.user){
      this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
        // console.log(res)
        if(res){
          console.log(res)
          this.sharedService.nextMessage(true)
          this.sharedAuthUserService.nextMessage(res)

        for(let i =0;i<this.maxCats.length;i++){
          if(this.maxCats[i].name.toLowerCase()==this.user.subType.toLowerCase()){
            this.catMax = this.maxCats[i].catNum
          }
        }

          this.http.get(config.ROOT_URL+ '/api/category/'+this.user.username,{headers:headers}).toPromise().then((response:Array<string>)=>{
            if(response)
            {
              this.categories = [...response]
              if(this.categories.length==this.catMax){
                let x = this._elementRef.nativeElement.querySelector('#categoryName')
                x.disabled=true
                let y = this._elementRef.nativeElement.querySelector('#save')
                y.disabled=true
              }
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
    else{
      this.http.get(config.ROOT_URL+ '/api/category/'+this.user.username,{headers:headers}).toPromise().then((response:Array<string>)=>{
        if(response)
        {
          this.categories = [...response]
          if(this.categories.length==this.catMax){
            let x = this._elementRef.nativeElement.querySelector('#categoryName')
            x.disabled=true
            let y = this._elementRef.nativeElement.querySelector('#save')
            y.disabled=true
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    } 
  }

  pretrazi(){
    console.log(this.katName)
    
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.get(config.ROOT_URL+'/api/category/search/'+this.katName,{headers:headers}).toPromise().then((response:Array<string>)=>{
      if(response){
        // console.log(response)
        this.searchCategories = response
      }
    })
  }
  submitForm(){
    var letterNumbersRegex = /^[a-zA-Z0-9]+$/;
    let validated = true
    if(!letterNumbersRegex.test(this.katName)){
      if(this.katName.length<4)
        this.valid_title = 'Prekratak naslov.'
      else if(this.katName.length>20)
        this.valid_title = 'Predugacak naslov'
      else
        this.valid_title = 'Nedozvoljeni karakteri u naslovu.'

      validated = false
    }else if(this.katName.length<4){
      this.valid_title = 'Prekratak naslov.'
      validated = false

    }else if(this.katName.length>20){
      this.valid_title = 'Predugacak naslov'
      validated = false
    }
    else{
      this.valid_title = ''
    }


    if(validated){
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))
      
      this.http.get(config.ROOT_URL+'/api/category/search/one/'+this.katName,{headers:headers}).toPromise().then((response:Array<string>)=>{
        if(response){
          // console.log(response)
          // this.searchCategories = response
          console.log(response.length)
          if(response.length==0){
            this.http.post(config.ROOT_URL+'/api/category',{userName:this.user.username,categoryName:this.katName},{headers:headers}).toPromise().then((res:ResponseMessage)=>{
                if(res.msg=='OK'){
                  console.log('jej uspeh')
                  this.router.navigate([''])
                }
              }).catch(err=>console.log(err))
          }else{
            this.http.put(config.ROOT_URL+'/api/category',{userName:this.user.username,categoryName:this.katName},{headers:headers}).toPromise().then((res:ResponseMessage)=>{
              if(res.msg=='OK'){
                console.log('jej uspeh')
                this.router.navigate([''])
              }
            }).catch(err=>console.log(err))
          }
        }
      })
    }


    // this.http.post(config.ROOT_URL+'/api/category',{userName:this.user.username,categoryName:this.katName},{headers:headers}).toPromise().then((res:ResponseMessage)=>{
    //   if(res.msg=='OK'){
    //     console.log('jej uspeh')
    //     this.router.navigate([''])
    //   }
    // }).catch(err=>console.log(err))
  }
  goBack(){
    this.router.navigate([''])
  }
}
