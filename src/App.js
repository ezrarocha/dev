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


function App() {
  const [state, setState] = useState({
    books: bookData,
    filters: new Set(),
  });

  const [count, setCount] = useState(0);
  const [booksRead, setBooksRead] = useState(new Set());
  const [checked, setChecked] = useState(false);

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

  const handleFilterChange = (event) => {   
    const newFilters = state.filters
    let newBooks = bookData
    
    if (event.target.checked) {
      newFilters.add(event.target.value)
    } else {
      newFilters.delete(event.target.value)
    }

    if (checked) {
      if (newFilters.size) {
        newBooks = bookData.filter(book => {
          return (booksRead.has(book) && (newFilters.has(book.series) || newFilters.has(book.era)))
        })
      }
      else {
        newBooks = bookData.filter(book => {
          return (booksRead.has(book))
        })
      }
    } else if (newFilters.size) {
      newBooks = bookData.filter(book => {
        return (newFilters.has(book.series)|| newFilters.has(book.era))
      })
    }
    setState({books: newBooks, filters: newFilters})
  }

  const handleReadList = (event) => {
    const newFilters = state.filters
    const readBooks = booksRead
    let newBooks = bookData
    let newChecked = !checked

    if (event.target.checked) {
      newBooks = state.books.filter(book => {
        return (readBooks.has(book))
      })
    } else if (newFilters.size) {
        newBooks = bookData.filter(book => {
          return (newFilters.has(book.series)|| newFilters.has(book.era))
      })
    }
    setState({books: newBooks, filters: newFilters})
    setChecked(newChecked)
  }

  const handlePageCount = (event, item) => {
    let newCount = count
    let newBooksRead = new Set(booksRead)
      
    if (event.target.checked) {
      newCount = newCount + Number(event.target.value)
      newBooksRead.add(item)
    } else {
      newCount = newCount - Number(event.target.value)
      newBooksRead.delete(item)
    }
    setCount(newCount)
    setBooksRead(newBooksRead)
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
                onChange={handleDateChange}
                type="checkbox"/>
              By Date
            </p>
          </div>
          <FilterList 
            info={filterInfo}
            onFilterChange={handleFilterChange}/>
          <ReadList
            handler={handleReadList}/>
          Total page count: {count}
        </div>
        <div className="item-grid">
          {state.books.map(item => (
            <BookItem item={item} key={item.id} updatePages={handlePageCount}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;