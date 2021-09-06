import { Pipe, PipeTransform } from '@angular/core';
import { ShopItem } from '../models/ShopItem';

@Pipe({
    name: 'catfilter',
    pure: false
})
export class CatFilter implements PipeTransform {
    transform(items: string[], filter): any {
        if (!items || !filter) {
            return items;
        }
        let newArr = []
        if(filter.itemTitle)
            newArr = items.filter(item =>{
                return item.toLowerCase().indexOf(filter.itemTitle.toLowerCase()) !== -1})
        else newArr = items;
        // console.log(filter.itemTitle)
        // console.log(newArr)
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return newArr;
    }
}