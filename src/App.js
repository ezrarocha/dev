import './App.css';
import { useState, useCallback} from "react";
import { bookData, filterInfo } from './data';
import BookItem from './components/BookItem';


bookData.forEach((item) => {
  item.image = process.env.PUBLIC_URL + "/" + item.image;
});

function FilterList(props) {
  const { 
    info,
    onFilterChange,
  } = props

  const list = info.map((category) => (
    <div>
      <h3>{category.title}</h3>
      {category.filters.map(filter => 
        <p>
          <input 
            onChange={onFilterChange}
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

function BookList(props) {
  const { books } = props
  
  return (
    <div className="item-grid">
      {books.map(item => (
        <BookItem item={item} />
      ))}
    </div>
  )
}

function App() {
  const [state, setState] = useState({
    books: bookData,
    filters: new Set(),
  });

  const handleFilterChange = useCallback(event => {
    setState(previousState => {
      let filters = new Set(previousState.filters)
      let books = bookData
      
      if (event.target.checked) {
        filters.add(event.target.value)
      } else {
        filters.delete(event.target.value)
      }
      
      if (filters.size) {
        books = books.filter(book => {
          return (filters.has(book.series)||filters.has(book.era))
        })
      }
      return {
        filters,
        books,
      }
    })
  }, [setState])

  // const filteredData = bookData.filter(matchesFilterType);

  // const selectFilterType = eventKey => {
  //   setType(eventKey);
  // };

  // const matchesFilterType = item => {
  //   // all items should be shown when no filter is selected
  //   if(type === "All") { 
  //     return true
  //   } else if (type === item.type) {
  //     return true
  //   } else {
  //     return false
  //   }
  // };  
  
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
        </div>
        <BookList books={state.books}/>
      </div>
    </div>
  );
}

export default App;