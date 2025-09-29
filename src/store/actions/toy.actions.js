import { toyService } from "../../services/toyService.js"
import { store } from "../store.js"

import {
    SET_TOYS,
    SET_TOY,
    REMOVE_TOY,
    SAVE_TOY,
    SET_FILTER_BY,
    SET_SORT,
    SET_LOADING,
} from "../reducers/toy.reducer.js"

export function loadToys(filterBy) {
    store.dispatch({ type: SET_LOADING, isLoading: true })
    return toyService.query(filterBy)
        .then(({ toys, maxPage, pageIdx }) => {
            store.dispatch({ type: SET_TOYS, toys, maxPage, pageIdx })
            return toys
        })
        .catch(err => {
            console.log('toy action -> Cannot load toys', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_LOADING, isLoading: false })
        })
}

export function loadToyById(toyId) {
    store.dispatch({ type: SET_LOADING, isLoading: true })
    return toyService.get(toyId)
        .then(toy => {
            store.dispatch({ type: SET_TOY, toy })
            return toy
        })
        .catch(err => {
            console.log("toy action -> Cannot load toy", err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_LOADING, isLoading: false })
        })
}

export function removeToy(toyId) {
    return toyService.remove(toyId)
        .then(() => {
            store.dispatch({ type: REMOVE_TOY, toyId })
        })
        .catch(err => {
            console.log('toy action -> Cannot remove toy', err)
            throw err
        })
}

export function saveToy(toy) {
    return toyService.save(toy)
        .then(savedToy => {
            store.dispatch({ type: SAVE_TOY, toy: savedToy })
            return savedToy
        })
        .catch(err => {
            console.log('toy action -> Cannot save toy', err)
            throw err
        })
}

export function setFilter(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export function setSort(sortBy) {
    store.dispatch({ type: SET_SORT, sortBy })
}
