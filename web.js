//require.paths.push('app');
//console.log(require.paths);
process.env['NODE_PATH'] = __dirname + '/app';  
require("module")._initPaths();  
require('bootstrap');
