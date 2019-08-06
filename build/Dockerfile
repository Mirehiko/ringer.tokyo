FROM python:3.6

# Set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Yekaterinburg /etc/localtime

LABEL maintainer="mirehiko@gmail.com"

RUN ["pip", "install", "--upgrade", "pip"] 
RUN ["pip", "install", "--no-cache-dir", "uwsgi"] 

ADD requirements.txt /
RUN ["pip", "install", "-r", "/requirements.txt"]

ADD ringo /ringo
ADD uwsgi_conf /uwsgi_conf/
ADD docker-entrypoint.sh /
ADD multiupload /usr/local/lib/python3.6/site-packages/multiupload

EXPOSE 8000

WORKDIR /ringo


ENTRYPOINT ["/docker-entrypoint.sh"]
