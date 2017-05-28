var packager = require('electron-packager');
var electronInstaller = require('electron-installer-dmg');
var path = require('path');

packager({
  dir: path.join(__dirname, '..'),
  arch: 'x64',
  // ignore: ['desktop', 'src', 'node_modules', 'dist'],
  ignore: [/mobile/, /src/, /scripts/],
  name: 'shipped',
  productName: 'Shipped',
  out: path.join(__dirname, '..', 'dist'),
  icon: path.join(__dirname, '..', 'assets', 'icons', 'shipped.ico'),
  overwrite: true,
  platform: 'darwin'
}, function done_callback (err, appPaths) {

  if(err){
    console.error(err);
    return process.exit(1);
  }

  console.log('darwin packaged, now creating installer');

  var options = {
    overwrite: true,
    name: 'Shipped',
    appPath: path.join(__dirname, '..', 'dist', 'shipped-darwin-x64', 'shipped.app'),
    out: path.join(__dirname, '..', 'dist', 'shipped-setup-darwin-x64')
  };

  electronInstaller(options, function (err) {
    if (err) {
      console.error(err, err.stack);
      process.exit(1);
    }
    console.log('Successfully created .dmg installer at ' + options.dest);
  });

});
