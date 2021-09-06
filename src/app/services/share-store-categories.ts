import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'
@Injectable()
export class SharedStoreCategoriesService{
    private message = new BehaviorSubject<string[]>([]);
    sharedMessage= this.message.asObservable();

    constructor(){
    }
    nextMessage(message: string[]){
        this.message.next(message)
    }
}