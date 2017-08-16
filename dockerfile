FROM compulim/iisnode

ADD . /remote-admin
RUN powershell -No Profile -COMMAND Import-Module IISAdministration; NEW-IISSite -Name 'Remote Admin' -PhysicalPath C:\remote-admin -BindingInformation '*:8000:'

EXPOSE 8000