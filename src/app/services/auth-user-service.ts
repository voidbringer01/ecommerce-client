import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'
import {User} from '../models/User'
@Injectable()
export class SharedAuthUserService{
    private message = new BehaviorSubject<User>(null);
    sharedMessage= this.message.asObservable();

    constructor(){
    }
    nextMessage(message: User){
        this.message.next(message)
    }
}