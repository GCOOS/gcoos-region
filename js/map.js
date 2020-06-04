(function () {
  var map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: false,
    zoom: 6,
    center: [24.3, -88.8],
  });

  // ================================================================
  // Basemap Layers
  // ================================================================
  //let topo = L.esri.basemapLayer("Topographic");
  var darkGray = L.esri.basemapLayer("DarkGray", {
    detectRetina: false,
  });
  var esriOcean = L.layerGroup([
    L.esri.basemapLayer("Oceans"),
    L.esri.basemapLayer("OceansLabels"),
  ]);
  var esriImage = L.layerGroup([
    L.esri.basemapLayer("Imagery"),
    L.esri.basemapLayer("ImageryLabels"),
  ]);
  var esriImageFirefly = L.layerGroup([
    L.esri.basemapLayer("ImageryFirefly"),
    L.esri.basemapLayer("ImageryLabels"),
  ]);
  // Google Maps API and GoogleMutant
  var googleRoads = L.gridLayer.googleMutant({
    type: "roadmap", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
  });
  var googleHybrid = L.gridLayer
    .googleMutant({
      type: "hybrid",
    })
    .addTo(map);

  // ================================================================
  /* grouping basemap layers */
  // ================================================================
  var basemapLayers = {
    //  "Topographic": topo,
    Ocean: esriOcean,
    Imagery: esriImage,
    "Imagery(Firefly)": esriImageFirefly,
    "Dark Gray": darkGray,
    "Google Roads": googleRoads,
    "Google Hybrid": googleHybrid,
  };
  // ================================================================
  // Ancillary Data Layers - Top Corner Layers Group
  // ================================================================
  var gcoosRegion = L.esri
    .featureLayer({
      url:
        "https://services1.arcgis.com/qr14biwnHA6Vis6l/arcgis/rest/services/The_GCOOS_Region/FeatureServer/2",
    })
    .addTo(map);

  var gcoosRegionUS = L.esri
    .featureLayer({
      url:
        "https://services1.arcgis.com/qr14biwnHA6Vis6l/arcgis/rest/services/The_GCOOS_Region/FeatureServer/1",
    })
    .addTo(map);

  var stationIcon = L.divIcon({
    className: "station-div-icon",
  });
  var gcoosAssets = L.esri
    .featureLayer({
      url:
        "https://services1.arcgis.com/qr14biwnHA6Vis6l/arcgis/rest/services/The_GCOOS_Region/FeatureServer/0",
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: stationIcon,
          riseOnHover: true,
        });
      },
    })
    .addTo(map);
  gcoosAssets.bindPopup(function (layer) {
    return L.Util.template(
      "<h1>{station}</h1><h2>{organization}</h2>" +
        "<table>" +
        "<tr><td>URN: </td><td>{urn}</td></tr>" +
        "<tr><td>Description: </td><td>{description}</td></tr>" +
        "</table>",
      layer.feature.properties
    );
  });

  // ================================================================
  /* grouping ancillayr data layers */
  // ================================================================
  var groupedOverlay = {
    "GCOOS Region Assets": gcoosAssets,
    "GCOOS Region (USA)": gcoosRegionUS,
    "GCOOS Region (Gulf)": gcoosRegion,
  };
  var controlLayers = L.control
    .layers(basemapLayers, groupedOverlay, {
      position: "bottomleft",
      collapsed: true,
    })
    .addTo(map);
  // Full screen control
  map.addControl(new L.Control.Fullscreen());

  // // Hycom Ocean Current
  // function addHycom() {
  //   d3.json("https://geo.gcoos.org/data/hycom/hycom_surface_current.json").then(
  //     function (data) {
  //       var velocityLayer = L.velocityLayer({
  //         displayValues: true,
  //         displayOptions: {
  //           velocityType: "water",
  //           displayPosition: "bottomleft",
  //           displayEmptyString: "No water data",
  //         },
  //         data: data,
  //         maxVelocity: 2.5,
  //         velocityScale: 0.1, // arbitrary default 0.005
  //       }).addTo(map);

  //       controlLayers.addOverlay(velocityLayer, "HYCOM Ocean Current");
  //     }
  //   );
  // }
  // addHycom();

  // // Set layers which redraw in a certain period
  // setInterval(function () {
  //   onDragEnd();
  //   controlLayers.removeLayer(velocityLayer);
  //   addHycom();
  // }, 360000);
})();
