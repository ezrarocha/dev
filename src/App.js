import './App.css';
import { useState } from "react";
import { bookData, seriesInfo, eraInfo, sortInfo } from './data';
import BookItem from './components/BookItem';

bookData.forEach((item) => {
  item.image = process.env.PUBLIC_URL + "/" + item.image;
});

function SortList({nSort, aSort, sortInfo}) {
  return (
  <div>
    <h3>Sort</h3>
    <p>
      <input 
        onChange={nSort}
        type="checkbox"
        checked={sortInfo[0].checked}/>
      By Title (A - Z)
    </p>
    <p>
      <input 
        onChange={aSort}
        type="checkbox"
        checked={sortInfo[1].checked}/>
      By Author (A - Z)
    </p>
  </div>
  )
}

function FilterList({seriesInfo, eraInfo, onFilterChange}) {
  const seriesList = seriesInfo.map((f) => (
    <p>
      <input 
        onChange={(e) => onFilterChange(e, f)}
        type="checkbox"
        value={f.filter}
        checked={f.checked}/>
      {f.filter}
    </p>    
  ));

  const eraList = eraInfo.map((f) => (
    <p>
      <input 
        onChange={(e) => onFilterChange(e, f)}
        type="checkbox"
        value={f.filter}
        checked={f.checked}/>
      {f.filter}
    </p>    
  ));

  return (
    <div>
      <h3>Series</h3>
      {seriesList}
      <h3>Eras</h3>
      {eraList}
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

function sortAndFilter(books, filters, nSort, aSort, checked, bRead) {
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
  if (aSort) {
    let c = [...newBooks]
    newBooks = c.sort(function (a,b) {
      if (a.author < b.author) {
        return -1;
      }
      if (a.author > b.author) {
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
  const [authorSorted, setAuthorSorted] = useState(false);


  const handleNameSort = (event) => {
    let newSort = !nameSorted
    setNameSorted(newSort)
    let c = sortInfo[0].checked
    sortInfo[0].checked = !c

    let b = sortAndFilter(bookData, filters, newSort, authorSorted, checked, booksRead)
    setState({books: b})
  }

  const handleAuthorSort = (event) => {
    let newSort = !authorSorted
    setAuthorSorted(newSort)
    let c = sortInfo[1].checked
    sortInfo[1].checked = !c

    let b = sortAndFilter(bookData, filters, nameSorted, newSort, checked, booksRead)
    setState({books: b})
  }

  const handleFilterChange = (event, filter) => {   
    const newFilters = filters

    filter.checked = !filter.checked
    if (event.target.checked) {
      newFilters.add(event.target.value)
    } else {
      newFilters.delete(event.target.value)
    }
    setFilters(newFilters)

    let b = sortAndFilter(bookData, newFilters, nameSorted, authorSorted, checked, booksRead)
    setState({books: b})
  }

  const handleReadList = (event) => {
    let newChecked = !checked
    setChecked(newChecked)

    let b = sortAndFilter(bookData, filters, nameSorted, authorSorted, newChecked, booksRead)
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

    let b = sortAndFilter(bookData, filters, nameSorted, authorSorted, checked, newBooksRead)
    setState({books: b})
  }

  const handleReset = (event) => {
    setState({books:bookData})
    setFilters(new Set())
    setBooksRead(new Set())
    setCount(0)
    setChecked(false)
    setNameSorted(false)
    sortInfo[0].checked = false
    sortInfo[1].checked = false
    bookData.forEach(book => {
      book.checked = false
    })
    seriesInfo.forEach(f => {
      f.checked = false
    })
    eraInfo.forEach(f => {
      f.checked = false
    })
  }
  
  return (
    <div className="App">
      <div className="Title">
        <h1>Star Wars Essential Legends Checklist</h1>
      </div>
      <div className="main">
        <div className="side-bar">
          <div>
            <button onClick={handleReset}>Reset All</button>
          </div>
          <SortList nSort={handleNameSort} aSort={handleAuthorSort} sortInfo={sortInfo}/>
          <FilterList 
            seriesInfo={seriesInfo}
            eraInfo={eraInfo}
            onFilterChange={handleFilterChange}/>
          <ReadList
            handler={handleReadList}/>
          Total pages read: {count}
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