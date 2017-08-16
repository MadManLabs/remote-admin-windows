FROM microsoft/windowsservercore

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

RUN Invoke-WebRequest $('https://nodejs.org/dist/v6.11.2/node-v6.11.2-win-x64.zip' -f $env:NODE_VERSION) -OutFile 'node.zip' -UseBasicParsing ; \
    Expand-Archive node.zip -DestinationPath C:\ ; \
    Rename-Item -Path 'C:\node-v6.11.2-win-x64' -NewName 'C:\nodejs'

ADD . /remote-admin

WORKDIR /remote-admin

RUN ["C:\\nodejs\\npm", "install"]

EXPOSE 6060

CMD ["C:\\nodejs\\node.exe", "server.js"]