import { Component, OnInit } from '@angular/core';
import { BookList, BorrowedList } from '../models/book-list.interface';
import { User } from '../models/user.interface';
import { ShareDataService } from '../services/share-data.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  borrowedBookList: BorrowedList[] = [];
  userDetails: User;
  constructor(private shareDataService: ShareDataService) { 
    this.userDetails = this.shareDataService.getActiveUser();
    this.borrowedBookList = this.userDetails ? this.userDetails.borrowedList : this.borrowedBookList;
  }

  removeFromBorrowedList(borrowedBook: BorrowedList, index:number) {
    let bookList: BookList[] = this.shareDataService.getBookList();
    bookList.map(el => {
      if(el.id === borrowedBook.book_id) {
        el.quantity = el.quantity + 1;
      }
    });
    this.shareDataService.setBookList(bookList);
    this.userDetails.borrowedList.splice(this.userDetails.borrowedList.findIndex(el => el.id === borrowedBook.id), 1);
    this.shareDataService.setActiveUser(this.userDetails);
    this.borrowedBookList.splice(index, 1);
  }

  
}
