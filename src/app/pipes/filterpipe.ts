import { Pipe, PipeTransform } from '@angular/core';
import { ShopItem } from '../models/ShopItem';

@Pipe({
    name: 'myfilter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: ShopItem[], filter): any {
        if (!items || !filter) {
            return items;
        }
        let newArr = []
        if(filter.itemTitle)
            newArr = items.filter(item =>{
                return item.itemTitle.toLowerCase().indexOf(filter.itemTitle.toLowerCase()) !== -1})
        else newArr = items;
        // console.log(filter.itemTitle)
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return newArr.filter(item => item.category==filter.category );
    }
}