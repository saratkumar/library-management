import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { API_URLS } from '../constants/api_urls.constant';
import { CATEGORY_LIST } from '../constants/category-list.constant';
import { BookList, BorrowedList } from '../models/book-list.interface';
import { Category } from '../models/category-list.interface';
import { User } from '../models/user.interface';
import { ShareDataService } from '../services/share-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{

  searchForm: FormGroup;
  masterBookList: BookList[] = [];
  bookList: BookList[] = [];
  listOfBookCategory: Category[] = CATEGORY_LIST;
  userDetails: User;

  constructor(private shareDataService: ShareDataService, private httpService: HttpClient) {
    // Form group controls
    this.searchForm = new FormGroup({
      userSearchValue: new FormControl('', [])
    });
    // User search function returns books which matches users value
    this.searchForm.get('userSearchValue').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(data => { this.filterResults(data) });

    // To load initial data
    this.masterBookList = this.shareDataService.getBookList();
    this.getBooksList();
  }

  // @Get Api - Get list of books from samples JSON
  getBooksList(): void {
    /*****Setting up default user details****/
    if(!this.shareDataService.getActiveUser()) {
      this.shareDataService.setDummyUser();
    }

    /*****re-using data if data is already available else we need to do REST API call */
    if(!this.bookList || !this.bookList.length) {
      this.httpService.get(API_URLS.getBookList).subscribe((success: BookList[]) => {
        this.shareDataService.setBookList(success);
        this.processBookDetails(success);
      }, error =>{console.log(error)});
    } else {
      this.processBookDetails(this.shareDataService.getBookList());
    }
  }

/***** Manipulation of bookList based on our requirement ***
 * @param bookList:BookList
 * **/
  processBookDetails(bookList: BookList[]) {
    this.masterBookList = bookList;
    this.userDetails = this.shareDataService.getActiveUser();
    if (this.userDetails.borrowedList && this.userDetails.borrowedList.length) {
      this.userDetails.borrowedList.forEach(borrowedBook => {
        this.masterBookList.find(el => el.id === borrowedBook.book_id)['isBorrowed'] = true;
      });
    }

    this.bookList = this.masterBookList.filter(el => el.quantity); //for initial load
  }

  /***For filtering results 
   * @params  userSearchValue, category
   * ***/

  filterResults(value: any, isCategory?: boolean) {
    this.bookList = isCategory ? this.masterBookList.filter(el => !value ? el : el.categoryId === value) : this.masterBookList.filter(el => el.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  /***For adding books to borrwoed list
   * @param book: BookList, index (booklist)
   * **** */

  addToBorrowedList(book: BookList, index: number) {
    let errorMessage:string = '';
    if (this.userDetails.borrowedList && this.userDetails.borrowedList.length > 1) {
      errorMessage = "User restricted to borrow more than 2 books.";
      alert(errorMessage);
      return errorMessage;
    } else if (this.userDetails.borrowedList.find(borrowedBook => borrowedBook.book_id === book.id)) {
      errorMessage = `${book.name} book already available in the borrowed list.`;
      alert(errorMessage);
      return errorMessage;
    }
    let borrowedBook: BorrowedList = {
      id: Math.random(),
      book_id: book.id,
      book_name: book.name,
      book_authors: book.authors,
      book_borrowed_on: new Date().toDateString(),
      book_due_date: new Date().toDateString(),
    }
    book.quantity = book.quantity - 1;
    this.userDetails.borrowedList.push(borrowedBook);
    this.shareDataService.setActiveUser(this.userDetails);
    this.shareDataService.setBookList(this.masterBookList);
    !book.quantity && this.bookList.splice(index, 1);
  }
}
