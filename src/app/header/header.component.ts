import { Component, ElementRef, Input, OnInit } from '@angular/core';
import {faShoppingCart,faBars} from '@fortawesome/free-solid-svg-icons';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';
import {SharedService} from '../services/shared-data-service'
import {NgForm} from '@angular/forms'
import { Router } from '@angular/router';
import {SearchService} from '../services/search-service'
import {HeaderCardCountService} from '../services/header-cart-count-service'
import { config } from 'src/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host:{
    '(document:click)':'onClick($event)'
  }
})
export class HeaderComponent implements OnInit {
  // @Input() user:User;
  faShoppingCart = faShoppingCart;
  faBars = faBars;
  user:User;
  authenticated:boolean;
  count:number;
  status_of_app:string;
  constructor( private http: HttpClient, private sharedService:SharedService,private sharedAuthUserService:SharedAuthUserService, private router:Router, private searchService:SearchService, private headerCardCountService:HeaderCardCountService, private _elementRef : ElementRef) { }

  ngOnInit(): void {
    this.sharedService.sharedMessage.subscribe(authenticated => this.authenticated = authenticated)
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    // let str = localStorage.getItem('items')
    // let arr = str.split(':')
    // this.count = arr.length
    this.headerCardCountService.sharedMessage.subscribe(count=>this.count = count)
    
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
     this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
        // console.log(res)
        this.sharedService.nextMessage(true)
        this.sharedAuthUserService.nextMessage(res)
       
      }).catch(err=>{
        console.log(err)
        this.router.navigate([''])
      })

    if(localStorage.getItem('items')!=null){
      let spl = localStorage.getItem('items').split(':')
      this.headerCardCountService.nextMessage(spl.length)
    }else{
      this.headerCardCountService.nextMessage(0)
    }
  }

  onSubmit(f:NgForm){
      this.searchService.nextMessage(f.value.search);
      this.router.navigate(['/search'])
  }
  logout(){
    console.log('asd')
    if(localStorage.getItem('token')){
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('items')
      this.router.navigate([''])
      this.sharedService.nextMessage(false);
      this.sharedAuthUserService.nextMessage(null)
    }

  }

  showNav(){
    let x = this._elementRef.nativeElement.querySelector('#nav')
    x.style.display = 'block'
  }

  onClick(event) {
    let x = this._elementRef.nativeElement.querySelector('#nav')
    if (!this._elementRef.nativeElement.querySelector('#asd').contains(event.target)){
      x.style.display = 'none'
      console.log(event.target)
    }
  }
}
