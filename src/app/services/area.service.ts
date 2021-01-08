import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import Area from '../models/Area'
import Item from '../models/Item'
import GroceryList from '../models/GrocerList'
import { LoadingService } from '../services/loading.service'

interface IResponse {
  data: {
    areas: Area[]
    area: Area
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
}

//const uri = 'http://localhost:4000/graphql'
const uri = '/graphql'
//const uri = 'http://10.22.33.128:4000/graphql'
@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private listId = ''

  constructor(private http: HttpClient, private loadingService: LoadingService) {
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

  addItemToList(query: string, itemId: string): Observable<GroceryList> {
    return this.http
      .post<IResponse>(uri, {
        query,
        variables: {
          groceryId: this.listId,
          itemId
        }
      })
      .pipe(map((res) => res.data.addItemToGroceryList))
  }

  getAreas(queryString: string): Observable<Area[]> {
    const loadAreas = this.http
      .post<IResponse>(uri, {
        query: queryString
      })
      .pipe(map((res) => res.data.areas))

    this.loadingService.showLoaderUntilCompleted(loadAreas).subscribe()
    return loadAreas
  }

  addArea(image: File | null, operations: IOperations): Observable<any> {
    const varmap = { image: ['variables.image'] }
    const fd = new FormData()
    fd.append('operations', JSON.stringify(operations))
    if (image) {
      fd.append('map', JSON.stringify(varmap))
      fd.append('image', image, image.name)
    }

    return this.http.post(uri, fd, {
      reportProgress: true,
      observe: 'events'
    })
  }

  updateArea(image: File | null, operations: IOperations): Observable<any> {
    if (image) {
      const varmap = { image: ['variables.image'] }
      const fd = new FormData()
      fd.append('operations', JSON.stringify(operations))
      fd.append('map', JSON.stringify(varmap))
      fd.append('image', image, image.name)

      return this.http.post(uri, fd, {
        reportProgress: true,
        observe: 'events'
      })
    } else {
      return this.http.post(
        uri,
        {
          query: operations.query,
          variables: operations.variables
        },
        {
          reportProgress: true,
          observe: 'events'
        }
      )
    }
  }

  getItemsForArea(queryString: string, areaId: string): Observable<Item[]> {
    return this.http
      .post<IResponse>(uri, {
        query: queryString,
        variables: {
          areaId
        }
      })
      .pipe(map((res) => res.data.getItemsForArea))
  }

  addItemToArea(queryString: string, variables: Vars): Observable<Item> {
    return this.http
      .post<IResponse>(uri, {
        query: queryString,
        variables: {
          name: variables.name,
          areaId: variables.areaId
        }
      })
      .pipe(map((res) => res.data.addItemToArea))
  }

  deleteItemFromArea(queryString: string, variables: Vars): Observable<Item> {
    return this.http
      .post<IResponse>(uri, {
        query: queryString,
        variables
      })
      .pipe(map((res) => res.data.deleteItemFromArea))
  }

  updateItem(query: string, variables: Vars): Observable<Item> {
    return this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(map((res) => res.data.updateItem))
  }

  deleteArea(query: string, variables: Vars): Observable<Area> {
    return this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(map((res) => res.data.deleteArea))
  }

  getGroceryList(query: string): Observable<GroceryList> {
    return this.http
      .post<IResponse>(uri, {
        query,
        variables: {
          groceryId: this.listId
        }
      })
      .pipe(map((res) => res.data.groceryList))
  }

  removeItemFromList(query: string, itemId: string): Observable<GroceryList> {
    return this.http
      .post<IResponse>(uri, {
        query,
        variables: {
          groceryId: this.listId,
          itemId
        }
      })
      .pipe(map((res) => res.data.removeItemFromGroceryList))
  }

  sortGroceryList(query: string, variables: any): Observable<GroceryList> {
    return this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(map((res) => res.data.sortGroceryList))
  }

  resetGroceryList(query: string, variables: any): Observable<GroceryList> {
    return this.http
      .post<IResponse>(uri, {
        query,
        variables
      })
      .pipe(map((res) => res.data.resetGroceryList))
  }
}
