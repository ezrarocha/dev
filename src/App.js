import './App.css';
import { useState } from "react";
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

function sortAndFilter(books, filters, nSort, checked, bRead) {
  let newBooks = books
  console.log("hi")
  console.log(books)

  filters.forEach((filter) => {
    let currBooks = newBooks.filter(book => {
      return ((book.series === filter) || (book.era === filter))
    })
    newBooks = currBooks
  })
  if (nSort) {
    let c = [...newBooks]
    newBooks = c.sort(function (a,b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
  }
  if (checked) {
    let currBooks = newBooks.filter(book => {
      return (bRead.has(book))})
      newBooks = currBooks
  }
  newBooks.forEach(book => {
    if (bRead.has(book)) {
      book.checked = true
    } else {
      book.checked = false
    }
  })
  return (newBooks)
}



function App() {
  const [state, setState] = useState({books: bookData});
  const [filters, setFilters] = useState(new Set());

  const [count, setCount] = useState(0);
  const [booksRead, setBooksRead] = useState(new Set());
  const [checked, setChecked] = useState(false);
  const [nameSorted, setNameSorted] = useState(false);

  const handleNameSort = (event) => {
    let newSort = !nameSorted
    setNameSorted(newSort)

    let b = sortAndFilter(bookData, filters, newSort, checked, booksRead)
    setState({books: b})
  }

  const handleFilterChange = (event) => {   
    const newFilters = filters

    if (event.target.checked) {
      newFilters.add(event.target.value)
    } else {
      newFilters.delete(event.target.value)
    }
    setFilters(newFilters)

    let b = sortAndFilter(bookData, newFilters, nameSorted, checked, booksRead)
    setState({books: b})
  }

  const handleReadList = (event) => {
    // const newFilters = filters
    // const readBooks = booksRead
    // let newBooks = bookData
    let newChecked = !checked
    setChecked(newChecked)

    // if (event.target.checked) {
    //   newBooks = state.books.filter(book => {
    //     return (readBooks.has(book))
    //   })
    // } else if (newFilters.size) {
    //     newBooks = bookData.filter(book => {
    //       return (newFilters.has(book.series)||newFilters.has(book.era))
    //   })
    // }
    let b = sortAndFilter(bookData, filters, nameSorted, newChecked, booksRead)
    setState({books: b})
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

    let b = sortAndFilter(bookData, filters, nameSorted, checked, newBooksRead)
    setState({books: b})
  }

  // bookData.forEach(book => {
  //   if (booksRead.has(book)) {
  //     book.checked = true
  //   }
  //   else {
  //     book.checked = false
  //   }
  //   console.log(book.checked)
  //   console.log(booksRead)
  // });
  
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
                onChange={handleNameSort}
                type="checkbox"/>
              By Name
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