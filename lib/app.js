
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

var rl = readline.createInterface({
  input: process.stdin,s
  output: process.stdout
});

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

/**
 * Clears tempfile, writing new JSON object with empty values array
 */
module.exports.clear = function () {
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
