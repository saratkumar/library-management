import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareDataService } from '../services/share-data.service';
import { HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { API_URLS, TEST_BOOK_DATA, TEST_BOOK_LIST_DATA } from '../constants/api_urls.constant';
import { BookList, BorrowedList } from '../models/book-list.interface';
import { User } from '../models/user.interface';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let shareDataService = new ShareDataService();  
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [ DashboardComponent ]
    })
    .compileComponents();
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    shareDataService = TestBed.get(ShareDataService);  
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Story 1 - , I see an empty library

  it('Story 1 - should show no records found message if no books are in the library', fakeAsync(() => { 
    let response = [];
    httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    expect(req.request.method).toEqual("GET");
    req.flush(response);

    // Call tick whic actually processes te response
    tick();
    httpTestingController.verify();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#errorMessage').textContent).toContain(' -No records found. We will let you know soon. Please try our New Adventure Arrivals');
  }));

//Story 1 - , I see books in the library

  it('Story 1 - should return all the available books and hide the No records found error message', fakeAsync(() => {
    let response = TEST_BOOK_DATA;
    httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
    
    // Call tick whic actually processes te response
    tick();
    httpTestingController.verify();
    expect(shareDataService.getBookList().length).toEqual(1);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    //if we the get the response then, it should display those details in table
    expect(compiled.querySelector('table').rows.length).toEqual(1);

    // if we get the response, should hide the error message
    expect(compiled.querySelector('#errorMessage')).toBeNull();
  }));

  //Story 2 - , I choose a book to add to my borrowed list

  it('Story 2 - should add book to borrowed list, then book will be removed from library(Dashboard)', fakeAsync(() => {
    let response = TEST_BOOK_DATA;
    httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    req.flush(response);
    tick();
    httpTestingController.verify();
    const bookList: BookList[] = shareDataService.getBookList();

    // Before adding book to borrowed list, the length of the booklist will be 1.
    component.addToBorrowedList(bookList[0], 0);
    const user: User = shareDataService.getActiveUser();
    expect(user.borrowedList.length).toEqual(1);

    //now the borrowed book should be removed from the dashboard and added to my account
    expect(component.bookList.length).toEqual(0);
  }));

  //Story 2 - , If user borrowing more than 2 books, then should restrict user with error message
  it('Story 2 - should add a book to the borrowed list, then book will be removed from library(Dashboard)', fakeAsync(() => {
    let response = JSON.parse(JSON.stringify(TEST_BOOK_LIST_DATA));
    httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    req.flush(response);
    tick();
    httpTestingController.verify();
    const bookList: BookList[] = shareDataService.getBookList();

    // Before adding book to borrowed list, the length of the booklist will be 1.
    component.addToBorrowedList(bookList[0], 0);
    // length of the borrowed booklist will be 2.
    component.addToBorrowedList(bookList[1], 1);

    //once the borrowed list reaches the limit, it will not add any further books in the list instead return the error message
    const errorMessage = component.addToBorrowedList(bookList[2], 1);
    expect(errorMessage).toEqual('User restricted to borrow more than 2 books.');
  }));  

  // Story 3 - User can borrow a copy of a book from the library
  it('Story 3 - should decrease the book count in the library, once a book has been added to the borrowed list', fakeAsync(() => {
    
    let response = JSON.parse(JSON.stringify(TEST_BOOK_LIST_DATA)); // to break the object mutation
    httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    req.flush(response);
    tick();
    httpTestingController.verify();
    const bookList: BookList[] = shareDataService.getBookList();
    const quantity = bookList[0].quantity;
    // before adding a book to the borrowed list, quantity will be 3
    expect(bookList[0].quantity).toEqual(quantity);
    component.addToBorrowedList(bookList[0], 0);
    // after adding the book to the borrowed list, quantity will be decreased to 2 
    expect(bookList[0].quantity).toEqual(quantity-1);

  }));

  it('Story 3 - If there is only one copy of a book in the library, User wants to add it to the borrowed list now copy of book will be added in borrowed list and removed from the booklist(dashboard)', fakeAsync(() => {

    let response = JSON.parse(JSON.stringify(TEST_BOOK_LIST_DATA)); // to break the object mutation
    httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    req.flush(response);
    tick();
    httpTestingController.verify();
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const bookList: BookList[] = shareDataService.getBookList();
    //number of copies before user borrowing it
    expect(compiled.querySelector('table').rows.length).toEqual(component.bookList.length);
    // after a copy of a book borrowed by the user, if the borrowed book entry in the library should be removed.
    component.addToBorrowedList(bookList[1], 1);
    fixture.detectChanges();
    expect(compiled.querySelector('table').rows.length).toEqual(component.bookList.length);
  }));

  it('Story 3 - should throw an error, if user try to get a copy of book which is already in the borrowed list', fakeAsync(() => {

    let response = JSON.parse(JSON.stringify(TEST_BOOK_LIST_DATA)); // to break the object mutation
    httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    req.flush(response);
    tick();
    httpTestingController.verify();
    const bookList: BookList[] = shareDataService.getBookList();
    // borrowing one copy of book
    component.addToBorrowedList(bookList[0], 0);
    //borrowing another copy of same book
    const errorMessage = component.addToBorrowedList(bookList[0], 0);
    expect(errorMessage).toContain(`${bookList[0].name} book already available in the borrowed list.`)
  }));

  it('should return booklist based on user filtered value', fakeAsync(() =>{
    let response = JSON.parse(JSON.stringify(TEST_BOOK_LIST_DATA)); // to break the object mutation
    httpTestingController = TestBed.get(HttpTestingController);
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    req.flush(response);
    tick();
    httpTestingController.verify();
    let userSearchValue = 'A Manifesto';
    component.filterResults(userSearchValue);
    expect(component.bookList.find(el => el.name.indexOf(userSearchValue) >-1)).toBeTruthy();
    // should return all the books if value is not present
    userSearchValue = '';
    component.filterResults(userSearchValue);
    expect(component.bookList.length).toBe(response.length);
  }));
});
