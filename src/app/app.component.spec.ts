import { componentFactoryName } from '@angular/compiler';
import { TestBed, async, ComponentFixtureAutoDetect, ComponentFixture, inject } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { share } from 'rxjs/operators';
import { AppComponent } from './app.component';
import { User } from './models/user.interface';
import { ShareDataService } from './services/share-data.service';

describe('AppComponent', () => {
  let shareDataService = new ShareDataService();  
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        AppComponent
      ],
      providers: [ShareDataService]
    }).compileComponents();
    spyOn(ShareDataService.prototype, 'setDummyUser');
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    shareDataService = TestBed.get(ShareDataService);  

  });

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should called setDummyUsercal to set the default value', () => {
    expect(shareDataService.setDummyUser).toHaveBeenCalled();
  });
    
  
});
