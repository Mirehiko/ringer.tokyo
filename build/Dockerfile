FROM python:3.6

# Set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Yekaterinburg /etc/localtime

LABEL maintainer="mirehiko@gmail.com"

ADD requirements.txt /
RUN ["pip", "install", "-r", "/requirements.txt"]

ADD ringo /ringo
ADD docker-entrypoint.sh /
ADD multiupload /usr/local/lib/python3.6/site-packages/multiupload

EXPOSE 8000

WORKDIR /ringo

#COPY /multiupload/ /usr/local/lib/python3.6/site-packages/multiupload/

ENTRYPOINT ["/docker-entrypoint.sh"]
