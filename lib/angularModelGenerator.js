'use strict';

var fs = require('fs');
var utils = require('./utils');

function angGenerateModel(ang_scaffold) {
  var angProp;
  var angName;
  for (var key in ang_scaffold) {
        angName = key;
        angProp = ang_scaffold[key];
  }

  var angular_model = `export class ${angName} {
`;

  for (var key in angProp) {
    var line = `  ${key.toLowerCase()}: ${angProp[key].toLowerCase()};\r\n`;
    angular_model += line;

}
  angular_model += '}';



  var fileName = `ang-app/${angName.toLowerCase()}.ts`
  fs.writeFile(fileName, angular_model, function(err) {
    if(err) {
        return console.log(err);
    }
});
}

module.exports = {
  angGenerateModel: angGenerateModel
};
