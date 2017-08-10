var ctrl = angular.module('controllers', ['directives']);

ctrl.controller('detailsController', function($scope) {
  var socket = io();
  socket.on('list-info', function(info) {
    $('#infoTable').empty();
    $('#infoTable').append("<tr><td>Computer Name</td><td>" + info.ComputerName + "</td></tr>");
    $('#infoTable').append("<tr><td>Description</td><td>" + info.Description + "</td></tr>");
    $('#infoTable').append("<tr><td>Architecture</td><td>" + info.Architecture + "</td></tr>");
    $('#infoTable').append("<tr><td>Version</td><td>" + info.Version + "</td></tr>");
    $('#infoTable').append("<tr><td>Free Memory</td><td>" + info.FreeMemory + "</td></tr>");
    $('#infoTable').append("<tr><td>Total Memory</td><td>" + info.TotalMemory + "</td></tr>");
    $('#infoTable').append("<tr><td>Free Virtual Memory</td><td>" + info.FreeVirtMemory + "</td></tr>");
    $('#infoTable').append("<tr><td>Total Virtual Memory</td><td>" + info.TotalVirtMemory + "</td></tr>");
    $('#infoTable').append("<tr><td>System Drive</td><td>" + info.SystemDrive + "</td></tr>");
    $('#infoTable').append("<tr><td>Windows Directory</td><td>" + info.WindowsDir + "</td></tr>");
    $('#infoTable').append("<tr><td>Status</td><td>" + info.Status + "</td></tr>");
    $('#infoTable').append("<tr><td>Last Boot Up Time</td><td>" + info.LastBootUpTime + "</td></tr>");
    $('#infoTable').append("<tr><td>Install Date</td><td>" + info.InstallDate + "</td></tr>");
    $('#infoTable').append("<tr><td>Build Number</td><td>" + info.BuildNumber + "</td></tr>");
    $('#infoTable').append("<tr><td>Serial Number</td><td>" + info.SerialNumber + "</td></tr>");
  });
  socket.on('list-drives', function(drives) {
    $('#driveTable').empty();
    for (i in drives) {
      var drive = drives[i];
      $('#driveTable').append("<tr><td>" + drive.Name + "</td><td>" + drive.FreeSpace + "</td><td>" + drive.TotalSpace + "</td><td>" + drive.UsedPct + "</td></tr>");
    }
  });
  socket.on('error', function(error) {
      UIkit.notification({
        message: "An error occured",
        status: 'danger',
        pos: 'top-center',
        timeout: 3000
      });
  });
});

ctrl.controller('processesController', function($scope) {
  function filter(element) {
    var value = $(element).val().toLowerCase();
    $("#procBody > tr").hide().filter(function() {
      return $(this).children('.name').text().toLowerCase().indexOf(value) > -1;
    }).show();
  }
  $('#search').keyup(function() {
    filter(this); 
  });

  var socket = io();
  socket.on('list-processes', function(processes) {
    $('#procBody').empty();
    for (i in processes) {
      var proc = processes[i];
      $('#procBody').append("<tr><td class='id'>" + proc.ID + "</td><td class='name'>" + proc.Name + "</td><td>" + proc.Memory + "</td><td class='killProc'><button uk-icon='icon: close; ratio: 1'></button></td></tr>");
    }
    $('.killProc').click(function() {
      var killcheck = confirm('Are you sure you want to kill this process?');
      if (killcheck) {
        var id = $(this).parent().children('.id').text();
        socket.emit('kill-process', id);
      }
    });
    $('#procTable').tablesorter();
  });
  socket.on('kill-proc-succ', function(nothing) {
    UIkit.notification({
      message: "process killed",
      status: 'primary',
      pos: 'top-center',
      timeout: 5000
    });
  });
  socket.on('error', function(error) {
      UIkit.notification({
        message: "An error occured",
        status: 'danger',
        pos: 'top-center',
        timeout: 3000
      });
  });
});

ctrl.controller('powershellController', function($scope) {
  var langTools = ace.require("ace/ext/language_tools")
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/pastel_on_dark");
  editor.getSession().setMode("ace/mode/powershell");
  editor.setOptions({enableBasicAutocompletion: true});
  var customCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
      callback(null, commands.map(function (key) {
        return { name: key, value: key, score: "1", meta: key }
      }));
    }
  };
  langTools.addCompleter(customCompleter);

  var socket = io();

  $scope.sendCommand = function() {
    var command = editor.getValue();
    socket.emit('command', command)
  };

  socket.on('output', function(output) {
    var run = $('#run').detach();
    $('#output').text(output);
    run.prependTo('#output');
  });
});