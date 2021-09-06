import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'
import {User} from '../models/User'
@Injectable()
export class SharedService{
    private message = new BehaviorSubject(false);
    sharedMessage= this.message.asObservable();

    constructor(){
    }
    nextMessage(message: boolean){
        this.message.next(message)
    }
}