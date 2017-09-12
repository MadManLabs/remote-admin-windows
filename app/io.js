var shell = require('node-powershell');
var edge = require('edge');
//var tools = require('./edge');


module.exports = function(io) {
  io.on('connection', function(client) {
    console.log("Client connected");

    listInfo("", function(error, info) {
      if (error) {
        io.emit('error', error);
        console.log(error);
      } else {
        io.emit('list-info', info);
      }
    });

    listDrives("", function(error, drives) {
      if (error) {
        io.emit('error', error);
        console.log(error);
      } else {
        io.emit('list-drives', drives);
      }
    });

    listProcesses("", function(error, processes) {
      if (error) {
        io.emit('error', error);
          console.log(error);
      } else {
        io.emit('list-processes', processes);
      }
    });

    listSoftware("", function(error, software) {
      if (error) {
        io.emit('error', error);
          console.log(error);
      } else {
        io.emit('list-software', software);
      }
    });

    listServices("", function(error, services) {
      if (error) {
        io.emit('error', error);
          console.log(error);
      } else {
        io.emit('list-services', services);
      }
    });

    listDriveFolders("", function(error, drives) {
      if (error) {
        io.emit('error', error);
        console.log(error);
      } else {
        io.emit('list-files', drives);
      }
    });

    client.on('kill-process', function(proc) {
      killProcess(proc, function(error, nothing) {
        if (error) {
          io.emit('error', error);
          console.log(error);
        } else {
          io.emit('kill-proc-succ', "");
          listProcesses("", function(error, processes) {
            if (error) {
              io.emit('error', error);
            } else {
              io.emit('list-processes', processes);
            }
          });
        }
      });
    });

    client.on('kill-software', function(soft) {
      killSoft(soft, function(error, nothing) {
        if (error) {
          io.emit('error', error);
          console.log(error);
        } else {
          io.emit('kill-soft-succ', "");
          listSoftware("", function(error, software) {
            if (error) {
              io.emit('error', error);
                console.log(error);
            } else {
              io.emit('list-software', software);
            }
          });
        }
      });
    });

    client.on('kill-service', function(serv) {
      killServ(serv, function(error, nothing) {
        if (error) {
          io.emit('error', error);
          console.log(error);
        } else {
          io.emit('kill-serv-succ', "");
          listServices("", function(error, services) {
            if (error) {
              io.emit('error', error);
              console.log(error);
            } else {
              io.emit('list-services', services);
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
          io.emit('error', err);
          ps.dispose();
        });
    });

    client.on('get-files', function(path) {
      listFiles(path, function(error, files) {
        if (error) {
          io.emit('error', error);
          console.log(error);
        } else {
          io.emit('list-files', files);
        }
      });
    });

    client.on('move-file', function(data) {
      var array = [data.oldpath, data.newpath];
      moveFile(data, function(error, result) {
        if (error) {
          io.emit('error', error);
          console.log(error);
        } else {
          io.emit('show-move-result', result);
        }
      });
    });
  });
}

var moveFile =  edge.func(function() {/*
    #r "System.Management.dll"

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Management;
    using System.Text;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using System.IO;


    public class Startup
    {
      public async Task<object> Invoke(string[] data)
      {
        if (!File.Exists(data[1]))
        {
          File.Move(data[0], data[1]);
          return "File successfully moved";
        } else {
          return "A file with the same name already exists in that folder";
        }
        return "Nothing happened";        
      }
    }
*/});
var listFiles =  edge.func(function() {/*
    #r "System.Management.dll"

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Management;
    using System.Text;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using System.IO;


    public class Startup
    {
        public class filefolder
        {
            public string Name { get; set; }
            public string Type { get; set; }
            public string Path { get; set; }

            public filefolder()
            {

            }

            public filefolder(string _name, string _type, string _path)
            {
                Name = _name;
                Type = _type;
                Path = _path;
            }
        }
      public async Task<object> Invoke(string input)
      {
        List<filefolder> files = new List<filefolder>();
        DirectoryInfo dir = new DirectoryInfo(input);
        DirectoryInfo[] subDirs = dir.GetDirectories();
        foreach (DirectoryInfo f in subDirs)
        {
          filefolder flfld = new filefolder { Name = f.Name.ToString(), Type = "folder", Path = f.FullName.ToString()};
          files.Add(flfld);
        }
        FileInfo[] fls = dir.GetFiles();
        foreach (FileInfo f in fls)
        {
          filefolder flfld = new filefolder { Name = f.Name.ToString(), Type = "file", Path = f.FullName.ToString()};
          files.Add(flfld);
        }
        return files;
      }
    }
*/});
var listDriveFolders =  edge.func(function() {/*
    #r "System.Management.dll"

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Management;
    using System.Text;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using System.IO;


    public class Startup
    {
        public class filefolder
        {
            public string Name { get; set; }
            public string Type { get; set; }
            public string Path { get; set; }

            public filefolder()
            {

            }

            public filefolder(string _name, string _type, string _path)
            {
                Name = _name;
                Type = _type;
                Path = _path;
            }
        }
      public async Task<object> Invoke(object input)
      {
        List<filefolder> files = new List<filefolder>();
        DriveInfo[] drives = DriveInfo.GetDrives();
        foreach (DriveInfo d in drives)
        {
          filefolder flfld = new filefolder { Name = d.Name.ToString(), Type = "drive", Path = d.RootDirectory.ToString()};
          files.Add(flfld);
        }
        return files;
      }
    }
*/});
var killServ =  edge.func(function() {/*
    #r "System.Management.dll"
    #r "System.ServiceProcess.dll"

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Management;
    using System.Text;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using System.ServiceProcess;


    public class Startup
    {
      public async Task<object> Invoke(object input)
      {

        ServiceController sc = new ServiceController(input.ToString());
        if  ((sc.Status.Equals(ServiceControllerStatus.Stopped)) || (sc.Status.Equals(ServiceControllerStatus.StopPending)))
        {
          sc.Start();
          return true;
        }  
        else
        {
          sc.Stop();
          return true;
        }
        return false;
      }
    }
*/});
var listServices = edge.func(function() {/*
    #r "System.Management.dll"

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Management;
    using System.Text;
    using System.Diagnostics;
    using System.Threading.Tasks;


    public class Startup
    {
        public class serv
        {
            public string Name { get; set; }
            public string DisplayName { get; set; }
            public string PathName { get; set; }
            public string ProcessId { get; set; }
            public string StartMode { get; set; }
            public string State { get; set; }

            public serv()
            {

            }

            public serv(string _name, string _DisplayName, string _PathName, string _ProcessId, string _StartMode, string _State)
            {
                Name = _name;
                DisplayName = _DisplayName;
                PathName = _PathName;
                ProcessId = _ProcessId;
                StartMode = _StartMode;
                State = _State;
            }
        }

        public async Task<object> Invoke(object input)
        {

        ManagementScope scope = new ManagementScope(@"\\.\root\cimv2");
        scope.Connect();

        List<serv> services = new List<serv>();

        ObjectQuery query = new ObjectQuery("SELECT * FROM Win32_Service");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

        ManagementObjectCollection queryCollection = searcher.Get();
        foreach (ManagementObject m in queryCollection)
        {
          string Name = m["Name"].ToString();
          string DisplayName = m["DisplayName"].ToString();
          string PathName = m["PathName"].ToString();
          string ProcessId = m["ProcessId"].ToString();
          string StartMode = m["StartMode"].ToString();
          string State = m["State"].ToString();

          serv srvc = new serv { Name = Name, DisplayName = DisplayName, PathName = PathName, ProcessId = ProcessId, StartMode = StartMode, State = State };
          services.Add(srvc);
        }
        return services;
        }
    }
*/});
var killSoft =  edge.func(function() {/*
    #r "System.Management.dll"

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Management;
    using System.Text;
    using System.Diagnostics;
    using System.Threading.Tasks;


    public class Startup
    {
        public async Task<object> Invoke(object input)
        {

        ManagementScope scope = new ManagementScope(@"\\.\root\cimv2");
        scope.Connect();
        ObjectQuery query = new ObjectQuery("SELECT * FROM Win32_Product WHERE Name = '" + input + "'");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

        ManagementObjectCollection queryCollection = searcher.Get();
        foreach (ManagementObject m in queryCollection)
        {
          try
          {
            if (m["Name"].ToString() == input)
            {
              string ident = m["IdentifyingNumber"].ToString();
              string UninstallCommandString = "/x {0} /qn";

              Process process = new Process();
              ProcessStartInfo startInfo = new ProcessStartInfo();
              process.StartInfo = startInfo;

              startInfo.UseShellExecute = false;
              startInfo.RedirectStandardError = true;

              startInfo.FileName = "msiexec.exe";
              startInfo.Arguments = string.Format(UninstallCommandString, ident);

              process.Start();
              return true;
            }
          }
          catch (Exception ex)
          {
            return false;
          }
        }
        return false;
      }
    }
*/});
var listSoftware = edge.func(function() {/*
    #r "System.Management.dll"

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Management;
    using System.Text;
    using System.Diagnostics;
    using System.Threading.Tasks;


    public class Startup
    {
        public class soft
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string InstallDate { get; set; }
            public string Vendor { get; set; }
            public string Version { get; set; }

            public soft()
            {

            }

            public soft(string _name, string _description, string _installdate, string _vendor, string _version)
            {
                Name = _name;
                Description = _description;
                InstallDate = _installdate;
                Vendor = _vendor;
                Version = _version;
            }
        }

        public async Task<object> Invoke(object input)
        {

        ManagementScope scope = new ManagementScope(@"\\.\root\cimv2");
        scope.Connect();

        List<soft> software = new List<soft>();

        ObjectQuery query = new ObjectQuery("SELECT * FROM Win32_Product");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

        ManagementObjectCollection queryCollection = searcher.Get();
        foreach (ManagementObject m in queryCollection)
        {
          string Name = m["Name"].ToString();
          string Description = m["Description"].ToString();
          string InstallDate = m["InstallDate"].ToString();
          string Vendor = m["Vendor"].ToString();
          string Version = m["Version"].ToString();

          soft sftw = new soft { Name = Name, Description = Description, InstallDate = InstallDate, Vendor = Vendor, Version = Version };
          software.Add(sftw);
        }
        return software;
        }
    }
*/});
var listProcesses = edge.func(function() {/*
    #r "System.Management.dll"

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Management;
    using System.Text;
    using System.Diagnostics;
    using System.Threading.Tasks;


    public class Startup
    {


        public class proc
        {
            public String Name { get; set; }
            public String Memory { get; set; }
            public int ID { get; set; }

            public proc()
            {

            }

            public proc(string _name, string _Memory, int _id)
            {
                Name = _name;
                Memory = _Memory;
                ID = _id;
            }
        }

        private static string FormatBytes(long bytes)
        {
            int i;
            double dblSByte = (bytes / 1024) / 1024;
            return String.Format("{0:0.###}", dblSByte);
        }

        public async Task<object> Invoke(object input)
        {

        List<proc> processes = new List<proc>();

        Process[] processList = Process.GetProcesses();

        foreach (Process process in processList)
        {
            string workingset = FormatBytes(process.WorkingSet64);
            proc procObj = new proc { Name = process.ProcessName, Memory = workingset, ID = process.Id};
            processes.Add(procObj);
        }

        return processes;
        }
    }
*/});
var killProcess = edge.func(function() {/*
    #r "System.Management.dll"

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Management;
    using System.Text;
    using System.Diagnostics;
    using System.Threading.Tasks;


    public class Startup
    {
        public async Task<object> Invoke(string input)
        {
            int procid = Int32.Parse(input);
            Process p = Process.GetProcessById(procid);
            p.Kill();
            return "";
        }
    }
*/});
var listDrives = edge.func(function() {/*
  #r "System.Management.dll"

  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Management;
  using System.Text;
  using System.Diagnostics;
  using System.Threading.Tasks;


  public class Startup
  {

      public class disk
      {
          public String Name { get; set; }
          public String FreeSpace { get; set; }
          public String TotalSpace { get; set; }
          public String UsedPct { get; set; }

          public disk()
          {

          }

          public disk(string _name, string _FreeSpace, string _TotalSpace, string _UsedPCT)
          {
              Name = _name;
              FreeSpace = _FreeSpace;
              TotalSpace = _TotalSpace;
              UsedPct = _UsedPCT;
          }
      }

      private static string FormatBytes(long bytes)
      {
          string[] Suffix = { "B", "KB", "MB", "GB", "TB" };
          int i;
          double dblSByte = bytes;
          for (i = 0; i < Suffix.Length && bytes >= 1024; i++, bytes /= 1024)
          {
              dblSByte = bytes / 1024.0;
          }

          return String.Format("{0:0.##} {1}", dblSByte, Suffix[i]);
      }

      public async Task<object> Invoke(object input)
      {

      ManagementScope scope = new ManagementScope(@"\\.\root\cimv2");
      scope.Connect();

      List<disk> drives = new List<disk>();

      ObjectQuery query = new ObjectQuery("SELECT FreeSpace,Size,Name FROM Win32_LogicalDisk where DriveType=3");
      ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

      ManagementObjectCollection queryCollection = searcher.Get();
      foreach (ManagementObject m in queryCollection)
      {
          String free = m["FreeSpace"].ToString();
          String total = m["Size"].ToString();
          long freeInt = Int64.Parse(free);
          long totalInt = Int64.Parse(total);
          double freeDbl = Int64.Parse(free);
          double totalDbl = Int64.Parse(total);
          double usedDbl = (totalDbl - freeDbl);
          double percent = (usedDbl / totalDbl) * 100;
          String percentStr = (percent.ToString("0.00")) + " %";
          ///String percentStr = String.Format("{0:0.##} {1}", percent, Suffix);
          free = FormatBytes(freeInt);
          total = FormatBytes(totalInt);
          disk drive = new disk { Name = m["Name"].ToString(), FreeSpace = free, TotalSpace =  total, UsedPct = percentStr};
          drives.Add(drive);
      }
      return drives;
      }
  }
*/});
var listInfo = edge.func(function() {/*
  #r "System.Management.dll"

  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Management;
  using System.Text;
  using System.Diagnostics;
  using System.Threading.Tasks;


  public class Startup
  {

      public class info
      {
          public String BuildNumber { get; set; }
          public String ComputerName { get; set; }
          public String Description { get; set; }
          public String FreeMemory { get; set; }
          public String TotalMemory { get; set; }
          public String FreeVirtMemory { get; set; }
          public String TotalVirtMemory { get; set; }
          public String InstallDate { get; set; }
          public String LastBootUpTime { get; set; }
          public String Architecture { get; set; }
          public String SerialNumber { get; set; }
          public String Status { get; set; }
          public String SystemDrive { get; set; }
          public String Version { get; set; }
          public String WindowsDir { get; set; }

          public info()
          {

          }

          public info(string _buildNumber, string _computerName, string _description, string _freeMemory, string _totalMemory, string _freeVirtMemory, string _totalVirtMemory, string _installDate, string _lastBoot, string _architecture, string _serialNumber, string _status, string _systemDrive, string _version, string _windowsDir)
          {
          BuildNumber = _buildNumber;
          ComputerName = _computerName;
          Description = _description;
          FreeMemory = _freeMemory;
          TotalMemory = _totalMemory;
          FreeVirtMemory = _freeVirtMemory;
          TotalVirtMemory = _totalVirtMemory;
          InstallDate = _installDate;
          LastBootUpTime = _lastBoot;
          Architecture = _architecture;
          SerialNumber = _serialNumber;
          Status = _status;
          SystemDrive = _systemDrive;
          Version = _version;
          WindowsDir = _windowsDir;
          }
      }

      private static string FormatKBytes(long bytes)
      {
          string[] Suffix = {"KB", "MB", "GB", "TB" };
          int i;
          double dblSByte = bytes;
          for (i = 0; i < Suffix.Length && bytes >= 1024; i++, bytes /= 1024)
          {
              dblSByte = bytes / 1024.0;
          }

          return String.Format("{0:0.##} {1}", dblSByte, Suffix[i]);
      }

      public async Task<object> Invoke(object input)
      {

      ManagementScope scope = new ManagementScope(@"\\.\root\cimv2");
      scope.Connect();

      ObjectQuery query = new ObjectQuery("SELECT * FROM Win32_OperatingSystem");
      ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

      ManagementObjectCollection queryCollection = searcher.Get();
      foreach (ManagementObject m in queryCollection)
      {
          string _buildNumber = m["BuildNumber"].ToString();
          string _computerName = m["csname"].ToString();
          string _description = m["Description"].ToString();
          string FreePhysMem = m["FreePhysicalMemory"].ToString();
          string TotalPhysMem = m["TotalVisibleMemorySize"].ToString();

          long FreePhysMemLong = Int64.Parse(FreePhysMem);
          long TotalPhysMemLong = Int64.Parse(TotalPhysMem);
          FreePhysMem = FormatKBytes(FreePhysMemLong);
          TotalPhysMem = FormatKBytes(TotalPhysMemLong);
          string _freeMemory = FreePhysMem;
          string _totalMemory = TotalPhysMem;

          string FreeVirtMem = m["FreeVirtualMemory"].ToString();
          string TotalVirtMem = m["TotalVirtualMemorySize"].ToString();
          long FreeVirtMemLong = Int64.Parse(FreeVirtMem);
          long TotalVirtMemLong = Int64.Parse(TotalVirtMem);
          FreeVirtMem = FormatKBytes(FreeVirtMemLong);
          TotalVirtMem = FormatKBytes(TotalVirtMemLong);
          string _freeVirtMemory = FreeVirtMem;
          string _totalVirtMemory = TotalVirtMem;

          DateTime InstallDateFormat = System.Management.ManagementDateTimeConverter.ToDateTime(m["InstallDate"].ToString());
          DateTime LastBootUpTimeFormat = System.Management.ManagementDateTimeConverter.ToDateTime(m["LastBootUpTime"].ToString());
          string _installDate = InstallDateFormat.ToString();
          string _lastBoot = LastBootUpTimeFormat.ToString();
          string _architecture = m["OSArchitecture"].ToString();
          string _serialNumber = m["SerialNumber"].ToString();
          string _status = m["Status"].ToString();
          string _systemDrive = m["SystemDrive"].ToString();
          string _version = m["Version"].ToString();
          string _windowsDir = m["WindowsDirectory"].ToString();
          info sysinfo = new info {
            BuildNumber = _buildNumber,
            ComputerName = _computerName,
            Description = _description,
            FreeMemory = _freeMemory,
            TotalMemory = _totalMemory,
            FreeVirtMemory = _freeVirtMemory,
            TotalVirtMemory = _totalVirtMemory,
            InstallDate = _installDate,
            LastBootUpTime = _lastBoot,
            Architecture = _architecture,
            SerialNumber = _serialNumber,
            Status = _status,
            SystemDrive = _systemDrive,
            Version = _version,
            WindowsDir = _windowsDir
          };
          return sysinfo;
      }
      return "";
      }
  }
*/});