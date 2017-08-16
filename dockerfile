FROM compulim/iisnode

ADD . /remote-admin
RUN npm install -g pm2
EXPOSE 6060