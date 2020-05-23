/* eslint-disable strict */
const mapResources = require('./mapResources.json');
const path = require('path');
const fs = require('fs');
function mapHandler(obj, names, offsetLeft, offsetTop) {
  obj.features = obj.features.map((item) => {
    if (names === 'all' || names.includes(item.properties.name)) {
      for (let i = 0; i < item.geometry.coordinates.length; i++) {
        if (item.properties.name === 'Labuan') {
          item.geometry.coordinates[i] = item.geometry.coordinates[i].map((child) => [
            child[0] + offsetLeft,
            child[1] + offsetTop
          ]);
        } else {
          item.geometry.coordinates[i][0] = item.geometry.coordinates[i][0].map((child) => [
            child[0] + offsetLeft,
            child[1] + offsetTop
          ]);
        }
      }
    }

    return item;
  });
  return obj;
}
// const mapResources = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapResources.json')));
mapHandler(mapResources, ['Sarawak', 'Sabah', 'Labuan'], -1000, 0);
const file = path.resolve(__dirname, './src/script/Malaysia.json');
fs.writeFile(file, JSON.stringify(mapResources), () => {
  console.log('写入成功!');
});
