
/**
 * Handles fs writing and reading
 */

// NPM modules
var fs       = require('fs-extra-promise'),
    osTmp    = require('os-tmpdir'),
    chalk    = require('chalk'),
    readline = require('readline');

var content_location = osTmp() + '/svme.json',
    empty_obj        = { values: [] };

/**
 * Saves provided [content] to temporary file. Creates file if it doesn't exist
 */
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
      data = data ? JSON.parse(data) : empty_obj;
      data.values.push(content);

      return fs.writeJsonAsync(content_location, data);
    })
    .then(function () {
      console.log(chalk.green('Saved!'));
    })
    // Catch all errors
    .catch(console.trace);
}

/**
 * Loads previously saved content from temp file
 */
module.exports.load = function (which, parseable) {
  fs
    .readJsonAsync(content_location)
    .then(function (j) {
      var min = 1, max = j.values.length;

      // Print all
      if (which === 'all') {
        j.values.forEach(function (v, i) {
          if (parseable)
            console.log(v);
          else
              console.log(chalk.blue(j.values.length - i) + ':', v);
        });

      // Range
      } else if (which.toString().indexOf('..') >= 0) {
        var range = which.split('..');

        // In case low or high range is unset
        if (range[0] === '') range[0] = min;
        if (range[1] === '') range[1] = max;

        var low  = Math.min(parseInt(range[0]), parseInt(range[1])),
            high = Math.max(parseInt(range[0]), parseInt(range[1]));

        // Ensure plausible range
        if (low < min || high < min) {
          console.log(chalk.red('Error: Cannot fetch negative or 0 datum!'));
          process.exit(1);

        } else if (low > max || high > max) {
          console.log(chalk.red('Error: Only', max, 'values stored.'));
          process.exit(1);
        }

        // Start at lowest index
        for (var i = j.values.length - high; i <= j.values.length - low; i++) {

          if (parseable)
            console.log(j.values[i]);
          else
            console.log(chalk.blue(j.values.length - i) + ':', j.values[i]);

        }

      // Single number
      } else if (which) {

        which = parseInt(which);

        // Ensure plausible number
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
        console.log(chalk.red('Error: Invalid input'));
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

/**
 * Clears tempfile, writing new JSON object with empty values array
 */
module.exports.clear = function () {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Confirm
  rl.question('Are you sure? [y/n] ', function (answer) {
    answer = answer.toLowerCase();
    if (answer === 'y' || answer === 'yes')
      // First ensure file exists
      fs
        .ensureFileAsync(content_location)
        .then(function () {
          // Now clear it
          return fs.writeJsonAsync(content_location, empty_obj);
        })
        .then(function () {
          console.log('Cleared.');
          process.exit(0);
        })
        // Catch all errors
        .catch(console.trace);

    // Said no
    else process.exit(0);

  });
}
