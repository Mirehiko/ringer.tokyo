FROM python:3.6

# Set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Yekaterinburg /etc/localtime

LABEL maintainer="mirehiko@gmail.com"

ENV PYTHONUNBUFFERED 1


#ADD requirements.txt /
#RUN pip install -r requirements.txt


ADD docker-entrypoint-dev.sh /

WORKDIR /ringo

COPY requirements.txt /ringo/
RUN pip install -r requirements.txt
COPY . /ringo/
COPY /multiupload/ /usr/local/lib/python3.6/site-packages/multiupload/

ENTRYPOINT ["/docker-entrypoint-dev.sh"]
