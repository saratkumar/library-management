import { Injectable } from '@angular/core';
import { BookList } from '../models/book-list.interface';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  
  activeUser: any;
  bookList: BookList[] = [];
  
  constructor() { }

  setActiveUser(user: User) {
    this.activeUser = user;
  }

  getActiveUser() {
    return this.activeUser;
  }

  getBookList() {
    return this.bookList;
  }

  setBookList(bookList: BookList[]) {
    this.bookList = bookList;
  }

  setDummyUser() {
    this.setActiveUser({ id: 1, name: "Aiden", borrowedList: [] });
  }


}
