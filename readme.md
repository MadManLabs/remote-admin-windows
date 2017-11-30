## Remote Admin - Windows
This is a web-based remote management tool for Windows built with Node.js. It is a combination of my other Windows remote tools.  Right now it features:
* a system details viewer
* a process manager
* a service manager
* a software list
* a file manager
* a Powershell terminal.

Features I plan to add:

* the ability to uninstall programs
* the ability to change a service's start mode
* the ability to download files
* a system resource monitor (real-time)
* possibly a task scheduler
* possibly a registry editor

To run this this project, you must have Node.js installed, along with npm, the Node.js package manager.

Clone the project:

`git clone https://github.com/JacFearsome/remote-admin-windows.git`

Install the node module dependencies:
	
`cd remote-admin-windows && npm install`

Run the app:

`node server.js`

And finally, go to http://localhost:6060/ in your web browser.

I would recommend only running this within a local network, as to prevent the entire internet from having the ability to manage your PC.

Screenshots:
![alt text](https://www.jesserussell.net/wp-content/uploads/2017/11/remote-admin-windows-services.png)
![alt text](https://www.jesserussell.net/wp-content/uploads/2017/11/remote-admin-windows-loading.png)
![alt text](https://www.jesserussell.net/wp-content/uploads/2017/11/remote-admin-windows-software.png)
![alt text](https://www.jesserussell.net/wp-content/uploads/2017/11/remote-admin-windows-drives.png)
![alt text](https://www.jesserussell.net/wp-content/uploads/2017/11/remote-admin-windows-files.png)
![alt text](https://www.jesserussell.net/wp-content/uploads/2017/11/remote-admin-windows-ps.png)
![alt text](https://www.jesserussell.net/wp-content/uploads/2017/11/remote-admin-windows-1.png)
![alt text](https://www.jesserussell.net/wp-content/uploads/2017/11/remote-admin-windows-2.png)
