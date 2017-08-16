FROM jacfearsome/node

ADD . /remote-admin
WORKDIR /remote-admin
RUN npm install
EXPOSE 6060

CMD ["C:\node\node.exe", "server.js"]