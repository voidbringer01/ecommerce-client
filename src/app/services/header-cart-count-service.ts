import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'
@Injectable()
export class HeaderCardCountService{
    private message = new BehaviorSubject<number>(0);
    sharedMessage= this.message.asObservable();

    constructor(){
    }
    nextMessage(message: number){
        this.message.next(message)
    }
}