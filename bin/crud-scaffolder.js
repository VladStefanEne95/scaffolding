#!/usr/bin/env node

'use strict';

var fs = require('fs');
var pluralize = require('pluralize');
var modelGenerator = require('../lib/model-generator');
var angModelGenerator = require('../lib/angularModelGenerator');
var angDetailGenerator = require('../lib/detail-generator');
var angServiceGenerator = require('../lib/service-generator');
var angRouteGenerator = require('../lib/route-generator');
var angAppGenerator = require('../lib/app-generator');
var angComponentGenerator = require('../lib/component-generator');
var controllerGenerator = require('../lib/controller-generator');
var viewsGenerator = require('../lib/view-generator');
var capitalize = require('../lib/utils').capitalize;
var inputul = require('../lib/server/index');

var allowedTypes_server = ['string', 'number', 'date', 'boolean', 'array'];
var allowedTypes_client = ['string', 'number', 'date', 'boolean', 'array', 'any'];

var client_input = require('../lib/client/index');


  var args = process.argv.slice(2);

  if (!args.length) {
    showUsage('Introduceti numele folderului');
  }

  var folderName = args.shift().toLowerCase();
  if (!fs.existsSync(folderName))
      fs.mkdir(folderName);

  while (!fs.existsSync(folderName));
    
  process.chdir(folderName);
  const exec = require('child_process').exec;
  exec('npm init --yes');


  if (!fs.existsSync('ang-app'))
    fs.mkdir('ang-app');
  if (!fs.existsSync('models'))
    fs.mkdir('models');
  if (!fs.existsSync('controllers'))
    fs.mkdir('controllers');

  for (var aux in client_input) {

    var ang_scaffold = client_input[aux];

    angModelGenerator.angGenerateModel(ang_scaffold);
    angDetailGenerator.angGenerateDetail(ang_scaffold);
    angServiceGenerator.angGenerateService(ang_scaffold);
    angComponentGenerator.angGenerateComponent(ang_scaffold);
  }

  angRouteGenerator.angGenerateRoute(ang_scaffold);
  angAppGenerator.angGenerateApp(ang_scaffold);


  for (var aux in inputul) {

    var input, modelName, pluralName;
    var obj_prop;
    var types = [];

    input = inputul[aux];

    for (var key in input) {
      if (input.hasOwnProperty(key)) {
          modelName = key;
          pluralName = pluralize.plural(modelName);
          obj_prop = input[key];
      }
    }


    for (var key in obj_prop) {
      if (allowedTypes_server.indexOf(obj_prop[key].toLowerCase()) === -1) {
        showUsage("Property type" + obj_prop[key] + "not allowed");
        process.exit(1);
      }
      if (obj_prop.hasOwnProperty(key)) {
            types.push({
              name: key,
              type: obj_prop[key]
            });
      }
    }


    modelGenerator.generateModel(modelName, pluralName, types, function(err) {
      if (err) {
        showUsage('There was a problem generating the model file.');
      }
      console.log('Model file generated.');
    });

     controllerGenerator.generateController(modelName, pluralName, types, function(err) {
      if (err) {
        showUsage('There was a problem generating the controller file.');
      }
      console.log('Generated controller');
    });
  }

function showUsage(err) {

  if (err)
    console.log('Error: ', err + '\r\n');

  console.log('Example:\r\n    ' + process.argv[1].substr(process.argv[1].lastIndexOf('/') + 1) +
    ' user firstName lastName age:Number\r\n');
  console.log('Supported data types (case insensitive): String, Boolean, Number, Date, Array.');
  console.log('The script will overwrite any existing file content for target files.\r\n');

  if (err)
    process.exit(1);
  else
    process.exit(0);

}
