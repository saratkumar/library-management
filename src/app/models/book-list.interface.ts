export class BookList {
    id: number;
    name: string;
    categoryId: number;
    published_on: string;
    status: string;
    volume: number;
    authors: string;
    quantity: number;
}

export class BorrowedList {
    id: number;
    book_id: number;
    book_name: string;
    book_authors: string;
    book_borrowed_on: string;
    book_due_date:string;    
}

