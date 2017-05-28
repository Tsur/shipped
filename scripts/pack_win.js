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

  if(err){
    console.error(err);
    return process.exit(1);
  }

  console.log('win32 packaged, now creating installer');

  var options = {
    appDirectory: path.join(__dirname, '..', 'dist', 'shipped-win32-x64'),
    outputDirectory: path.join(__dirname, '..', 'dist', 'shipped-setup-win32-x64'),
    noMsi: false,
    iconUrl: 'http://localhost:8080/assets/icons/shipped.ico',
    setupIcon: './assets/icons/shipped.ico',
  }

  electronInstaller.createWindowsInstaller(options).then(() => {
    console.log('Successfully created .exe installer at ' + options.outputDirectory);
  }, (e) => {
    console.log(`No dice: ${e.message}`);
    process.exit(1);
  });

});
