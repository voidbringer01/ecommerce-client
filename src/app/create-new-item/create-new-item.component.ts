import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm ,FormGroup ,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import {config} from '../../config';
import { User } from '../models/User';
import {SharedAuthUserService} from '../services/auth-user-service'
import { SharedService } from '../services/shared-data-service';

@Component({
  selector: 'app-create-new-item',
  templateUrl: './create-new-item.component.html',
  styleUrls: ['./create-new-item.component.css']
})
export class CreateNewItemComponent implements OnInit {
  user:User;
  categories:string[] = [];
  file:any;
  uploadForm:FormGroup;
  
  valid_title:string = "";
  valid_sdc:string = "";
  valid_price:string = "";
  valid_dc:string = "";
  valid_kategorija:string = "";
  valid_quantity:string = ""
  valid_naziv_slike:string = ""
  valid_slika:string = ""
  constructor(private sharedService:SharedService,private router: Router, private http: HttpClient,private sharedAuthUserService:SharedAuthUserService,private formBuilder: FormBuilder, private _elementRef : ElementRef) { }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.sharedAuthUserService.sharedMessage.subscribe(user => this.user = user)
    if(!this.user){
      this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
        // console.log(res)
        if(res){
          this.user = res;
          this.sharedAuthUserService.nextMessage(res)
          this.sharedService.nextMessage(true)
          this.http.get(config.ROOT_URL+ '/api/category/'+this.user.username,{headers:headers}).toPromise().then((response:Array<string>)=>{
            if(response)
            {
              this.categories = [...response]
              if(this.categories.length == 0){
                let x = this._elementRef.nativeElement.querySelector('#save')
                console.log(x)
                x.disabled=true
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
          if(this.categories.length == 0){
            let x = this._elementRef.nativeElement.querySelector('#save')
            console.log(x)
            x.disabled=true
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    } 
  }
  onSelectFile(event){
    if(event.target.files[0]){
      const file = event.target.files[0]
      this.uploadForm.get('profile').setValue(file)
    }

    // this.file = event.target.files[0]
  }
  createItem(form:NgForm){
    

    var letterNumbersRegex = /^[a-zA-Z0-9\s]+$/;
    var numbersRegex = /^[0-9]+$/;
    var letterNumbersDotRegex = /^[a-zA-Z0-9.!?\s]+$/;
    let validated = true
    console.log(form.value['suppliesLeft'])
    if(form.value['suppliesLeft'] > 0){
      this.valid_quantity = ''
    }else{
      this.valid_quantity = 'Morate izabrati kolicinu'
      validated = false
    }

    if(!form.value.image){
      this.valid_slika = 'Slika je obavezna.'
      validated = false; 
    }

    if(!letterNumbersRegex.test(form.value['imageName'])){
      if(form.value['imageName'].length<4)
        this.valid_naziv_slike = 'Prekratak naslov.'
      else if(form.value['imageName'].length>20)
        this.valid_naziv_slike = 'Predugacak naslov'
      else
        this.valid_naziv_slike = 'Nedozvoljeni karakteri u naslovu.'

      validated = false
    }else if(form.value['imageName'].length<4){
      this.valid_naziv_slike = 'Prekratak naslov.'
      validated = false

    }else if(form.value['imageName'].length>20){
      this.valid_naziv_slike = 'Predugacak naslov'
      validated = false
    }
    else{
      this.valid_naziv_slike = ''
    }

    if(!letterNumbersRegex.test(form.value['itemTitle'])){
      if(form.value['itemTitle'].length<4)
        this.valid_title = 'Prekratak naslov.'
      else if(form.value['itemTitle'].length>20)
        this.valid_title = 'Predugacak naslov'
      else
        this.valid_title = 'Nedozvoljeni karakteri u naslovu.'

      validated = false
    }else if(form.value['itemTitle'].length<4){
      this.valid_title = 'Prekratak naslov.'
      validated = false

    }else if(form.value['itemTitle'].length>20){
      this.valid_title = 'Predugacak naslov'
      validated = false
    }
    else{
      this.valid_title = ''
    }

    if(!letterNumbersDotRegex.test(form.value['smallDescription'])){
      if(form.value['smallDescription'].length<4)
        this.valid_sdc = 'Prekratak opis.'
      else if(form.value['smallDescription'].length>50)
        this.valid_sdc = 'Predugacak opis'
      else
        this.valid_sdc = 'Nedozvoljeni karakteri u opisu.'

      validated = false
    }else if(form.value['smallDescription'].length<4){
      this.valid_sdc = 'Prekratak opis.'
      validated = false
    }
    else if(form.value['smallDescription'].length>50){
      this.valid_sdc = 'Predugacak opis'
      validated = false
    }
    else{
      this.valid_sdc = ''
    }

    if(!numbersRegex.test(form.value['price'])){
      this.valid_price = 'Nedozvoljeni karakteri u opisu.'
      validated = false
    }else{
      this.valid_price = ''
    }

    if(!form.value['category']){
      this.valid_kategorija = 'Kategorija ne moze biti prazna'
    }else{
      this.valid_kategorija = ''
    }
    if(!letterNumbersDotRegex.test(form.value['description'])){
      if(form.value['description'].length<4)
        this.valid_dc = 'Prekratak opis.'
      else if(form.value['description'].length>200)
        this.valid_dc = 'Predugacak opis'
      else
        this.valid_dc = 'Nedozvoljeni karakteri u opisu.'

      validated = false
    }else if(form.value['description'].length<4){
      this.valid_dc = 'Prekratak opis.'
      validated = false;
    }
    else if(form.value['description'].length>200){
      this.valid_dc = 'Predugacak opis'
      validated = false
    }
    else{
      this.valid_dc = ''
    }

    if(validated){
      let headers = new HttpHeaders();
      headers = headers.set('x-auth-token',localStorage.getItem('token'))

      let formData = new FormData()
      formData.append('image',this.uploadForm.get('profile').value)
      formData.append('imageName',form.value.imageName)
      // console.log(this.user.username)
      formData.append('userName',this.user.username)
      formData.append('itemTitle',form.value.itemTitle)
      formData.append('smallDescription',form.value.smallDescription)
      formData.append('description',form.value.description)
      formData.append('price',form.value.price)
      formData.append('suppliesLeft',form.value.suppliesLeft)
      formData.append('category',form.value.category)
      this.http.post(config.ROOT_URL + '/api/items',formData,{headers:headers}).toPromise().then(
        response=>{
          console.log(response)
          this.router.navigate([''])
        }
      )
    }
  }
  goBack(){
    this.router.navigate([''])
  }
}
