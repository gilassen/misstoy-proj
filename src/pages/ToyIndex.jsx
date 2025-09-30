import { ToyFilter } from "../cmps/ToyFilter.jsx"
import { ToyList } from "../cmps/ToyList.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadToys, removeToy, saveToy } from "../store/actions/toy.actions.js"
import { SET_FILTER_BY, SET_SORT } from "../store/reducers/toy.reducer.js"

import { Link, useSearchParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { eventBusService } from "../services/event-bus.service.js"


export function ToyIndex() {
    const toys = useSelector(state => state.toyModule.toys)
    const filterBy = useSelector(state => state.toyModule.filterBy)
    const isLoading = useSelector(state => state.toyModule.isLoading)

    const maxPage = useSelector(state => state.toyModule.maxPage) || 1
    const pageIdx = useSelector(state => state.toyModule.pageIdx) || 0

    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        eventBusService.emit("show-loader")
        loadToys(filterBy)
            .catch(() => showErrorMsg("Cannot load toys"))
            .finally(() => {
                eventBusService.emit("hide-loader")
                setIsLoaded(true)
            })
    }, [filterBy])


    function onChangePage(diff) {
        const newPageIdx = pageIdx + diff
        if (newPageIdx < 0 || newPageIdx >= maxPage) return

        dispatch({ type: SET_FILTER_BY, filterBy: { pageIdx: newPageIdx } })
    }


    function onRemoveToy(toyId) {
        const isConfirmed = window.confirm("Are you sure you want to delete this toy?")
        if (!isConfirmed) return

        removeToy(toyId)
            .then(() => showSuccessMsg(`Toy removed`))
            .catch(() => showErrorMsg("Cannot remove toy " + toyId))
    }

    function onSetFilter(newFilter) {
        const newFilterWithPaging = { ...newFilter, pageIdx: 0 }

        const currentFilterForCheck = { ...filterBy }
        delete currentFilterForCheck.pageIdx
        delete currentFilterForCheck.pageSize

        if (JSON.stringify(currentFilterForCheck) === JSON.stringify(newFilter)) return

        dispatch({ type: SET_FILTER_BY, filterBy: newFilterWithPaging })
    }


    if (!isLoaded) return null

    return (
    <section className="toy-index">

        <ToyFilter filterBy={filterBy} onSetFilter={onSetFilter} />

        <div className="toy-list-header">
            <h2 className="toy-list-title">Toys List</h2>
        </div>
        
        <div className="toy-list-actions">
            <Link to="/toy/edit" className="btn btn-add">
            Add Toy
            </Link>
            </div>



        <div className="pagination-controls">
            <button
                onClick={() => onChangePage(-1)}
                disabled={pageIdx === 0}
            >
                Prev Page
            </button>

            <span>Page {pageIdx + 1} of {maxPage}</span>

            <button
                onClick={() => onChangePage(1)}
                disabled={pageIdx + 1 >= maxPage}
            >
                Next Page
            </button>
        </div>

        {toys.length === 0 ? (
            <p>No toys to show...</p>
        ) : (
            <ToyList toys={toys} onRemoveToy={onRemoveToy} />
        )}
    </section>
)

}