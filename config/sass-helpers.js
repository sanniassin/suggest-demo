var fs = require('fs');
var path = require('path');
var Datauri = require('datauri');
var types = require('node-sass').types;
var imgSize = require('image-size');
var _ = require('lodash');

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.R_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function getFullFilePath(filePath, includePaths) {
  if (!fileExists(filePath)) {
    if (_.isEmpty(includePaths)) {
      return null;
    } else {
      includePaths = includePaths.split(':');
    }
    var fileDir = _.chain(includePaths)
      .uniq()
      .find((searchPath) => {
        var absolutePath = path.resolve(searchPath, filePath);
        return fileExists(absolutePath);
      })
      .value();
    if (fileDir) {
      return path.resolve(fileDir, filePath);
    } else {
      return null;
    }
  }
  return filePath;
}

function encodeSvg(filePath) {
  var fileData = fs.readFileSync(filePath);

  return 'data:image/svg+xml;charset=utf-8,' + fileData.toString('utf-8')
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/&/g, '%26')
    .replace(/#/g, '%23')
    .replace(/\s+/g, ' ');
}

module.exports = {
  'inline($image)': function(image) {
    image = getFullFilePath(image.getValue(), this.options.includePaths);

    var url;
    if (!image) {
      url = image;
    } else if (/\.svg$/i.test(image)) {
      url = encodeSvg(image);
    } else {
      url = new Datauri(image).content;
    }
    url = `url("${url}")`;
    return types.String(url);
  },
  'file-exists($file)': function(file) {
    file = getFullFilePath(file.getValue(), this.options.includePaths);
    return file ? types.Boolean.TRUE : types.Boolean.FALSE;
  },
  'image-size($file)': function(file) {
    file = getFullFilePath(file.getValue(), this.options.includePaths);
    var list = new types.List(2);
    var dimensions = imgSize(file);
    list.setValue(0, new types.Number(dimensions.width, 'px'));
    list.setValue(1, new types.Number(dimensions.height, 'px'));
    return list;
  },
  'pathjoin($paths...)': function(args) {
    var len = args.getLength();
    var paths = [];
    for (var i = 0; i < len; i++) {
      paths.push(args.getValue(i).getValue());
    }
    var result = path.join.apply(path, paths);
    return new types.String(result);
  },
  'extname($file)': function(file) {
    return new types.String(path.extname(file.getValue()));
  },
  'dirname($file)': function(file) {
    return new types.String(path.dirname(file.getValue()));
  },
  'basename($args...)': function(args) {
    var len = Math.min(args.getLength(), 2);
    var result = [];
    for (var i = 0; i < len; i++) {
      result.push(args.getValue(i).getValue());
    }
    result = path.basename.apply(path, result);
    return new types.String(result);
  }
};
