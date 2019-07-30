FROM python:3.6

# Set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Yekaterinburg /etc/localtime

LABEL maintainer="mirehiko@gmail.com"


ADD requirements.txt /
RUN ["pip", "install", "-r", "/requirements.txt"]


ADD docker-entrypoint.sh /

EXPOSE 8000

WORKDIR /ringo

ADD ringo /ringo
ADD multiupload /usr/local/lib/python3.6/site-packages/multiupload

#COPY /multiupload/ /usr/local/lib/python3.6/site-packages/multiupload/

ENTRYPOINT ["/docker-entrypoint.sh"]
