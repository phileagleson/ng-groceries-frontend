import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { GroceryAreaListComponent } from './components/grocery-area-list/grocery-area-list.component'
import { GroceryDetailComponent } from './components/grocery-detail/grocery-detail.component'
import { GroceryListComponent } from './components/grocery-list/grocery-list.component'
import { LoginComponent } from './components/login/login.component'
import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  { path: 'groceries', component: GroceryAreaListComponent, canActivate: [AuthGuard] },
  { path: 'grocerylist', component: GroceryListComponent, canActivate: [AuthGuard] },
  { path: 'groceries/:area/:areaId', component: GroceryDetailComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/groceries', pathMatch: 'full' }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
