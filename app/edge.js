var edge = require('edge');

module.exports = {
    'listProcesses': edge.func(function() {/*
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
    */}),
    'killProcess': edge.func(function() {/*
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
    */}),
  'listDrives': edge.func(function() {/*
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
*/}),
  'listInfo': edge.func(function() {/*
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
*/}),
  'listSoftware': edge.func(function() {/*
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

        ObjectQuery query = new ObjectQuery("SELECT * FROM Win32_Product");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

        ManagementObjectCollection queryCollection = searcher.Get();
        return queryCollection;
        }
    }
*/})

};