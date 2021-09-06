import { Component, OnInit } from '@angular/core';
import {faUserPlus,faEye,faKey,faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {config} from '../../config';
import {AuthenticatedUser} from '../models/AuthenticatedUser'
import {Router} from '@angular/router'
import { SharedService } from '../services/shared-data-service';
import { User } from '../models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faUserPlus = faUserPlus;
  faKey = faKey;
  faEye = faEye;
  faUserCircle = faUserCircle;
  uname_message:string;
  password_message:string;
  backend_message:string;
  backend_message_success:boolean = false;

  
  uname:string ="";
  pw:string ="";
  constructor(private http: HttpClient, private router: Router, private sharedService:SharedService) { }

  ngOnInit(): void {
    let headers = new HttpHeaders();
    headers = headers.set('x-auth-token',localStorage.getItem('token'))
    this.http.get(config.ROOT_URL + '/api/login/authenticated-data',{headers:headers}).toPromise().then((res:User)=>{
      // console.log(res)
      if(res)
        this.router.navigate([''])
    }).catch(err=>{
      console.log(err)
    })
  }
  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  login(event){
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
    this.backend_message=''
    
    if (passwordRegex.test(this.pw) && usernameRegex.test(this.uname) && this.uname.length>=4){
      // this.users = this.http.post(config.ROOT_URL + '/api/login', {'uname':'asd','pw':'a'})
      this.http.post(config.ROOT_URL + '/api/login', {'uname':this.uname,'pw':this.pw}).toPromise().then((res: AuthenticatedUser)=>{
        let user:AuthenticatedUser = res;
        if(!user.msg){
          localStorage.setItem('token',user.token)
          localStorage.setItem('username',user.user.username)
          localStorage.setItem('email',user.user.email)
          this.sharedService.nextMessage(true);
          this.backend_message = 'Login success!'
          this.backend_message_success=true
          setTimeout(()=>{this.router.navigate([''])},1500)
        }else{
          this.backend_message = res.msg
        }
        event.target.disabled=false
      }).catch(err=>{
        // console.log(err.error.msg)
        this.backend_message = err.error.msg
        event.target.disabled=false
      })
    }else{
      event.target.disabled=false
    }
  }
  relocateToRegister(){
    this.router.navigate(['/register'])
  }
}
