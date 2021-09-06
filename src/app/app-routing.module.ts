import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { CartComponent } from './cart/cart.component';
import { CategoriesComponent } from './categories/categories.component';
import { CreateNewCategoryComponent } from './create-new-category/create-new-category.component';
import { CreateNewItemComponent } from './create-new-item/create-new-item.component';
import { JoinSupportFormComponent } from './join-support-form/join-support-form.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { PreviewCategoryComponent } from './preview-category/preview-category.component';
import { PreviewShopComponent } from './preview-shop/preview-shop.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { ShopItemCrudComponent } from './shop-item-crud/shop-item-crud.component';
import { StoresComponent } from './stores/stores.component';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
  {path:'', component:LandingPageComponent},
  {path:'login', component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'shop-item',component:ShopItemCrudComponent},
  {path:'categories',component:CategoriesComponent},
  {path:'stores',component:StoresComponent},
  {path:'support',component:SupportComponent},
  {path:'cart',component:CartComponent},
  {path:'search',component:SearchComponent},
  {path:'my-transactions',component:MyTransactionsComponent},
  {path:'create-new-item',component:CreateNewItemComponent},
  {path:'create-new-category',component:CreateNewCategoryComponent},
  {path:'cat-preview',component:PreviewCategoryComponent
  },
  {path:'store-preview',component:PreviewShopComponent},
  {path:'my-orders',component:MyOrdersComponent},
  {path:'admin-page',component:AdminPageComponent},
  {path:'submit-app',component:JoinSupportFormComponent},
  {path: '404', component: LandingPageComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
