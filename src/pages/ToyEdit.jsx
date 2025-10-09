import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { saveToy, loadToys } from "../store/actions/toy.actions.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { toyService } from "../services/toyService.js"

import { useConfirmTabClose } from "../customHooks/useConfirmTabClose.js"

export function ToyEdit() {
  const [toyToEdit, setToyToEdit] = useState(null)
  const toys = useSelector(storeState => storeState.toyModule.toys)

  const navigate = useNavigate()
  const params = useParams()
  const labels = toyService.labels || []

  useEffect(() => {
    if (params.toyId) {
      const toy = toys.find(t => t._id === params.toyId)
      if (toy) {
        setToyToEdit(toy)
      } else {
        loadToys().catch(() => showErrorMsg("Cannot load toy"))
      }
    } else {
      setToyToEdit(toyService.getEmptyToy())
    }
  }, [params.toyId])

  useConfirmTabClose(!!toyToEdit, "You have unsaved changes, are you sure you want to leave?")

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case "number":
        value = +value || ""
        break
      case "checkbox":
        value = target.checked
        break
      default:
        break
    }

    setToyToEdit(prev => ({ ...prev, [field]: value }))
  }

  async function onSaveToy(ev) {
    ev.preventDefault()
    try {
      const savedToy = await saveToy(toyToEdit)
      showSuccessMsg(`Toy Saved (id: ${savedToy._id})`)
      navigate("/toy")
    } catch (err) {
      showErrorMsg("Cannot save toy")
    }
  }

  if (!toyToEdit) return <div>Loading...</div>

  const { name, price, labels: toyLabels = [], inStock } = toyToEdit

  function toggleLabel(label, isChecked) {
    setToyToEdit(prev => {
      const newLabels = isChecked
        ? [...prev.labels, label]
        : prev.labels.filter(l => l !== label)
      return { ...prev, labels: newLabels }
    })
  }

  return (
    <section className="toy-edit">
      <form onSubmit={onSaveToy}>
        <label htmlFor="name">Name:</label>
        <input
          onChange={handleChange}
          value={name}
          type="text"
          name="name"
          id="name"
        />

        <label htmlFor="price">Price:</label>
        <input
          onChange={handleChange}
          value={price}
          type="number"
          name="price"
          id="price"
        />

        <label htmlFor="inStock">In stock:</label>
        <input
          onChange={handleChange}
          checked={inStock}
          type="checkbox"
          name="inStock"
          id="inStock"
        />

        <label>Labels:</label>
        <div className="labels-list">
          {labels.map(label => (
            <label key={label} className="label-option">
              <input
                type="checkbox"
                value={label}
                checked={toyLabels.includes(label)}
                onChange={(ev) => toggleLabel(label, ev.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>

        <button>Save</button>
      </form>
    </section>
  )
}
