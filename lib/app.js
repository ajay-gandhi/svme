
/**
 * Handles fs writing and reading
 */

// NPM modules
var fs    = require('fs-extra-promise'),
    osTmp = require('os-tmpdir'),
    chalk = require('chalk');

var content_location = osTmp() + '/svme.json';

module.exports.save = function (content) {
  fs
    .ensureFileAsync(content_location)
    .then(function () {
      // Can't use readJson in case file is empty
      return fs.readFileAsync(content_location);
    })
    .then(function (data) {

      data = data.toString();

      // Convert to JSON or create new object
      data = data ? JSON.parse(data) : { values: [] };
      data.values.push(content);

      return fs.writeJsonAsync(content_location, data);
    })
    .then(function () {
      console.log(chalk.green('Saved!'));
    })
    // Catch all errors
    .catch(console.trace);
}

module.exports.load = function (which, parseable) {
  fs
    .readJsonAsync(content_location)
    .then(function (j) {

      if (which === 'all') {
        // Print all
        if (parseable)
          j.values.forEach(function (v, i) {
            console.log(v);
          });

        else
          j.values.forEach(function (v, i) {
            console.log(chalk.blue(j.values.length - i) + ':', v);
          });

      } else if (which) {
        // Ensure plausible input
        var min = 1, max = j.values.length;

        which = parseInt(which);
        if (which < min) {
          console.log(chalk.red('Error: Cannot fetch negative or 0 datum!'));
          process.exit(1);

        } else if (which > max) {
          console.log(chalk.red('Error: Only', max, 'values stored.'));
          process.exit(1);
        }

        console.log(j.values[j.values.length - which]);

      } else {
        // Print latest
        console.log(j.values[j.values.length - 1]);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
