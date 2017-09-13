var ctrl = angular.module('controllers', ['directives']);

var socket = io();

ctrl.controller('detailsController', function($scope) {
  socket.emit('get-info', "");
  socket.on('list-info', function(info) {
    $('body').addClass('loaded');
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
  socket.emit('get-processes', "");
  function filter(element) {
    var value = $(element).val().toLowerCase();
    $("#procBody > tr").hide().filter(function() {
      return $(this).children('.name').text().toLowerCase().indexOf(value) > -1;
    }).show();
  }
  $('#search').keyup(function() {
    filter(this); 
  });
  socket.on('list-processes', function(processes) {
    $('body').addClass('loaded');
    $('#procBody').empty();
    for (i in processes) {
      var proc = processes[i];
      $('#procBody').append("<tr><td class='id'>" + proc.ID + "</td><td class='name'>" + proc.Name + "</td><td>" + proc.Memory + "</td><td class='killProc'><button uk-icon='icon: close; ratio: 1'></button></td></tr>");
    }
    $('.killProc').click(function() {
      $('body').removeClass('loaded');
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
  socket.on('start-proc-succ', function(nothing) {
    UIkit.notification({
      message: "process started",
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
  $('#newproc').click(function() {
    var proc = prompt("Please enter the full path of the executable:");
    if (proc == "") {
      UIkit.notification({
        message: "you must specify an executable",
        status: 'primary',
        pos: 'top-center',
        timeout: 5000
      });
    } else {
      socket.emit('start-process', proc);
      $('body').removeClass('loaded');
    }
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

  $scope.sendCommand = function() {
    $('body').removeClass('loaded');
    var command = editor.getValue();
    socket.emit('command', command)
  };
  socket.on('output', function(output) {
    $('body').addClass('loaded');
    var run = $('#run').detach();
    $('#output').text(output);
    run.prependTo('#output');
  });
});

ctrl.controller('softwareController', function($scope) {
  socket.emit('get-software', "");
  function filter(element) {
    var value = $(element).val().toLowerCase();
    $("#softBody > tr").hide().filter(function() {
      return $(this).children('.id').text().toLowerCase().indexOf(value) > -1;
    }).show();
  }
  $('#search').keyup(function() {
    filter(this); 
  });
  socket.on('list-software', function(software) {
    $('body').addClass('loaded');
    $('#softBody').empty();
    for (i in software) {
      var soft = software[i];
      $('#softBody').append("<tr><td class='id'>" + soft.Name + "</td><td class='.pid'>" + soft.Description + "</td><td>" + soft.InstallDate + "</td><td>" + soft.Vendor + "</td><td>" + soft.Version + "</td>" +
      //<td class='killSoft'><button uk-icon='icon: close; ratio: 1'></button></td>
      + "</tr>");
    }
    $('.killSoft').click(function() {
      $('body').removeClass('loaded');
      var killcheck = confirm('Are you sure you want to uninstall this program?');
      if (killcheck) {
        var id = $(this).parent().children('.pid').text();
        socket.emit('kill-software', id);
      }
    });
    $('#softTable').tablesorter();
  });
  socket.on('kill-soft-succ', function(nothing) {
    UIkit.notification({
      message: "program uninstalled",
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

ctrl.controller('servicesController', function($scope) {
  socket.emit('get-services', "");
  function filter(element) {
    var value = $(element).val().toLowerCase();
    $("#servBody > tr").hide().filter(function() {
      return $(this).children('.id').text().toLowerCase().indexOf(value) > -1;
    }).show();
  }
  $('#search').keyup(function() {
    filter(this); 
  });
  socket.on('list-services', function(services) {
    $('body').addClass('loaded');
    $('#servBody').empty();
    for (i in services) {
      var serv = services[i];
      if (serv.State == "Running") {
        $('#servBody').append("<tr><td class='id' id='" + serv.Name + "'>" + serv.DisplayName + "</td><td>" + serv.State + "</td><td>" + serv.StartMode + "</td><td>" + serv.ProcessId + "</td><td>" + serv.PathName + "</td><td class='killServ'><button uk-icon='icon: close; ratio: 1'></button></td></tr>");
        //$('#servBody').append("<tr><td class='id'>" + serv.DisplayName + "</td><td>" + serv.Name + "</td><td>" + serv.State + "</td><td>" + serv.StartMode + "</td><td>" + serv.ProcessId + "</td><td>" + serv.PathName + "</td><td class='killServ'><button uk-icon='icon: close; ratio: 1'></button></td></tr>");
      } else {
        $('#servBody').append("<tr><td class='id' id='" + serv.Name + "'>" + serv.DisplayName + "</td><td>" + serv.State + "</td><td>" + serv.StartMode + "</td><td>" + serv.ProcessId + "</td><td>" + serv.PathName + "</td><td class='killServ'><button uk-icon='icon: play; ratio: 1'></button></td></tr>");
        //$('#servBody').append("<tr><td class='id'>" + serv.DisplayName + "</td><td>" + serv.Name + "</td><td>" + serv.State + "</td><td>" + serv.StartMode + "</td><td>" + serv.ProcessId + "</td><td>" + serv.PathName + "</td><td class='killServ'><button uk-icon='icon: play; ratio: 1'></button></td></tr>");
      }
    }
    $('.killServ').click(function() {
      $('body').removeClass('loaded');
      var id = $(this).parent().children('.id').attr('id');
      socket.emit('kill-service', id);
    });
    $('#servTable').tablesorter();
  });
  socket.on('kill-serv-succ', function(nothing) {
    UIkit.notification({
      message: "service stopped",
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

ctrl.controller('filesController', function($scope) {
  socket.emit('get-drives', "");
  var upfld = "";
  socket.on('list-files', function(files) {
    $('body').addClass('loaded');
    $('#fileList').empty();
    $('#fileList').append("<li class='dropup dropzone drag-drop'><a class='uk-margin-small-right' data-uk-icon='icon: arrow-up; ratio: 1'></a>Drag files here to move them to the parent directory<a class='uk-margin-small-left' data-uk-icon='icon: arrow-up; ratio: 1'></a></li>");
    for (i in files) {
      var filefolder = files[i];
      if (filefolder.Type == "drive") {
        $('#fileList').append("<li><a class='uk-margin-small-right' data-uk-icon='icon: server; ratio: 1'></a><a class='drivepath uk-button uk-button-default uk-text-primary' id='" + filefolder.Path + "'>" + filefolder.Name + "</a></li>");
      } else if (filefolder.Type == "folder") {
        $('#fileList').append("<li class='dropzone todrag draggable drag-drop'><a class='name uk-margin-small-right' data-uk-icon='icon: folder; ratio: 1'></a><a class='folderpath uk-button uk-button-default uk-text-primary' id='" + filefolder.Path + "'>" + filefolder.Name + "</a><span style='float:right;'><a class='renameFolder uk-margin-small-right' data-uk-icon='icon: pencil; ratio: 1.5'></a><a class='delFolder' data-uk-icon='icon: close; ratio: 1.5'></a></span></li>");
      } else if (filefolder.Type == "file") {
        $('#fileList').append("<li class='dropfile todrag draggable drag-drop'><a class='name uk-margin-small-right' data-uk-icon='icon: file; ratio: 1'></a><label class='filepath' id='" + filefolder.Path + "'>" + filefolder.Name + "</label><span style='float:right;'><a class='renameFile uk-margin-small-right' data-uk-icon='icon: pencil; ratio: 1.5'></a><a class='delFile' data-uk-icon='icon: close; ratio: 1.5'></a></span></li>");
      }
    }
    //$('#fileList').append("<li class='dropdown dropzone drag-drop'><a class='uk-margin-small-right' data-uk-icon='icon: close; ratio: 1'></a>Drag files here to delete them permanently<a class='uk-margin-small-left' data-uk-icon='icon: close; ratio: 1'></a></li>");
    $('.drivepath').click(function() {
      $scope.location = $(this).attr('id');
      $('#goloc').val($(this).attr('id'));
      $('body').removeClass('loaded');
      socket.emit('get-files', $scope.location);
    });
    $('.folderpath').click(function() {
      $scope.location = $(this).attr('id');
      $('#goloc').val($(this).attr('id'));
      $('body').removeClass('loaded');
      socket.emit('get-files', $scope.location);
    });
    $('.renameFolder').click(function() {
      var refolder = prompt("Please enter the new name for the folder:");
      if (refolder == "") {
        UIkit.notification({
          message: "Please enter a folder name",
          status: 'primary',
          pos: 'top-center',
          timeout: 5000
        });
      } else {
        socket.emit('move-folder', {'newpath': $scope.location + "\\" + refolder, 'oldpath': $(this).parent().parent().children('.folderpath').attr('id')});
      }
    });
    $('.renameFile').click(function() {
      var refile = prompt("Please enter the new name for the file:");
      if (refile == "") {
        UIkit.notification({
          message: "Please enter a file name",
          status: 'primary',
          pos: 'top-center',
          timeout: 5000
        });
      } else {
        socket.emit('move-file', {'newpath': $scope.location + "\\" + refile, 'oldpath': $(this).parent().parent().children('.filepath').attr('id')});
      }
    });
    $('.delFolder').click(function() {
      if (confirm("Are you sure you want to delete this folder?")) {
        socket.emit('delete-folder', $(this).parent().parent().children('.folderpath').attr('id'));
      } else {
        UIkit.notification({
          message: "deletion cancelled",
          status: 'primary',
          pos: 'top-center',
          timeout: 2000
        });
      }
    });
    $('.delFile').click(function() {
      if (confirm("Are you sure you want to delete this file?")) {
        socket.emit('delete-file', $(this).parent().parent().children('.filepath').attr('id'));
      } else {
        UIkit.notification({
          message: "deletion cancelled",
          status: 'primary',
          pos: 'top-center',
          timeout: 2000
        });
      }
    });
    // target elements with the "draggable" class
    interact('.draggable')
    .draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      restrict: {
        restriction: "parent",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      // enable autoScroll
      autoScroll: true,

      // call this function on every dragmove event
      onmove: dragMoveListener,
      // call this function on every dragend event
      onend: function (event) {
        
      }
    });
    function dragMoveListener (event) {
      var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
    interact('.dropzone').dropzone({
      // only accept elements matching this CSS selector
      accept: '.todrag',
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,
      // listen for drop related events:
      ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
      },
      ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;
        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
      },
      ondrop: function (event) {
        if ($(event.relatedTarget).hasClass('dropzone')) {
          var name = $(event.relatedTarget).children('.folderpath').text();
          var oldpath = $(event.relatedTarget).children('.folderpath').attr('id');
          if ($(event.target).hasClass('dropup')) {
            var nextpath = $scope.location.substring(0, $scope.location.lastIndexOf('\\')) + "\\" + name;
            console.log(nextpath);
          } else {
            var newpath = $(event.target).children('.folderpath').attr('id');
            var nextpath = newpath + "\\" + name;
          }
          socket.emit('move-folder', {'newpath': nextpath, 'oldpath': oldpath});
        } else if ($(event.relatedTarget).hasClass('dropfile')) {
          var name = $(event.relatedTarget).children('.filepath').text();
          var oldpath = $(event.relatedTarget).children('.filepath').attr('id');
          if ($(event.target).hasClass('dropup')) {
            var nextpath = $scope.location.substring(0, $scope.location.lastIndexOf('\\')) + "\\" + name;
            socket.emit('move-file', {'newpath': nextpath, 'oldpath': oldpath});
          /*} else if ($(event.target).hasClass('dropdown')) {
            if (confirm("Are you sure you want to delete this file?")) {
              socket.emit('delete-file', oldpath);
            } else {
              UIkit.notification({
                message: "deletion cancelled",
                status: 'primary',
                pos: 'top-center',
                timeout: 2000
              });
            }*/
          } else {
            var newpath = $(event.target).children('.folderpath').attr('id');
            var nextpath = newpath + "\\" + name;
            socket.emit('move-file', {'newpath': nextpath, 'oldpath': oldpath});
          }
        }
        $(event.relatedTarget).hide();
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });
  });
  socket.on('show-result', function(result) {
    socket.emit('get-files', $scope.location);
    UIkit.notification({
      message: result,
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
  $('#goup').click(function() {
    $('body').removeClass('loaded');
    upfld = $scope.location.substring(0, $scope.location.lastIndexOf('\\'));
    console.log(upfld);
    if (upfld.length > 3) {
      socket.emit('get-files', upfld);
      $scope.location = upfld;
    } else {
      socket.emit('get-drives', "");
    }    
  });
  $('#gohome').click(function() {
    $('body').removeClass('loaded');
    socket.emit('get-drives', "");
    $('#goloc').val("");
    $scope.location = "";
  });
  $('#createfile').click(function() {
    var newfile = prompt("Please enter a name for the new file:");
    if (newfile == "") {
      UIkit.notification({
        message: "Please enter a file name",
        status: 'primary',
        pos: 'top-center',
        timeout: 5000
      });
    } else {
      $('body').removeClass('loaded');
      var newflpth = $scope.location + "\\" + newfile;
      socket.emit('new-file', newflpth);
    }
  });
  $('#createfolder').click(function() {
    var newfolder = prompt("Please enter a name for the new folder:");
    if (newfolder == "") {
      UIkit.notification({
        message: "Please enter a folder name",
        status: 'primary',
        pos: 'top-center',
        timeout: 5000
      });
    } else {
      $('body').removeClass('loaded');
      var newflpth = $scope.location + "\\" + newfolder;
      socket.emit('new-folder', newflpth);
    }
  });
  $('#refresh').click(function() {
    if ($scope.location != "") {
      socket.emit('get-files', $scope.location);
    }
  });
  $scope.golocation = function() {
    if ($scope.location != "") {
      socket.emit('get-files', $scope.location);
    }
  };
});