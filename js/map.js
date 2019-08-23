(function () {
  const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: false,
    zoom: 6,
    center: [24.3, -88.8],
  });

  // ================================================================
  // Basemap Layers
  // ================================================================
  //let topo = L.esri.basemapLayer("Topographic");
  let darkGray = L.esri.basemapLayer('DarkGray', {
    detectRetina: false
  });
  let esriOcean = L.layerGroup([
    L.esri.basemapLayer("Oceans"),
    L.esri.basemapLayer("OceansLabels")
  ]);
  let esriImage = L.layerGroup([
    L.esri.basemapLayer("Imagery"),
    L.esri.basemapLayer("ImageryLabels")
  ]).addTo(map);
  let esriImageFirefly = L.layerGroup([
    L.esri.basemapLayer("ImageryFirefly"),
    L.esri.basemapLayer("ImageryLabels")
  ]);

  // ================================================================
  /* grouping basemap layers */
  // ================================================================
  const basemapLayers = {
    //  "Topographic": topo,
    "Ocean": esriOcean,
    "Imagery": esriImage,
    "Imagery(Firefly)": esriImageFirefly,
    "Dark Gray": darkGray
  };
  // ================================================================
  // Ancillary Data Layers - Top Corner Layers Group
  // ================================================================

  var gcoosRegion = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/qr14biwnHA6Vis6l/arcgis/rest/services/The_GCOOS_Region/FeatureServer/2?token=F_nVVl-rqf_YoyI42eVf6fmKe9ZAUh1SOhHhkrrD4EozHaCOgcd4ym58vpSTbhammYodSkaSn9ROgUg66Om8DKPJDC0ZqMZ-4iCEtIcp1u5m7Q_reauGRCa6OalMSHR37ptHS4z6ZqpCwYG3j7Rre3yvkcghsMDuXhCgEoO75DPNhdDIZhTtBpyU7U8NoR3_xtyozv9oUGXSADLzX-Zv7njDGh0kgiQtvMGZWDRkzFa7eG2Ff7TTBnezF4nLx_pV',
  }).addTo(map);

  var gcoosRegionUS = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/qr14biwnHA6Vis6l/arcgis/rest/services/The_GCOOS_Region/FeatureServer/1?token=F_nVVl-rqf_YoyI42eVf6fmKe9ZAUh1SOhHhkrrD4EozHaCOgcd4ym58vpSTbhammYodSkaSn9ROgUg66Om8DKPJDC0ZqMZ-4iCEtIcp1u5m7Q_reauGRCa6OalMSHR37ptHS4z6ZqpCwYG3j7Rre3yvkcghsMDuXhCgEoO75DPNhdDIZhTtBpyU7U8NoR3_xtyozv9oUGXSADLzX-Zv7njDGh0kgiQtvMGZWDRkzFa7eG2Ff7TTBnezF4nLx_pV',
  }).addTo(map);

  var activeHurricaneESRI = L.esri.dynamicMapLayer({
    url: "https://utility.arcgis.com/usrsvcs/servers/6c6699e853424b22a8618f00d8e0cf81/rest/services/LiveFeeds/Hurricane_Active/MapServer",
    f: "image/png"
  }).addTo(map);

  var stationIcon = L.divIcon({
    className: 'station-div-icon'
  });
  var gcoosAssets = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/qr14biwnHA6Vis6l/arcgis/rest/services/The_GCOOS_Region/FeatureServer/0?token=F_nVVl-rqf_YoyI42eVf6fmKe9ZAUh1SOhHhkrrD4EozHaCOgcd4ym58vpSTbhammYodSkaSn9ROgUg66Om8DKPJDC0ZqMZ-4iCEtIcp1u5m7Q_reauGRCa6OalMSHR37ptHS4z6ZqpCwYG3j7Rre3yvkcghsMDuXhCgEoO75DPNhdDIZhTtBpyU7U8NoR3_xtyozv9oUGXSADLzX-Zv7njDGh0kgiQtvMGZWDRkzFa7eG2Ff7TTBnezF4nLx_pV',
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: stationIcon,
        riseOnHover: true
      });
    },
  }).addTo(map);
  gcoosAssets.bindPopup(function (layer) {
    return L.Util.template('<h1>{station}</h1><h2>{organization}</h2>' +
      '<table>' +
      '<tr><td>URN: </td><td>{urn}</td></tr>' +
      '<tr><td>Description: </td><td>{description}</td></tr>' +
      '</table>', layer.feature.properties);
  });

  var currentsIcon = L.divIcon({
    className: 'currents-div-icon'
  });
  var oceanCurrents = L.esri.featureLayer({
    url: 'https://services1.arcgis.com/qr14biwnHA6Vis6l/ArcGIS/rest/services/Gulf_Ocean_Currents_Observing_Stations/FeatureServer/0',
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: currentsIcon,
        riseOnHover: true
      });
    },
  });
  oceanCurrents.bindPopup(function (layer) {
    return L.Util.template('<h1>{station}</h1><h2>{organization}</h2>' +
      '<table>' +
      '<tr><td>URN: </td><td>{urn}</td></tr>' +
      '<tr><td>Description: </td><td>{description}</td></tr>' +
      '</table>', layer.feature.properties);
  });

  // ================================================================
  /* grouping ancillayr data layers */
  // ================================================================
  const groupedOverlay = {
    "GCOOS Region Assets": gcoosAssets,
    "ADCP Stations": oceanCurrents,
    "Active Hurricane": activeHurricaneESRI,
    "GCOOS Region US": gcoosRegionUS,
    "GCOOS Region Gulf": gcoosRegion
  };
  var controlLayers = L.control.layers(basemapLayers, groupedOverlay, {
    position: "bottomleft",
    collapsed: true
  }).addTo(map);
  // Full screen control
  map.addControl(new L.Control.Fullscreen());

  // Hycom Ocean Current
  function addHycom() {
    d3.json("https://geo.gcoos.org/data/hycom/hycom_surface_current.json").then(function (data) {
      var velocityLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
          velocityType: 'water',
          displayPosition: 'bottomleft',
          displayEmptyString: 'No water data'
        },
        data: data,
        maxVelocity: 2.5,
        velocityScale: 0.1 // arbitrary default 0.005
      }).addTo(map);

      controlLayers.addOverlay(velocityLayer, 'HYCOM Ocean Current');
    });
  }
  addHycom();

  // Set layers which redraw in a certain period
  setInterval(function () {
    onDragEnd();
    controlLayers.removeLayer(velocityLayer);
    addHycom();
  }, 360000);

})();