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


function App() {
  const [state, setState] = useState({
    books: bookData,
    filters: new Set(),
  });
  // const [series, setSeries] = useState("All");
  // const selectSeries = 


  const [pages, setPages] = useState({
    pageCount: 0,
    booksRead: new Set()
  });

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
        <h1>Star Wars</h1>
      </div>
      <div className="main">
        <div className="side-bar">
          <FilterList 
            info={filterInfo}
            onFilterChange={handleFilterChange}/>
          Total page count: {pages.pageCount}
        </div>
        <div className="item-grid">
          {state.books.map(item => (
            <BookItem item={item} updatePages={handleUpdateCount}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;