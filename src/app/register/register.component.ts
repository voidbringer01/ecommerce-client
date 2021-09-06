import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {config} from '../../config';
import {faUserPlus,faEye,faKey,faUserCircle,faAt,faUser} from '@fortawesome/free-solid-svg-icons';
import {ResponseMessage} from '../models/response'
import {Router} from '@angular/router'
import { SharedAuthUserService } from '../services/auth-user-service';
import { User } from '../models/User';
import { SharedService } from '../services/shared-data-service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  faUserPlus = faUserPlus;
  faKey = faKey;
  faEye = faEye;
  faAt = faAt;
  faUser = faUser;
  faUserCircle = faUserCircle;
  uname:string ="";
  pw:string ="";
  e_mail:string ="";
  uname_message:string;
  password_message:string;
  email_message:string;
  backend_message:string;
  loged:boolean;

  constructor(private http: HttpClient, private router: Router, private sharedService:SharedService) { }

  ngOnInit(): void {
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
      // console.log(res)
      this.router.navigate([''])
    }).catch(err=>{
      console.log(err)
    })
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  register(event){
    console.log(event.target)
    event.target.disabled = true
    var usernameRegex = /^[a-zA-Z0-9]+$/;
    var passwordRegex = /^(?=.*[0-9])[a-zA-Z0-9]{6,16}$/;

    if(!usernameRegex.test(this.uname) || !(this.uname.length>=4)){
      this.uname_message = 'Username nije dobar.'
      // console.log('ime je dobro')
    }else{
      this.uname_message = '' 
    }
    if(!passwordRegex.test(this.pw)){
      this.password_message = 'Password nije dobar.'
    }else{
      this.password_message = ''
    }
    if(!this.validateEmail(this.e_mail)){
      this.email_message = 'Email nije dobar.'
    }else{
      this.email_message = ''
    }
    if(this.validateEmail(this.e_mail) && passwordRegex.test(this.pw) && usernameRegex.test(this.uname) && this.uname.length>=4){
      this.http.post(config.ROOT_URL + '/api/register', {'uname':this.uname,'password':this.pw,'email':this.e_mail,'userType':'regular'}).toPromise().then((res: ResponseMessage)=>{
        let {msg} = res;
        if(msg=='OK'){
          this.router.navigate(['login'])
        }else{
          console.log(res.msg)
          this.backend_message = res.msg
        }
        
    event.target.disabled = false
      }).catch(err=>{
        console.log('greska')
        console.log(err)
        // this.backend_message = err.error.msg
      })
    }else{
      event.target.disabled=false
    }
  }

  relocateToSignIn(){
    this.router.navigate(['/login'])
  }
}
