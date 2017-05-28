var packager = require('electron-packager');
var electronInstaller = require('electron-installer-debian');
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
  platform: 'linux'
}, function packagedCallback (err, appPaths) {

  if(err){
    console.error(err);
    return process.exit(1);
  }

  console.log('linux packaged, now creating installer');

  var options = {
    src: path.join(__dirname, '..', 'dist', 'shipped-linux-x64'),
    dest: path.join(__dirname, '..', 'dist', 'shipped-setup-linux-x64')
  };

  electronInstaller(options, function (err) {
    if (err) {
      console.error(err, err.stack);
      process.exit(1);
    }
    console.log('Successfully created .deb installer at ' + options.dest);
  });

});
