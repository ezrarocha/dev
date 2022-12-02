export default function BookItem({item, updatePages}) {
    return (
        <div class="item-box">
            <img src={item.image}></img>
            <h2>{item.name}</h2>
            <p>
                <b>Author:</b> {item.author}
                <br></br>
                <b>Orginally released:</b> {item.date}
            </p>
            <input 
            onChange={(e) => updatePages(e, item)}
            type="checkbox"
            value={item.pages}
            checked={item.checked}/>
            Already read!
            {/* <button onClick={() => updatePages(item.name, item.price)}>Already Read!</button> */}
        </div>
    );
}