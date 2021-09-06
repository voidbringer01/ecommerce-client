import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'
import {User} from '../models/User'
@Injectable()
export class SearchService{
    private message = new BehaviorSubject('');
    sharedMessage= this.message.asObservable();

    constructor(){
    }
    nextMessage(message: string){
        this.message.next(message)
    }
}