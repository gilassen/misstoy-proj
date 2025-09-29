import { Link } from "react-router-dom"
import { ToyPreview } from "./ToyPreview.jsx"

export function ToyList({ toys, onRemoveToy }) {
  return (
    <ul className="toy-list">
      {toys.map(toy => (
        <li key={toy._id} className="toy-preview-card">
          <ToyPreview toy={toy} />

          <div className="actions">
            <button
              className="btn-delete"
              onClick={() => onRemoveToy(toy._id)}
            >
              Delete
            </button>

            <Link to={`/toy/${toy._id}`} className="btn-details">
              Details
            </Link>

            <Link to={`/toy/edit/${toy._id}`} className="btn-edit">
              Edit
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
