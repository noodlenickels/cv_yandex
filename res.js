let coordinates = [55.7229780, 37.4007218];
let region = [];

async function get_traffic_light_coordinates(address)
{
  const response = await fetch(`https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:25];area[name="Москва"];nwr["addr:street"="${address}"](area);nwr[highway=traffic_signals](around(/{/{bbox/}/}):50);out geom;`);
  if (response.ok) { // если HTTP-статус в диапазоне 200-299
    // получаем тело ответа (см. про этот метод ниже)
    const data = await response.json();
    region = data.elements;
    ymaps.ready(init);
  }
};

function init () {
  var myMap = new ymaps.Map("map", {
      center: [region[0]?.lat, region[0]?.lon],
      zoom: 17
    }, {
      searchControlProvider: 'yandex#search'
    });
    for (let i = 0; i < region.length; i++) {
      console.log(region[i])
    var myPlacemark = new ymaps.Placemark([region[i]?.lat, region[i]?.lon], {
      // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
      balloonContentHeader: "Балун метки",
      balloonContentBody: "Содержимое <em>балуна</em> метки",
      balloonContentFooter: "Светофор",
      hintContent: "Хинт метки"
    });

    myMap.geoObjects.add(myPlacemark);
    }
}


// function init() {
//   var myMap = new ymaps.Map('map', {
//     center: coordinates,
//     zoom: 21,
//     controls: []
//   });
// }

get_traffic_light_coordinates('Ленинградский проспект');


