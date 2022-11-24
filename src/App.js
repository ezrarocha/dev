import './App.css';
import { bookData } from './data';
import BookItem from './components/BookItem';

bookData.forEach((item) => {
  item.image = process.env.PUBLIC_URL + "/" + item.image;
});

function App() {
  return (
    <div className="App">
      <h1>Star Wars</h1>
      <div className="item-grid">
      {bookData.map((item) => ( // TODO: map bakeryData to BakeryItem components
        <BookItem item={item}/>
      ))}
      </div>
    </div>
  );
}

export default App;
