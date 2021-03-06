'use strict';

var fs = require('fs');
var utils = require('./utils');

// writes down schema content.
function createFileContent(fd, name, pluralName, types, cb) {
  // Const
  var TAB = `    `;
  var NL = `\r\n`;
  var headerComment = `'use strict';${NL}${NL}${NL} /**${NL} * ` + name + ` controller file` +
    ` * autogenerated by ...-scaffolding **/${NL}${NL}`;

  var requireBlock = `var ${pluralName} = require('express').Router(),${NL}` +
    `    Model = require('../models/model-` + pluralName + `.js');${NL}${NL}`;

  var listBlock = '' +
`${pluralName}.get('/', function(req, res) {
    Model.find(function(err, ` + pluralName + `){
        if (req.accepts(\'html', 'json') === 'json') {
            if(err) {
                return res.json(500, {
                    message: 'Error getting ` + pluralName + `.'
                });
            }
            return res.json(${pluralName});
        } else {
            if(err) {
                return res.send('500: Internal Server Error', 500);
            }
        return res.render('${pluralName}/index', {${pluralName}: ${pluralName}});
        }
    });
});

`;

  var createBlock = '' +
`${pluralName}.post('/', function(req, res) {
    var ${name} = new Model({
`;

  for (var i = 0; i < types.length; i++) {
    var current = types[i];
    var line = '';
    // this scaffolder is dumb.
    if (current.type === 'Array') {
      line = `${line}       ` + '// TODO: generate Array parser.';
    } else if (current.type === 'Date') {
      line = `${line}       ` + '// TODO: generate Date parser.';
    } else if (current.type === 'Boolean') {
      line = `${line}       '${current.name}` +
        '\': (req.body[\'' + current.name + '\']) ? (req.body[\'' + current.name + '\'] === \'true\') : false';
    } else {
      line = `${line}        '${current.name}': req.body['${current.name}']`;
    }
    if (i < types.length - 1) {
      line = `${line},`;
    }
    line = line + NL;
    createBlock = createBlock + line;
  }

  createBlock = `${createBlock}    });
    ${name}.save(function(err, ${name}){
        if (req.accepts('html', 'json') === 'json') {
            if(err) {
                return res.json(500, {
                    message: 'Error saving item.',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: ${name}._id
            });
        } else {
            if(err) {
                return res.send('500: Internal Server Error', 500);
            }
            return res.render('${pluralName}/edit', {${name}: ${name}});
        }
    });
});` + NL + NL;

  var readBlock = '' +
    `${pluralName}.get('/:id', function(req, res) {
    var id = req.params.id;
    Model.findOne({_id: id}, function(err, ${name}){
        if (req.accepts('html', 'json') === 'json') {
            if(err) {
                return res.json(500, {
                    message: 'Error getting ${name}.'
                });
            }
            if(!${name}) {
                return res.json(404, {
                    message: 'No such ${name}.'
                });
            }
            return res.json(${name});
        } else {
            if(err) {
                return res.send('500: Internal Server Error', 500);
            }
            if(!${name}) {
                return res.end('No such ${name}');
            }
            return res.render('${pluralName}/edit', {${name}: ${name}, flash: 'Created.'});
        }
    });
});` + NL + NL;

  var updateBlock = '' +
    `${pluralName}.put('/:id', function(req, res) {
    var id = req.params.id;
    Model.findOne({_id: id}, function(err, ${name}){
        if (req.accepts('html', 'json') === 'json') {
            if(err) {
                return res.json(500, {
                    message: 'Error saving ${name}',
                    error: err
                });
            }
            if(!${name}) {
                return res.json(404, {
                    message: 'No such ${name}'
                });
            }` + NL;

  for (var i = 0; i < types.length; i++) {
    var current = types[i];
    var line = '';
    // this scaffolder is dumb.
    if (current.type === 'Array') {
      line = `{$line}           ` + '// TODO: generate Array parser.';
    } else if (current.type === 'Date') {
      line = `{$line}           ` + '// TODO: generate Date parser.';
    } else if (current.type === 'Boolean') {
      line = `${line}           ${name}[${current.name}` +
        `'] = (req.body[' ${current.name}]) ? (req.body[current.name] === 'true') : ${name} [' ${current.name}']`;
    } else {
      line = `${line}            ${name}['${current.name}'] = ` +
        `req.body['${current.name}'] ? req.body['${current.name}'] : ${name}['${current.name}'];`
    }
    line = line + NL;
    updateBlock = updateBlock + line;
  }

  updateBlock = updateBlock +
`            ${name}.save(function(err, ${name}){
                if(err) {
                    return res.json(500, {
                        message: 'Error getting ${name}.'
                    });
                }
                if(!${name}) {
                    return res.json(404, {
                        message: 'No such ${name}'
                    });
                }
                return res.json(${name});
            });
        } else {
            if(err) {
                return res.send('500: Internal Server Error', 500);
            }
            if(!${name}) {
                return res.end('No such ${name}');
            }
    `;

  for (var i = 0; i < types.length; i++) {
    var current = types[i];
    var line = '';
    // this scaffolder is dumb.
    if (current.type === 'Array') {
      line = line + TAB + TAB + TAB + '// TODO: generate Array parser.';
    } else if (current.type === 'Date') {
      line = line + TAB + TAB + TAB + '// TODO: generate Date parser.';
    } else if (current.type === 'Boolean') {
      line = `${line}           ${name}['${current.name}'] = ` +
       `(req.body['${current.name}']) ? (req.body['${current.name}'] === 'true') : ${name}['$current.name']`;
    } else {
      line = `${line}            ${name}['${current.name}'] = ` +
        `req.body['${current.name}'] ? req.body['${current.name}'] : ${name}['${current.name}'];`
    }
    line = line + NL;
    updateBlock = updateBlock + line;
  }

  updateBlock = updateBlock +
`            ${name}.save(function(err, ${name}){
                if(err) {
                    return res.send('500: Internal Server Error', 500);
                }
                if(!${name}) {
                    return res.end('No such ${name}');
                }
                return res.render('${pluralName}/edit', {${name}: ${name}, flash: 'Saved.'});
            });
        }
    });
});

`;

  var deleteBlock = `${pluralName}.delete('/:id', function (req, res) {
    var id = req.params.id;
    Model.findByIdAndRemove({ _id: id }, function (err, ${name}) {
        if (err) {
            return res.json(500, {
                message: 'Error getting ${name}.'
            });
        }
        console.log('ERR', err);
        console.log('${name.toUpperCase()}', ${name});
        if (!pkg) {
            return res.json(404, {
                message: 'No such ${name}'
            });
        }
        res.json(200, {
            message: 'success'
        });
    });
});` + NL + NL;

 

  var exportLine = `module.exports.${pluralName} = ${pluralName};`;

  var text = `${headerComment}${requireBlock}${listBlock}${createBlock}` +
    `${readBlock}${updateBlock}${deleteBlock}${exportLine}`;
  var buf = new Buffer(text);
  fs.write(fd, buf, 0, buf.length, null, cb);
}

function generateController(name, pluralName, types, cb) {
  utils.generateDirectory('controllers', function(err) {
    if (err) {
      return cb(err);
    }
    var fileName = `controllers/ctrl-${pluralName}.js`;
    
    utils.createOrClearFile(fileName, function(err, fd) {
      if (err) {
        return cb(err);
      }
      createFileContent(fd, name, pluralName, types, function(err, data) {
        if (err) {
          return (cb(err));
        }
        fs.close(fd, cb);
      });
    });
  });
}

module.exports = {
  generateController: generateController
};
