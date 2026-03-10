// Cesium 3D Map and Model Loader Example
// MapTiler API key and custom style
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNzQ4MjhkMy0zYmQ2LTRiNTgtYjc1Ny03MDc5M2U0NzI0YzciLCJpZCI6Mzk1MDk4LCJpYXQiOjE3NzIxNTIxNzh9.-2DMdd6bVFj0lfFyByPvhwY_QtDTC3Ys_Rhs7COPCqE';
// Use a standard MapTiler raster style for testing
const mapStyleUrl = 'https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=' + key;

// Initialize the Cesium Viewer with custom options, terrain, and satellite imagery
const viewer = new Cesium.Viewer('cesiumContainer', {
    animation: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    homeButton: false,
    geocoder: false,
    fullscreenButton: false,
    timeline: false,
    terrain: new Cesium.Terrain(
        Cesium.CesiumTerrainProvider.fromUrl(`https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key=${key}`, {
            requestVertexNormals: true
        })
    )
});

// Add custom MapTiler imagery as an additional layer (not as baseLayer)
const maptilerProvider = new Cesium.UrlTemplateImageryProvider({
    url: mapStyleUrl,
    minimumLevel: 0,
    maximumLevel: 20,
    tileWidth: 256,
    tileHeight: 256,
    credit: 'MapTiler',
});
viewer.imageryLayers.addImageryProvider(maptilerProvider);

// Error handling for MapTiler imagery
if (maptilerProvider.errorEvent) {
    maptilerProvider.errorEvent.addEventListener(function(error) {
        console.error('MapTiler imagery tile loading error:', error);
        alert('Failed to load MapTiler imagery tiles. Check your API key, style ID, and network connection.');
    });
}

// Set initial camera view
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(8.67, 46.72, 4500),
    orientation: {
        pitch: Cesium.Math.toRadians(-20)
    }
});

// Add MapTiler and OpenStreetMap credits
const credit = new Cesium.Credit(
    `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`,
    true
);
viewer.creditDisplay.addStaticCredit(credit);

// Load a 3D model from a URL (example)
Cesium.Model.fromGltfAsync({
    url: 'https://example.com/path/to/model.glb', // Replace with your model URL
    modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 5000.0)
    ),
    minimumPixelSize: 128, // Ensures visibility even when zoomed out
}).then((model) => {
    viewer.scene.primitives.add(model);
    console.log('Model loaded successfully!');
}).catch((error) => {
    console.error('Failed to load model:', error);
});

// Load and overlay GeoJSON data
const geoJsonUrl = 'Data_All'; // Local path relative to index.html
Cesium.GeoJsonDataSource.load(geoJsonUrl, {
    clampToGround: true
}).then(function(dataSource) {
    viewer.dataSources.add(dataSource);
    viewer.flyTo(dataSource);
    console.log('GeoJSON data loaded and displayed!');
}).catch(function(error) {
    console.error('Failed to load GeoJSON data:', error);
});
