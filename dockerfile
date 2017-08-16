FROM jacfaersome/node

ADD . /remote-admin
WORKDIR C:\remote-admin
RUN npm install
EXPOSE 6060

CMD ["node.exe", "server.js"]