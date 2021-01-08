import { Component, OnInit } from '@angular/core'
import Item from '../../models/Item'
import GroceryList from '../../models/GrocerList'
import { AreaService } from '../../services/area.service'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { ToastService } from '../../services/toast.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AddItemModalComponent } from '../grocery-detail/add-item-modal/add-item-modal.component'

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss']
})
export class GroceryListComponent implements OnInit {
  groceryList: GroceryList | null = null
  sortedItems: Item[] | null = null
  groceryListId = ''

  constructor(private areaService: AreaService, private toastService: ToastService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getUpdatedGroceryList()
  }

  removeItem(item: Item): void {
    const query = `
    mutation RemoveItemFromGroceryList($groceryId: ID!, $itemId: ID!) {
      removeItemFromGroceryList(groceryId: $groceryId, itemId: $itemId) {
        _id
      }
    }
    `
    this.areaService.removeItemFromList(query, item._id).subscribe((list) => {
      if (list._id) {
        this.getUpdatedGroceryList()
      }
    })
  }

  getUpdatedGroceryList(): void {
    const query = `
    query GroceryList {
      groceryList {
      _id
      items {
        _id
        name
      }
      }
    }
    `
    this.areaService.getGroceryList(query).subscribe((list) => {
      this.groceryListId = list._id
      // De-dupe items and add qty property
      /*
      const uniqueItems: Item[] = []
      list.items.forEach((item: Item) => {
        // see if item exist in uniqueItems
        const foundItem = uniqueItems.find((i: Item) => i._id === item._id)
        if (!foundItem) {
          item.qty = 1
          uniqueItems.push(item)
        } else if (foundItem.qty) {
          foundItem.qty += 1
        }
      })
      */
      this.deDupeItems(list)
      if (list.items.length > 0) {
        this.groceryList = list
      } else {
        this.groceryList = null
      }
    })
  }

  deDupeItems(list: GroceryList): GroceryList {
    const uniqueItems: Item[] = []
    list.items.forEach((item: Item) => {
      // see if item exist in uniqueItems
      const foundItem = uniqueItems.find((i: Item) => i._id === item._id)
      if (!foundItem) {
        item.qty = 1
        uniqueItems.push(item)
      } else if (foundItem.qty) {
        foundItem.qty += 1
      }
    })

    if (uniqueItems.length > 0) {
      list.items = uniqueItems
    }
    return list
  }

  onItemDrop(e: CdkDragDrop<Item[]>) {
    if (e.previousContainer === e.container) {
      moveItemInArray(e.container.data, e.previousIndex, e.currentIndex)
    } else {
      transferArrayItem(e.previousContainer.data, e.container.data, e.previousIndex, e.currentIndex)
    }

    // Now we have a sorted array - we need to sort this on the server as well for persistence
    // Since the server stores multiple copies of each item in the array without a qty value
    // we will need to undo what we did earlier
    if (this.groceryList?.items) {
      this.sortedItems = []

      this.groceryList.items.forEach((item: Item) => {
        if (item.qty) {
          for (let i = 1; i <= item.qty; i++) {
            const updatedItem = {
              _id: item._id,
              name: item.name,
              _v: 0
            }
            this.sortedItems?.push(updatedItem)
          }
        }
      })
      this.sortItems(this.sortedItems)
    }
  }

  sortItems(sortedItems: Item[]) {
    const query = `
    mutation SortGroceryList($groceryId: ID!, $sortedItems: [ItemInput]) {
      sortGroceryList(groceryId: $groceryId, sortedItems: $sortedItems) {
        _id
        items {
          _id
          name
        }
      }
    }
    `
    const variables = {
      groceryId: this.groceryListId,
      sortedItems
    }

    this.areaService.sortGroceryList(query, variables).subscribe((list) => {
      if (list._id) {
        const deDupedList = this.deDupeItems(list)
        if (deDupedList.items.length > 0) {
          this.groceryList = deDupedList
        } else {
          this.groceryList = null
        }
      }
    })
  }

  onResetClick() {
    const query = `
    mutation ResetGroceryList($groceryId: ID!) {
      resetGroceryList(groceryId: $groceryId) {
        _id
        items {
          _id
          name
        }
      }
    }
    `

    const variables = {
      groceryId: this.groceryListId
    }

    this.areaService.resetGroceryList(query, variables).subscribe(() => {
      this.getUpdatedGroceryList()
    })
  }

  open() {
    const modalRef = this.modalService.open(AddItemModalComponent)
    modalRef.closed.subscribe((value) => {
      if (value?._id) {
        if (this.groceryList?.items) {
          this.groceryList.items.push(value)
        }
        this.toastService.show('Item Added', { classname: 'mr-4 ml-auto bg-success text-light' })
      }
    })
  }
}
