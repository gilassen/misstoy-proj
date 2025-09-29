export function ToyPreview({ toy }) {
  return (
    <article className="toy-preview">
      <h2>{toy.name}</h2>
      <h4>Price: ${toy.price}</h4>
      <h5>{toy.inStock ? 'In stock' : 'Out of stock'}</h5>

      {toy.labels && (
        <div className="labels">
          {toy.labels.map(label => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
    </article>
  )
}
