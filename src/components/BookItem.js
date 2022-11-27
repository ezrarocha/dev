export default function BookItem({item}) {
    return (
        <div class="item-box">
            <img src={item.image}></img>
            <h2>{item.name}</h2>
            <p>
                <b>Author:</b> {item.author}
                <br></br>
                <b>Orginally released:</b> {item.date}
            </p>
            <button >Already Read!</button>
        </div>
    );
}