const container = document.querySelector('.container')
const stations = document.querySelector('.row .station:not(.busy)')
//const count = document.getElementById('count')
//const unitySelect = document.getElementById('unity')

/*populateUI()

let booking = +unitySelect.value

// Save selected unity index
function setUnityData(unityIndex, unityValue) {
  localStorage.setItem('selectedUnityIndex', unityIndex)
  localStorage.setItem('slectedUnityValue', unityValue)
}

// Update total and count
function updateSelectedCount() {
  const selectedStations = document.querySelectorAll('.row .station.selected')

  const stationsIndex = [...selectedStations].map(station =>
    [...stations].indexOf(station)
  )

  localStorage.setItem('selectedStations', JSON.stringify(stationsIndex))

  const selectedStationsCount = selectedStations.length

  count.innerText = selectedStationsCount
  total.innerText = selectedStationsCount * unityValue

  setUnityData(unitySelect.selectedIndex, unitySelect.value)
}

// Get data from localstorage and populate UI
function populateUI() {
  const selectedStations = JSON.parse(localStorage.getItem('selectedStations'))

  if (selectedStations !== null && selectedStations.length > 0) {
    stations.forEach((station, index) => {
      if (selectedStations.indexOf(index) > -1) {
        station.classList.add('selected')
      }
    })
  }

  const selectedUnityIndex = localStorage.getItem('selectedUnityIndex')

  if (selectedUnityIndex !== null) {
    unitySelect.selectedIndex = selectedUnityIndex
  }
}

// Unity select event
unitySelect.addEventListener('change', e => {
  booking = +e.target.value
  setUnityData(e.target.selectedIndex, e.target.value)
  updateSelectedCount()
})*/

// Station click event
container.addEventListener('click', e => {
  if (
    e.target.classList.contains('station') &&
    !e.target.classList.contains('busy')
  ) {
    e.target.classList.toggle('selected')

    updateSelectedCount()
  }
})

// Initial count and total set
//updateSelectedCount()
