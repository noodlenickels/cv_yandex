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

function createPanorama(coordinates)
{
  // Для начала проверим, поддерживает ли плеер браузер пользователя.
  if (!ymaps.panorama.isSupported()) {
    // Если нет, то просто ничего не будем делать.
    return;
  }

  // Ищем панораму в переданной точке.
  ymaps.panorama.locate(coordinates).done(
    function (panoramas) {
      // Убеждаемся, что найдена хотя бы одна панорама.
      if (panoramas.length > 0) {
        // Создаем плеер с одной из полученных панорам.
        var player = new ymaps.panorama.Player(
          'map',
          // Панорамы в ответе отсортированы по расстоянию
          // от переданной в panorama.locate точки. Выбираем первую,
          // она будет ближайшей.
          panoramas[0],
          // Зададим направление взгляда, отличное от значения
          // по умолчанию.
          { direction: [256, 16] }
        );
      }
    },
    function (error) {
      // Если что-то пошло не так, сообщим об этом пользователю.
      alert(error.message);
    }
  );

  // // Для добавления панорамы на страницу также можно воспользоваться
  // // методом panorama.createPlayer. Этот метод ищет ближайщую панораму и
  // // в случае успеха создает плеер с найденной панорамой.
  // ymaps.panorama.createPlayer(
  //   'map',
  //   [59.938557, 30.316198],
  //   // Ищем воздушную панораму.
  //   { layer: 'yandex#airPanorama' }
  // )
  //   .done(function (player) {
  //     // player – это ссылка на экземпляр плеера.
  //   });
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
      balloonContentFooter: `${[region[i]?.lat, region[i]?.lon]}`,
      hintContent: "Светофор"
    });

    myMap.geoObjects.add(myPlacemark);
    createPanorama([region[i]?.lat, region[i]?.lon])
    }

  const signals = document.getElementById("but");
  signals.innerHTML = `Количество светофоров: ${region.length}`;
}

function hide(what) {
  const obj = document.getElementById(`${what}`);
  obj.style.display = 'none';
}


get_traffic_light_coordinates('Ленинградский проспект');




