    
FROM solr:8.1.1-slim
COPY web.xml /opt/solr/server/solr-webapp/webapp/WEB-INF/web.xml
RUN mkdir /tmp/gettingstarted
COPY ./conf /tmp/gettingstarted/conf