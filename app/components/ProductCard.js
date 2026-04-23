export default function ProductCard({ product }) {
  const img = JSON.parse(product.images)[0];

  return (
    <a href={`/product/${product.id}`} className="card p-2 mb-2">
      <img src={img} className="w-100"/>
      <h6>{product.name}</h6>
      <p>₹{product.price}</p>
    </a>
  );
}