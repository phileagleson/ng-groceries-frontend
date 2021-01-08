import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DragDropModule } from '@angular/cdk/drag-drop'
/* COMPONENTS */
import { FooterComponent } from './components/footer/footer.component'
import { GroceryAreaListComponent } from './components/grocery-area-list/grocery-area-list.component'
import { GroceryDetailComponent } from './components/grocery-detail/grocery-detail.component'
import { AddItemModalComponent } from './components/grocery-detail/add-item-modal/add-item-modal.component'
import { GroceryRowComponent } from './components/grocery-detail/grocery-row/grocery-row.component'
import { GroceryListComponent } from './components/grocery-list/grocery-list.component'
import { AddItemToListModalComponent } from './components/grocery-list/add-item-modal/add-item-modal.component'

/* SERVICES */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from './services/auth-interceptor.service'

/* DIRECTIVES */
import { AppSortDirective } from './directives/sortable.directive'
import { NavbarComponent } from './components/navbar/navbar.component'
import { AddNewAreaModalComponent } from './components/grocery-area-list/add-new-area-modal/add-new-area-modal.component'
import { ToastsContainerComponent } from './components/toasts-container/toasts-container.component'
import { LoginComponent } from './components/login/login.component'

/* GUARDS */
import { AuthGuard } from './guards/auth.guard'
import { LoadingComponent } from './components/loading/loading.component'

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    FooterComponent,
    GroceryAreaListComponent,
    GroceryDetailComponent,
    AddItemModalComponent,
    AppSortDirective,
    GroceryRowComponent,
    GroceryListComponent,
    NavbarComponent,
    AddNewAreaModalComponent,
    ToastsContainerComponent,
    LoginComponent,
    LoadingComponent,
    AddItemToListModalComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, NgbModule, HttpClientModule, DragDropModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard
  ]
})
export class AppModule {}
