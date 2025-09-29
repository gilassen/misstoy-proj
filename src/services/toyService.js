import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const TOY_KEY = 'toyDB'
_createToys()

const labels = [
  "On wheels",
  "Box game",
  "Art",
  "Baby",
  "Doll",
  "Puzzle",
  "Outdoor",
  "Battery Powered"
]

export const toyService = {
  query,
  get,
  remove,
  save,
  getEmptyToy,
  getDefaultFilter,
  getFilterFromSearchParams,
  labels
}

window.cs = toyService

function query(filterBy = {}) {
  return storageService.query(TOY_KEY).then(toys => {
    if (filterBy.name) {
      const regExp = new RegExp(filterBy.name, 'i')
      toys = toys.filter(toy => regExp.test(toy.name))
    }

    if (filterBy.inStock && filterBy.inStock !== 'ALL') {
      toys = toys.filter(toy =>
        filterBy.inStock === 'true' ? toy.inStock : !toy.inStock
      )
    }

    if (filterBy.labels && filterBy.labels.length) {
      toys = toys.filter(toy =>
        filterBy.labels.every(label => toy.labels.includes(label))
      )
    }

    if (filterBy.sortBy) {
      if (filterBy.sortBy === 'name') {
        toys = toys.sort((a, b) => a.name.localeCompare(b.name))
      } else if (filterBy.sortBy === 'price') {
        toys = toys.sort((a, b) => a.price - b.price)
      } else if (filterBy.sortBy === 'createdAt') {
        toys = toys.sort((a, b) => b.createdAt - a.createdAt)
      }
    }

    const { pageIdx = 0, pageSize = Infinity } = filterBy
    const maxPage = Math.ceil(toys.length / pageSize)
    const startIdx = pageIdx * pageSize
    const toysToShow = toys.slice(startIdx, startIdx + pageSize)

    toysToShow.forEach((toy, idx) => {
      toy.prevToyId = toysToShow[idx - 1]?._id || null
      toy.nextToyId = toysToShow[idx + 1]?._id || null
    })

    return { toys: toysToShow, maxPage, pageIdx }
  })
}




function get(toyId) {
  return storageService.get(TOY_KEY, toyId)
}

function remove(toyId) {
  return storageService.remove(TOY_KEY, toyId)
}

function save(toy) {
  if (toy._id) {
    toy.updatedAt = Date.now()
    return storageService.put(TOY_KEY, toy)
  } else {
    toy._id = utilService.makeId()
    toy.createdAt = toy.updatedAt = Date.now()
    return storageService.post(TOY_KEY, toy)
  }
}

function getEmptyToy(
  name = '',
  price = 100,
  labels = [],
  inStock = true
) {
  return { name, price, labels, inStock }
}

function getDefaultFilter() {
  return { name: '', inStock: 'ALL', labels: [], sortBy: 'name' }
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}

  for (const field in defaultFilter) {
    if (field === 'labels') {
      const labelsParam = searchParams.get('labels')
      filterBy.labels = labelsParam ? labelsParam.split(',') : []
    } else {
      filterBy[field] = searchParams.get(field) || defaultFilter[field]
    }
  }

  return filterBy
}

function _createToys() {
  let toys = utilService.loadFromStorage(TOY_KEY)
  if (!toys || !toys.length) {
    toys = []
    const names = ['Lego', 'Barbie', 'Puzzle', 'Robot', 'Car']
    for (let i = 0; i < 20; i++) {
      const name = names[utilService.getRandomIntInclusive(0, names.length - 1)]
      toys.push(_createToy(name))
    }
    utilService.saveToStorage(TOY_KEY, toys)
  }
}

function _createToy(name) {
  return {
    _id: utilService.makeId(),
    name,
    price: utilService.getRandomIntInclusive(20, 300),
    labels: ['Battery Powered', 'Baby', 'Art', 'Outdoor'],
    createdAt: Date.now() - utilService.getRandomIntInclusive(0, 10000000),
    inStock: Math.random() > 0.5,
  }
}
