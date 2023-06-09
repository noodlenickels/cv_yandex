let region = [];

function createPanorama(coordinates)
{
  // Для начала проверим, поддерживает ли плеер браузер пользователя.
  if (!ymaps.panorama.isSupported()) {
    // Если нет, то просто ничего не будем делать.
    return;
  }

  ymaps.panorama.locate(coordinates).done(
    function (panoramas) {
      // Убеждаемся, что найдена хотя бы одна панорама.
      if (panoramas.length > 0) {
        // Создаем плеер с одной из полученных панорам.
        var player = new ymaps.panorama.Player(
          'map',
          panoramas[0],
          { direction: [256, 16] }
        );
      }
    },
    function (error) {
      alert(error.message);
    }
  );
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

function readFile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    region = JSON.parse(reader.result);
    ymaps.ready(init);
  };
  console.log(region);

  reader.onerror = function() {
    console.log(reader.error);
  };
}

