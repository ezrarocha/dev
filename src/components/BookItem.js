export default function BookItem({item}) {
    return (
        <div class="item-box">
            <img src={item.image}></img>
            <h1>{item.name}</h1>
            <p>{item.author}</p>
            <p>{item.date}</p>
            <p></p>
        </div>
    );
}