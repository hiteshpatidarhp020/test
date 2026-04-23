export default function CategoryBar({ categories, onSelect }) {
  return (
    <div className="d-flex overflow-auto">
      {categories.map(c=>(
        <button key={c}
          className="btn btn-outline-dark me-2"
          onClick={()=>onSelect(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}