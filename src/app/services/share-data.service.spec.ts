import { TestBed, inject } from '@angular/core/testing';
import { BookList } from '../models/book-list.interface';
import { User } from '../models/user.interface';

import { ShareDataService } from './share-data.service';

describe('ShareDataService', () => {
  let service = new ShareDataService();  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShareDataService]
    });
  });

  it('should be created', inject([ShareDataService], (service: ShareDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should set setActiveUser', inject([ShareDataService], (service: ShareDataService) => {
    let data:User = { id: 1, name: 'MSD', borrowedList: []};
    service.setActiveUser(data);
    expect(service.activeUser.name).toContain('MSD');
  }));

  it('should get active user value and return false if active user data doesnt match', inject([ShareDataService], (service: ShareDataService) => {
    let data: User = { id: 1, name: 'MSD', borrowedList: [] };
    service.setActiveUser(data);
    const activeUser = service.getActiveUser();
    const isVerfiedUser = activeUser.name === 'VIRAT';
    expect(isVerfiedUser).toBeFalsy();
  }));

  it('should return stored book list', ()=> {
    let data: BookList[] = [{id: 1, name: '', categoryId: 1, published_on: '', status: '', volume:123, authors: '', quantity:5}];
    service.setBookList(data);
    const bookList: BookList[] = service.getBookList();
    expect(bookList.length).toEqual(1);
  });
});
