import { BorrowedList } from "./book-list.interface";

export class User {
    id:number;
    name:string;
    borrowedList: Array<BorrowedList>
}