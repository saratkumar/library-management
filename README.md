# LibraryManagement

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## NPM Modules

Run `npm install` to install the node modules. 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Git LOG

Run `git log` to display the commits 


## About Project 

********Components***********
1. AppComponent
    I. Based on routes component will get render in this component.
    II. it will set the default value for the current user.

2. DashboardComponent
    I.   It will display all the available books in library.
    II.  User can search book using book name in search section, based on user value it will display the books which matches book name.
    III. If books are not available, then it will display no records found error message.
    IV.  User can borrow the copy of book in the library using "borrow" action.
            a) Maximum limit for borrow is 2
            b) if the user borrows more than 2 error message, then it will throw error message.
            c) if the user try to borrow already borrowed book, then it will throw error message.
    V.   Once user borrow the book form the library, changes will be reflected on the dashboard quantity column.
    VI.  Addition Info: User can filter books based on categories.
    VII. User can have option to navigate to their borrowed list using "My Account" menu
    VIII.User can navigate to Home page using Home menu

3. MyAccountComponent
    I.   User can see their borrowed list here. 
    II.  Once user return the borrowed book, then the changes will be reflecetd on dashboard page.
    III. If the user returns all the books from the borrowed list, then system will display error message.

4. ShareDataService
    I.   ShareDataService will be used for storing the active user related information.
    II   Once system fetch the library books details from the local json, it will store data. for further process, data will be 
         processed from the cache. 


********Interfaces*********** src/app/models
    1. Book List 
    2. Category List
    3. User

********Constants*********** src/app/constants
    1. API_URL 
        i.  this will contains the URL for the fetch API's
        ii. this will contains sample data for the testing purpose.
    2. Category List    


## Note

1. Unit Testcase results attached with the mail as a attachment.
2. Font family will be different from system to system. 

