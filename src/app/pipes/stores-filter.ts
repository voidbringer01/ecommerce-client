import { Pipe, PipeTransform } from '@angular/core';
// import { ShopItem } from '../models/ShopItem';

@Pipe({
    name: 'storefilter',
    pure: false
})
export class StoreFilter implements PipeTransform {
    transform(items: {userName:string,categories:string[]}[], filter): any {
        if (!items || !filter) {
            return items;
        }
        let newArr = []
        if(filter.itemTitle)
            newArr = items.filter(item =>{
                return item.userName.toLowerCase().indexOf(filter.itemTitle.toLowerCase()) !== -1})
        else newArr = items;
        // console.log(filter.itemTitle)
        // console.log(newArr)
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return newArr;
    }
}