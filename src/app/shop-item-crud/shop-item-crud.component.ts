import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShopItem } from '../models/ShopItem';
import { User } from '../models/User';
import { SharedAuthUserService } from '../services/auth-user-service';
import { SharedShopItemService } from '../services/shop-item-service';
import {config} from '../../config';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HeaderCardCountService } from '../services/header-cart-count-service';

@Component({
  selector: 'app-shop-item-crud',
  templateUrl: './shop-item-crud.component.html',
  styleUrls: ['./shop-item-crud.component.css']
})
export class ShopItemCrudComponent implements OnInit {
  user:User;
  shopitem:ShopItem;
  previewAsCustomer:boolean;
  root_url:string;
  categories:string[] = [];
  file:any;
  uploadForm:FormGroup;
  editedElements:string[] = [];
  sel:string='selected';
  notsel:string='';
  count:number=0;
  headerCount:number;
  valid_title:string = "";
  valid_sdc:string = "";
  valid_price:string = "";
  valid_dc:string = "";
  valid_kategorija:string = "";
  show_error:string = ''
  constructor(private sharedShopItemService:SharedShopItemService,private router: Router, private http: HttpClient,private sharedAuthUserService:SharedAuthUserService,private formBuilder: FormBuilder, private _elementRef : ElementRef, private headerCardCountService:HeaderCardCountService) { }


  ngOnInit(): void {

    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    

    this.root_url = config.ROOT_URL+'/'
    this.sharedShopItemService.sharedMessage.subscribe(shopItem => this.shopitem = shopItem)
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    
    if(!this.shopitem)
      this.router.navigate([''])
    if(!this.user)
      this.previewAsCustomer = true
    else{
    if(this.shopitem && this.user.username != this.shopitem.userName){
      this.previewAsCustomer=true;
    }else{
      this.previewAsCustomer = false;
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))
      this.http.get(config.ROOT_URL+ '/api/category/'+this.user.username,{headers:headers}).toPromise().then((response:Array<string>)=>{
        if(response)
        {
          this.categories = [...response]
          if(this.categories.length == 0){
            let x = this._elementRef.nativeElement.querySelector('#save')
            console.log(x)
            x.disabled=true
          }
          console.log(this.categories)
          this.populateForm()
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  }

    
  }
  populateForm(){
    let form = this._elementRef.nativeElement.querySelector('#forma')
    form.itemTitle.value = this.shopitem.itemTitle
    form.smallDescription.value = this.shopitem.smallDescription
    form.description.value = this.shopitem.description
    form.price.value = this.shopitem.price
    
    form.suppliesLeft.value = this.shopitem.suppliesLeft
    
    // // form.category.value = this.shopitem.category
    // console.log(form.category)
    // let cat = this._elementRef.nativeElement.querySelector('#ispod')
    // console.log(cat)
    // form.imageName.value = this.shopitem.imageName
  }
  goBack(){
    this.router.navigate([''])
  }
  onChange(evt){
    console.log(evt.target.value)
    
    console.log(this.shopitem[evt.target.id])
    if(evt.target.value!=this.shopitem[evt.target.id]){
      // evt.target.style="border:3px solid red";
      evt.target.classList.add('edited')
      if(this.editedElements.filter(item=>item==evt.target.id).length == 0)
        this.editedElements.push(evt.target.id)
    }else{

      evt.target.classList.remove('edited')
      this.editedElements = this.editedElements.filter(item=>item!=evt.target.id)
    }
    
  }
  onChangeSel(evt){
    console.log(evt.target.value)
    if(evt.target.value!=this.shopitem.category){
      evt.target.classList.add('edited')
      if(this.editedElements.filter(item=>item==evt.target.id).length == 0)
        this.editedElements.push(evt.target.id)
    }else{
      evt.target.classList.remove('edited')
      this.editedElements = this.editedElements.filter(item=>item!=evt.target.id)
    }
  }

  updateItem(form:NgForm){
    var letterNumbersRegex = /^[a-zA-Z0-9\s]+$/;
    var numbersRegex = /^[0-9]+$/;
    var letterNumbersDotRegex = /^[a-zA-Z0-9.!?\s]+$/;
    let validated = true
    for (let item of this.editedElements){
      switch(item){
        case 'itemTitle':
          if(!letterNumbersRegex.test(form.value[item])){
            if(form.value[item].length<4)
              this.valid_title = 'Prekratak naslov.'
            else if(form.value[item].length>20)
              this.valid_title = 'Predugacak naslov'
            else
              this.valid_title = 'Nedozvoljeni karakteri u naslovu.'

            validated = false
          }else if(form.value[item].length<4){
            this.valid_title = 'Prekratak naslov.'
            validated = false

          }else if(form.value[item].length>20){
            this.valid_title = 'Predugacak naslov'
            validated = false
          }
          else{
            this.valid_title = ''
          }
          break;
        case 'smallDescription':
          if(!letterNumbersDotRegex.test(form.value[item])){
            if(form.value[item].length<4)
              this.valid_sdc = 'Prekratak opis.'
            else if(form.value[item].length>50)
              this.valid_sdc = 'Predugacak opis'
            else
              this.valid_sdc = 'Nedozvoljeni karakteri u opisu.'

            validated = false
          }else if(form.value[item].length<4){
            this.valid_sdc = 'Prekratak opis.'
            validated = false
          }
          else if(form.value[item].length>50){
            this.valid_sdc = 'Predugacak opis'
            validated = false
          }
          else{
            this.valid_sdc = ''
          }
          break;
        case 'price':
          console.log(form.value[item])
          if(!numbersRegex.test(form.value[item])){
            this.valid_price = 'Nedozvoljeni karakteri u opisu.'
            validated = false
          }else{
            this.valid_price = ''
          }
          break;
        case 'category':
          if(!form.value[item]){
            this.valid_kategorija = 'Kategorija ne moze biti prazna'
          }else{
            this.valid_kategorija = ''
          }
          break;
        case 'description':
          if(!letterNumbersDotRegex.test(form.value[item])){
            if(form.value[item].length<4)
              this.valid_dc = 'Prekratak opis.'
            else if(form.value[item].length>200)
              this.valid_dc = 'Predugacak opis'
            else
              this.valid_dc = 'Nedozvoljeni karakteri u opisu.'

            validated = false
          }else if(form.value[item].length<4){
            this.valid_dc = 'Prekratak opis.'
            validated = false;
          }
          else if(form.value[item].length>200){
            this.valid_dc = 'Predugacak opis'
            validated = false
          }
          else{
            this.valid_dc = ''
          }
          break;
      }
    }
    if(validated){
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))
      this.count = this.editedElements.length;
      if(this.count == 0)
        this.router.navigate([''])
      for(let item of this.editedElements){
        this.http.put(config.ROOT_URL+ '/api/items/'+this.shopitem._id+'/'+item+'/'+form.value[item],{headers:headers}).toPromise().then((response)=>{
          this.count--;
          if(this.count==0){
            this.router.navigate([''])
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    }
  }

  putToCart(){
    let x = this._elementRef.nativeElement.querySelector('#quantity')
      console.log(x.value)
    if(x.value){
      if(!this.user){
        this.show_error = 'Morate biti ulogovani.'
      }else{
        this.show_error = ''
        if(localStorage.getItem('items')){
          let items = localStorage.getItem('items')+':'+this.shopitem._id+';'+x.value

          let spl = items.split(':')
          this.headerCardCountService.nextMessage(spl.length)
          localStorage.setItem('items',items)
        }else{
          localStorage.setItem('items',this.shopitem._id+';'+x.value)
          this.headerCardCountService.nextMessage(1)
        }
        this.router.navigate(['/cat-preview'])
      }
    }else{
      this.show_error = 'Morate izabrati kolicinu.'
    }
  }
}
