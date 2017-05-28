var packager = require('electron-packager');
var electronInstaller = require('electron-winstaller');
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
  platform: 'win32'
}, function done_callback (err, appPaths) {

  if(err) return console.error(err);

  console.log('packaged!! -> creating installer');

  var resultPromise = electronInstaller.createWindowsInstaller({
      appDirectory: path.join(__dirname, '..', 'dist', 'shipped-win32-x64'),
      outputDirectory: path.join(__dirname, '..', 'dist', 'shipped-setup-win32-x64'),
      noMsi: false,
      iconUrl: 'http://localhost:8080/assets/icons/shipped.ico',
      setupIcon: './assets/icons/shipped.ico',
    });

  resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
});
