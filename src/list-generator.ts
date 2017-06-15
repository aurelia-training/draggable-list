export class ListGenerator {
  
  lists = {
    fibonacci: [],
    people: [],
    integers: []
  };

  getList(listId:string) {
    return this.lists[listId];
  }

  saveList(listId:string, updatedList) {
    this.lists[listId] = updatedList.slice();
  }

  static compare(list1, list2) {
    return list1.length == list2.length && list1.every(function(element, index) {
      return element === list2[index];
    });
  }

  constructor() {
    this.lists.fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    this.lists.integers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.lists.people = ["John Doe", "Jane Peterson", "Maggie Ewald", "Adam Johnson", "Bob Senford", "Carol Tanner"];
  }

}
