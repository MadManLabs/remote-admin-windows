var shell = require('node-powershell');
var fs = require('fs');
var scriptsDir = process.cwd() + "/public/scripts/"
var tools = require('./edge');

module.exports = function(io) {
  io.on('connection', function(client) {
    console.log("Client connected");

    tools.listInfo("", function(error, info) {
      if (error) {
        io.emit('error', error);
        console.log(error);
      } else {
        io.emit('list-info', info);
      }
    });

    tools.listDrives("", function(error, drives) {
      if (error) {
        io.emit('error', error);
        console.log(error);
      } else {
        io.emit('list-drives', drives);
      }
    });

    tools.listProcesses("", function(error, processes) {
      if (error) {
        io.emit('error', error);
          console.log(error);
      } else {
        io.emit('list-processes', processes);
      }
    });

    client.on('kill-process', function(proc) {
      tools.killProcess(proc, function(error, nothing) {
        if (error) {
          io.emit('error', error);
          console.log(error);
        } else {
          io.emit('kill-proc-succ', "");
          tools.listProcesses("", function(error, processes) {
            if (error) {
              io.emit('error', error);
            } else {
              io.emit('list-processes', processes);
            }
          });
        }
      });
    });

    client.on('command', function(command) {
      var ps = new shell({executionPolicy: 'Bypass', debugMsg: true});
      ps.addCommand(command)
        .then(function() {
        	return ps.invoke();
        })
        .then(function(output) {
          io.emit('output', output);
          ps.dispose();
          res.end();
        })
        .catch(function(err) {
          io.emit('output', output);
          ps.dispose();
        });
    });
  });
}
