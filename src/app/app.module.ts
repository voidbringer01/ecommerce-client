import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormBuilder, FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { SharedService } from './services/shared-data-service';
import { ShopComponent } from './shop/shop.component';
import { SharedAuthUserService } from './services/auth-user-service';
import { ShopItemCrudComponent } from './shop-item-crud/shop-item-crud.component';
import { SharedShopItemService } from './services/shop-item-service';
import {FilterPipe} from './pipes/filterpipe';
import { CategoriesComponent } from './categories/categories.component';
import { StoresComponent } from './stores/stores.component';
import { SupportComponent } from './support/support.component';
import { CartComponent } from './cart/cart.component';
import { MiniCartComponent } from './mini-cart/mini-cart.component';
import { SearchComponent } from './search/search.component'
import { SearchService } from './services/search-service';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { CreateNewItemComponent } from './create-new-item/create-new-item.component';
import { CreateNewCategoryComponent } from './create-new-category/create-new-category.component';
import { CatFilter } from './pipes/cat-filter';
import { PreviewCategoryComponent } from './preview-category/preview-category.component';
import { SharedCategoryService } from './services/shared-category';
import { StoreFilter } from './pipes/stores-filter';
import { PreviewShopComponent } from './preview-shop/preview-shop.component';
import { SharedStoreCategoriesService } from './services/share-store-categories';
import { SharedStoreUserService } from './services/share-store-user';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { HeaderCardCountService } from './services/header-cart-count-service';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { JoinSupportFormComponent } from './join-support-form/join-support-form.component';
import { SupportPageComponent } from './support-page/support-page.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { TestpipePipe } from './testpipe.pipe'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    ShopComponent,
    ShopItemCrudComponent,
    FilterPipe,
    CategoriesComponent,
    StoresComponent,
    SupportComponent,
    CartComponent,
    MiniCartComponent,
    SearchComponent,
    MyTransactionsComponent,
    CreateNewItemComponent,
    CreateNewCategoryComponent,
    CatFilter,
    PreviewCategoryComponent,
    StoreFilter,
    PreviewShopComponent,
    MyOrdersComponent,
    AdminPageComponent,
    JoinSupportFormComponent,
    SupportPageComponent,
    TestpipePipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    
  ],
  providers: [SharedService, SharedAuthUserService,SharedShopItemService, SearchService, FormBuilder, SharedCategoryService,SharedStoreCategoriesService,SharedStoreUserService, HeaderCardCountService,{provide:LocationStrategy,useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
