import './App.css';
import { useState, useCallback} from "react";
import { bookData, filterInfo } from './data';
import BookItem from './components/BookItem';

bookData.forEach((item) => {
  item.image = process.env.PUBLIC_URL + "/" + item.image;
});

function FilterList({info, onFilterChange}) {
  const list = info.map((category) => (
    <div>
      <h3>{category.title}</h3>
      {category.filters.map(filter => 
        <p>
          <input 
            onChange={(e) => onFilterChange(e, category.title)}
            type="checkbox"
            value={filter}/>
          {filter}
        </p>
      )}
    </div>
  ));

  return (
    <div>
      {list}
    </div>
  )
}

function ReadList({handler}) {
  return (
  <div>
    <h3>View Completed Reads</h3>
    <input 
    onChange={handler}
    type="checkbox"/>
  </div>
  )
}

// function BookGrid({books, booksRead, checked, handler}) {
//   let booksShown;
//   if (checked) {
//     booksShown = booksRead;
//   } else {
//     booksShown = books
//   }
//   return (
//     <div className="item-grid">
//       {books.map(item => (
//         <BookItem item={item} updatePages={handler}/>
//       ))}
//     </div>
//   )
// }

function App() {
  const [state, setState] = useState({
    books: bookData,
    filters: new Set(),
  });

  const [pages, setPages] = useState({
    pageCount: 0,
    booksRead: new Set()
  });

  const handleDateChange = (event) => {
    const currFilters = state.filters 
    let copy1 = [...state.books]
    let copy2 = [...state.books]
    let currBooks = copy1.sort((a,b) => a.id - b.id);
    let sortedBooks = copy2.sort((a,b) => 
    new Date(a.date.split("-").reverse()) - new Date(b.date.split("-").reverse()));
    
    if (event.target.checked) {
      setState({books: sortedBooks, filters: currFilters});
    }
    else {
      setState({books: currBooks, filters: currFilters});
    }
  }

  const handleFilterChange = (event, title) => {   
    const newFilters = state.filters
    let newBooks = bookData
    
    if (event.target.checked) {
      newFilters.add(event.target.value)
    } else {
      newFilters.delete(event.target.value)
    }
    if (newFilters.size) {
      newBooks = bookData.filter(book => {
        return (newFilters.has(book.series)|| newFilters.has(book.era))
      })
    }
    setState({books: newBooks, filters: newFilters})
  }

  const handleReadList = (event) => {
    const newFilters = state.filters
    const readBooks = pages.booksRead
    let newBooks = bookData
    if (event.target.checked) {
      newBooks = state.books.filter(book => {
        return (readBooks.has(book))
      })
    } else {
      if (newFilters.size) {
        newBooks = bookData.filter(book => {
          return (newFilters.has(book.series)|| newFilters.has(book.era))
        })
      }
    }
    setState({books: newBooks, filters: newFilters})
  }

  const handleUpdateCount = (event, item) => {
    let newCount = pages.pageCount
    let newBooksRead = new Set(pages.booksRead)
      
    if (event.target.checked) {
      newCount = newCount + Number(event.target.value)
      newBooksRead.add(item)
    } else {
      newCount = newCount - Number(event.target.value)
      newBooksRead.delete(item)
    }
    setPages({pageCount: newCount, booksRead: newBooksRead})
  }
  
  return (
    <div className="App">
      <div className="Title">
        <h1>Star Wars Essential Legends Checklist</h1>
      </div>
      <div className="main">
        <div className="side-bar">
          <div>
            <h3>Sort</h3>
            <p>
              <input 
                onChange={(e) => handleDateChange(e)}
                type="checkbox"/>
              By Date
            </p>
          </div>
          <FilterList 
            info={filterInfo}
            onFilterChange={handleFilterChange}/>
          <ReadList
            handler={handleReadList}/>
          Total page count: {pages.pageCount}
        </div>
        <div className="item-grid">
          {state.books.map(item => (
            <BookItem item={item} key={item.id} updatePages={handleUpdateCount}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;