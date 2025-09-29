import { useState, useMemo } from "react"
import { useEffectUpdate } from "../customHooks/useEffectUpdate.js"
import { toyService } from "../services/toyService.js"

function debounce(fn, wait) {
  let t
  return function (...args) {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), wait)
  }
}

export function ToyFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  const debouncedSetFilter = useMemo(
    () => debounce(onSetFilter, 400),
    [onSetFilter]
  )

  useEffectUpdate(() => {
    debouncedSetFilter(filterByToEdit)
  }, [filterByToEdit])

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

    if (field === "inStock") {
      if (value === "ALL") value = "ALL"
      else if (value === "true") value = "true"
      else value = "false"
    }

    setFilterByToEdit(prev => ({ ...prev, [field]: value }))
  }

  function handleLabelsChange(ev) {
    const selected = Array.from(ev.target.selectedOptions, opt => opt.value)
    setFilterByToEdit(prev => ({ ...prev, labels: selected }))
  }

  function onClear(ev) {
    ev.preventDefault()
    const defaultFilter = toyService.getDefaultFilter()
    setFilterByToEdit(defaultFilter)
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }

  const { name, inStock, labels, sortBy } = filterByToEdit

  return (
    <section className="toy-filter">
      <h2>Filter Toys</h2>
      <form onSubmit={onSubmitFilter}>
        <div className="field">
          <label htmlFor="name">By name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="inStock">In Stock:</label>
          <select
            id="inStock"
            name="inStock"
            value={inStock}
            onChange={handleChange}
          >
            <option value="ALL">All</option>
            <option value="true">In stock</option>
            <option value="false">Out of stock</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="labels">Labels:</label>
          <select
            id="labels"
            multiple
            value={labels}
            onChange={handleLabelsChange}
            className="labels-select"
          >
            {[
              "On wheels",
              "Box game",
              "Art",
              "Baby",
              "Doll",
              "Puzzle",
              "Outdoor",
              "Battery Powered"
            ].map(label => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            name="sortBy"
            value={sortBy}
            onChange={handleChange}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="createdAt">Created</option>
          </select>
        </div>

        <div className="actions">
          <button
      type="button"
      className="btn-clear"
      onClick={onClear}
    >
      Clear
    </button>
  </div>
      </form>
    </section>
  )
}
