export default function BookItem({item, updatePages}) {
    return (
        <div class="item-box">
            <img src={item.image}></img>
            <h2>{item.name}</h2>
            <h4>by {item.author}</h4>
            <p>
                <b>Released:</b> {item.date} &nbsp; &nbsp; &nbsp; <b>Page count:</b> {item.pages}
                <br></br>
                <b>Era:</b> {item.era}
                <br></br>
                <b>Series:</b> {item.series}
            </p>
            <p></p>
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