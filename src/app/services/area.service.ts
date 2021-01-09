import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import Area from '../models/Area'
import Item from '../models/Item'
import GroceryList from '../models/GrocerList'
import { LoadingService } from '../services/loading.service'
import { ErrorService } from '../services/error.service'

interface IResponse {
  data: {
    areas: Area[]
    area: Area
    addArea: Area
    getItemsForArea: Item[]
    addItemToArea: Item
    deleteItemFromArea: Item
    updateItem: Item
    deleteArea: Area
    updateArea: Area
    groceryList: GroceryList
    addItemToGroceryList: GroceryList
    removeItemFromGroceryList: GroceryList
    sortGroceryList: GroceryList
    resetGroceryList: GroceryList
  }
}

interface IOperations {
  query: string
  variables: {
    name?: string
    areaId?: string
    image?: null
  }
}

interface Vars {
  name?: string
  areaId?: string | null
  groceryId?: string
  itemId?: string
}

const uri = '/graphql'
@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private listId = ''

  constructor(private http: HttpClient, private loadingService: LoadingService, private errorService: ErrorService) {
    const query = `
    query GroceryList {
      groceryList {
        _id
      }
    }
    `
    const opts = {
      method: 'POST',
      // eslint-ignore-next-line
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }

    fetch(uri, opts)
      .then((res) => res.json())
      .then((res) => {
        this.listId = res.data.groceryList._id
      })
  }

  addItemToList(query: string, variables: Vars): Observable<GroceryList> {
    if (variables.groceryId === '') {
      variables.groceryId = this.listId
    }
    const addItem = this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(
        map((res) => res.data.addItemToGroceryList),
        catchError((err: any) => {
          const message = 'Error adding item to list - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(addItem)
    return addItem
  }

  getAreas(queryString: string): Observable<Area[]> {
    const loadAreas = this.http
      .post<IResponse>(uri, {
        query: queryString
      })
      .pipe(
        map((res) => res.data.areas),
        catchError((err: any) => {
          const message = 'Could not load areas - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )

    this.loadingService.showLoaderUntilCompleted(loadAreas).subscribe()
    return loadAreas
  }

  addArea(image: File | null, operations: IOperations): Observable<Area> {
    const varmap = { image: ['variables.image'] }
    const fd = new FormData()
    fd.append('operations', JSON.stringify(operations))
    if (image) {
      fd.append('map', JSON.stringify(varmap))
      fd.append('image', image, image.name)
    }

    const added = this.http.post<IResponse>(uri, fd).pipe(
      map((res) => res.data.addArea),
      catchError((err: any) => {
        const message = 'Could not add area - better tell Phil'
        this.errorService.showError(message)
        console.log(message, err)
        return throwError(err)
      })
    )
    this.loadingService.showLoaderUntilCompleted(added)
    return added
  }

  updateArea(image: File | null, operations: IOperations): Observable<Area> {
    if (image) {
      const varmap = { image: ['variables.image'] }
      const fd = new FormData()
      fd.append('operations', JSON.stringify(operations))
      fd.append('map', JSON.stringify(varmap))
      fd.append('image', image, image.name)

      const updated = this.http.post<IResponse>(uri, fd).pipe(
        map((res) => res.data.updateArea),
        catchError((err: any) => {
          const message = 'Could not update area - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
      this.loadingService.showLoaderUntilCompleted(updated)
      return updated
    } else {
      const updated = this.http
        .post<IResponse>(uri, {
          query: operations.query,
          variables: operations.variables
        })
        .pipe(
          map((res) => res.data.updateArea),
          catchError((err: any) => {
            const message = 'Could not update area - better tell Phil'
            this.errorService.showError(message)
            console.log(message, err)
            return throwError(err)
          })
        )
      this.loadingService.showLoaderUntilCompleted(updated)
      return updated
    }
  }

  getItemsForArea(query: string, variables: Vars): Observable<Item[]> {
    const itemsForArea = this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(
        map((res) => res.data.getItemsForArea),
        catchError((err: any) => {
          const message = 'Could not get items for area - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(itemsForArea)
    return itemsForArea
  }

  addItemToArea(query: string, variables: Vars): Observable<Item> {
    const addItem = this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(
        map((res) => res.data.addItemToArea),
        catchError((err: any) => {
          const message = 'Could not add item to area - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(addItem)
    return addItem
  }

  deleteItemFromArea(query: string, variables: Vars): Observable<Item> {
    const deleteItem = this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(
        map((res) => res.data.deleteItemFromArea),
        catchError((err: any) => {
          const message = 'Could not delete item from area - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(deleteItem)
    return deleteItem
  }

  updateItem(query: string, variables: Vars): Observable<Item> {
    const itemUpdate = this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(
        map((res) => res.data.updateItem),
        catchError((err: any) => {
          const message = 'Could not update item - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(itemUpdate)
    return itemUpdate
  }

  deleteArea(query: string, variables: Vars): Observable<Area> {
    const areaDelete = this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(
        map((res) => res.data.deleteArea),
        catchError((err: any) => {
          const message = 'Could not delete area - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(areaDelete)
    return areaDelete
  }

  getGroceryList(query: string): Observable<GroceryList> {
    const groceryList = this.http
      .post<IResponse>(uri, {
        query,
        variables: {
          groceryId: this.listId
        }
      })
      .pipe(
        map((res) => res.data.groceryList),
        catchError((err: any) => {
          const message = 'Could not get grocery list - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(groceryList)
    return groceryList
  }

  removeItemFromList(query: string, itemId: string): Observable<GroceryList> {
    const removeItem = this.http
      .post<IResponse>(uri, {
        query,
        variables: {
          groceryId: this.listId,
          itemId
        }
      })
      .pipe(
        map((res) => res.data.removeItemFromGroceryList),
        catchError((err: any) => {
          const message = 'Could not remove item from grocery list - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(removeItem)
    return removeItem
  }

  sortGroceryList(query: string, variables: any): Observable<GroceryList> {
    const sorted = this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(
        map((res) => res.data.sortGroceryList),
        catchError((err: any) => {
          const message = 'Could not sort grocery list - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(sorted)
    return sorted
  }

  resetGroceryList(query: string, variables: any): Observable<GroceryList> {
    const reset = this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(
        map((res) => res.data.resetGroceryList),
        catchError((err: any) => {
          const message = 'Could not reset grocery list - better tell Phil'
          this.errorService.showError(message)
          console.log(message, err)
          return throwError(err)
        })
      )
    this.loadingService.showLoaderUntilCompleted(reset)
    return reset
  }
}
