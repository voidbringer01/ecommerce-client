import {Injectable} from '@angular/core'
import {BehaviorSubject} from 'rxjs'
import { ShopItem } from '../models/ShopItem';
@Injectable()
export class SharedShopItemService{
    private message = new BehaviorSubject<ShopItem>(null);
    sharedMessage= this.message.asObservable();

    constructor(){
    }
    nextMessage(message: ShopItem){
        this.message.next(message)
    }
}