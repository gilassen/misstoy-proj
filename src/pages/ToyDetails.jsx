import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { loadToyById } from "../store/actions/toy.actions.js"
import { showErrorMsg } from "../services/event-bus.service.js"

import { useKeyListener } from "../customHooks/useKeyListener.js"

export function ToyDetails() {
    const { toyId } = useParams()
    const navigate = useNavigate()

    const toy = useSelector(storeState =>
        storeState.toyModule.toys.find(t => t._id === toyId)
    )

    useEffect(() => {
        if (!toy) {
            loadToyById(toyId)
                .catch(() => {
                    showErrorMsg("Cannot load toy")
                    navigate("/toy")
                })
        }
    }, [toyId])

    useKeyListener("Escape", () => navigate("/toy"))
    useKeyListener("ArrowLeft", () => {
        if (toy?.prevToyId) navigate(`/toy/${toy.prevToyId}`)
    })
    useKeyListener("ArrowRight", () => {
        if (toy?.nextToyId) navigate(`/toy/${toy.nextToyId}`)
    })

    if (!toy) return <div>Loading...</div>

    return (
        <section className="toy-details">
            <h1>{toy.name}</h1>
            <h3>Price: ${toy.price}</h3>
            <h4>Labels: {toy.labels?.join(", ")}</h4>
            <p>Status: {toy.inStock ? "In stock" : "Out of stock"}</p>
            <p>Created at: {new Date(toy.createdAt).toLocaleDateString()}</p>

            <button onClick={() => navigate("/toy")}>Back to list</button>

            <div className="toy-nav">
                <button
                    disabled={!toy.prevToyId}
                    onClick={() => toy.prevToyId && navigate(`/toy/${toy.prevToyId}`)}
                >
                    Previous Toy
                </button>

                <button
                    disabled={!toy.nextToyId}
                    onClick={() => toy.nextToyId && navigate(`/toy/${toy.nextToyId}`)}
                >
                    Next Toy
                </button>
            </div>
        </section>
    )
}
