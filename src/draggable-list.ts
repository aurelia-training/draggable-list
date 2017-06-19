import {bindable} from "aurelia-framework";
import {ListGenerator} from "./list-generator";

export class DraggableList {

  @bindable listId:string;
  list:Object;
  listGenerator:ListGenerator = new ListGenerator();
  selectedElementIndex:number;
  elementList:HTMLElement;

  attached() {
    this.list = this.listGenerator.getList(this.listId).slice();
  }

  listIdChanged(newValue, oldValue) {
    if(!this.list) return;
    if(!ListGenerator.compare(this.list, this.listGenerator.getList(oldValue))) {
      if(confirm("Do you want to save your changes?")) {
        this.saveList(oldValue);
      }
    }
    this.attached();
  }

  static mousemoveHandler(event:MouseEvent) {
    //let listElements:HTMLCollection = document.getElementsByClassName("list-element");
    console.log(document._this.elementList);
    let listElements:HTMLCollection = document._this.elementList.children;
    let closestDistance:number = 1e5;
    let closestIndex:number = -1;
    for(let index = 0; index < listElements.length; index++) {
      if(Math.abs(event.clientY - listElements[index].getBoundingClientRect().top) < closestDistance) {
        closestIndex = index;
        closestDistance = Math.abs(event.clientY - listElements[index].getBoundingClientRect().top);
      }
    }
    var _this = document._this;
    if(closestIndex != _this.selectedElementIndex) {
      let thisList = _this.list;
      let thisElement = thisList.splice(_this.selectedElementIndex, 1);
      let resultList = thisList.slice(0, closestIndex).concat(thisElement);
      _this.list = resultList.concat(thisList.slice(closestIndex));
      _this.selectedElementIndex = closestIndex;
    }
  }
  static mouseupHandler() {
    document.removeEventListener("mousemove", DraggableList.mousemoveHandler);
    document.removeEventListener("mouseup", DraggableList.mouseupHandler);
    document._this.selectedElementIndex = -1;
  }
  select(index) {
    document.addEventListener("mousemove", DraggableList.mousemoveHandler);
    document.addEventListener("mouseup", DraggableList.mouseupHandler);
    document._this = this;
    this.selectedElementIndex = index;
  }
  saveList(oldValue:string) {
    this.listGenerator.saveList(oldValue || this.listId, this.list);
  }
  resetList() {
    this.list = this.listGenerator.getList(this.listId).slice();
  }

}
