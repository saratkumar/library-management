import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MyAccountComponent } from './my-account.component';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ShareDataService } from '../services/share-data.service';
import { TEST_BOOK_LIST_DATA, API_URLS } from '../constants/api_urls.constant';
import { BookList } from '../models/book-list.interface';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { User } from '../models/user.interface';
import { ReactiveFormsModule } from '@angular/forms';

describe('MyAccountComponent', () => {
  let component: MyAccountComponent;
  let dashboardComponent: DashboardComponent;
  let fixture: ComponentFixture<MyAccountComponent>;
  let dashboardComponentFixture: ComponentFixture<DashboardComponent>
  let shareDataService = new ShareDataService();
  let httpTestingController: HttpTestingController;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        HttpClientTestingModule,
        ReactiveFormsModule 
      ],
      declarations: [ MyAccountComponent, DashboardComponent ]
    })
    .compileComponents();
    httpTestingController = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountComponent);
    component = fixture.componentInstance;
    dashboardComponentFixture = TestBed.createComponent(DashboardComponent);
    dashboardComponent = dashboardComponentFixture.componentInstance;
    shareDataService = TestBed.get(ShareDataService);  
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Story 4 - , If user borrowing more than 2 books, then should restrict user with error message
  it('Story 4 - should add a book to the borrowed list', fakeAsync(() => {
    let response = JSON.parse(JSON.stringify(TEST_BOOK_LIST_DATA));
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    req.flush(response);
    tick();
    httpTestingController.verify();
    const bookList: BookList[] = shareDataService.getBookList();
    // Before adding book to borrowed list, the length of the booklist will be 1.
    dashboardComponent.addToBorrowedList(bookList[0], 0);
    // length of the borrowed booklist will be 2.
    dashboardComponent.addToBorrowedList(bookList[1], 1);
    let user: User = shareDataService.getActiveUser();
    expect(user.borrowedList.length).toEqual(2);
    console.log(user);
  }));  

  //Story 4 - , When, I return one book to the library Then, the book is removed from my borrowed list And, the library reflects the updated stock of the book
  it('Story 4 - Library should reflect the updated stock of the book, once user return the book from the borrowed list', fakeAsync(() => {
    let response = JSON.parse(JSON.stringify(TEST_BOOK_LIST_DATA));
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    req.flush(response);
    tick();
    httpTestingController.verify();
    const bookList: BookList[] = shareDataService.getBookList();
    // Before adding book to borrowed list, the length of the booklist will be 1.
    dashboardComponent.addToBorrowedList(bookList[0], 0);
    // length of the borrowed booklist will be 2.
    dashboardComponent.addToBorrowedList(bookList[1], 1);
    component.userDetails = shareDataService.getActiveUser();
    // before returning the first book, quantity of that book is 2.
    expect(bookList[0].quantity).toEqual(2);
    // after the return, quantity of that book will be 3.
    component.removeFromBorrowedList(component.userDetails.borrowedList[0], 0);
    expect(bookList[0].quantity).toEqual(3);
    
  }));  

  //Story 4 - , When, I return one book to the library Then, the book is removed from my borrowed list And, the library reflects the updated stock of the book
  it('Story 4 - Library should reflect the updated stock of the book, once user return all the book from the borrowed list and should display no records found in my borrowed list.', fakeAsync(() => {
    let response = JSON.parse(JSON.stringify(TEST_BOOK_LIST_DATA));
    const req = httpTestingController.expectOne(API_URLS.getBookList);
    req.flush(response);
    tick();
    httpTestingController.verify();
    const bookList: BookList[] = shareDataService.getBookList();
    // Before adding book to borrowed list, the length of the booklist will be 1.
    dashboardComponent.addToBorrowedList(bookList[0], 0);
    // length of the borrowed booklist will be 2.
    dashboardComponent.addToBorrowedList(bookList[1], 1);
    component.userDetails = shareDataService.getActiveUser();
    // before returning the first book, quantity of that book is 2.
    expect(bookList[0].quantity).toEqual(2);
    // after the return, quantity of that book will be 3.
    component.removeFromBorrowedList(component.userDetails.borrowedList[0], 0);
    // book copy added in dashboard quantity
    expect(bookList[0].quantity).toEqual(3);
    // Removing 2nd book from the borrowed list
    component.removeFromBorrowedList(component.userDetails.borrowedList[0], 0);
    // book copy added in dashboard quantity
    expect(bookList[1].quantity).toEqual(1);

    // After removing both the records, my borrowed list should show no records message
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#myAccountErrorMessage').textContent).toContain('No records found. Go to');

  }));  
});
