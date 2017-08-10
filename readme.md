## Remote Admin - Windows
This is a web-based remote management tool for Windows built with Node.js. It is a combination of my other Windows remote tools.  Right now it features a system details viewer, a process manager, and a Powershell terminal.

Tools I plan to add:

* file manager
* system resource monitor (real-time)
* possibly a task scheduler

To run this this project, you must have Node.js installed, along with npm, the Node.js package manager.

Clone the project:

`git clone https://github.com/JacFearsome/remote-admin-windows.git`

Install the node module dependencies:
	
`cd remote-admin-windows && npm install`

Run the app:

`node server.js`

And finally, go to http://localhost:6060/ in your web browser.

I would recommend only running this within a local network, as to prevent the entire internet from having the ability to manage your PC.