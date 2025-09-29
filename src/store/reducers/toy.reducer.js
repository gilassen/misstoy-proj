export const SET_TOYS = 'SET_TOYS'
export const SET_TOY = 'SET_TOY'
export const REMOVE_TOY = 'REMOVE_TOY'
export const SAVE_TOY = 'SAVE_TOY'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_SORT = 'SET_SORT'
export const SET_LOADING = 'SET_LOADING'

const initialState = {
    toys: [],
    filterBy: {
        name: '',
        inStock: 'ALL',
        labels: [],
        sortBy: 'name',
        pageIdx: 0,
        pageSize: 5,
    },
    isLoading: false,
    isLoaded: false,   
    selectedToy: null,
    maxPage: 1,
    pageIdx: 0,
}

export function toyReducer(state = initialState, action) {
    switch (action.type) {
        case SET_TOYS:
            return {
                ...state,
                toys: action.toys,
                maxPage: action.maxPage,
                pageIdx: action.pageIdx,
                isLoaded: true,
                selectedToy: null
            }

        case SET_TOY:
            return { ...state, selectedToy: action.toy, isLoaded: true }

        case REMOVE_TOY:
            return {
                ...state,
                toys: state.toys.filter(t => t._id !== action.toyId)
            }

        case SAVE_TOY: {
            const exists = state.toys.some(t => t._id === action.toy._id)
            const toys = exists
                ? state.toys.map(t => t._id === action.toy._id ? action.toy : t)
                : [...state.toys, action.toy]
            return { ...state, toys }
        }

        case SET_FILTER_BY:
            return { ...state, filterBy: { ...state.filterBy, ...action.filterBy } }

        case SET_SORT:
            return {
                ...state,
                filterBy: { ...state.filterBy, sortBy: action.sortBy }
            }

        case SET_LOADING:
            return { ...state, isLoading: action.isLoading }

        default:
            return state
    }
}
