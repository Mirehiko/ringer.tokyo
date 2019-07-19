FROM python:3.6

# Set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Yekaterinburg /etc/localtime

ADD requirements.txt /
RUN ["pip", "install", "-r", "/requirements.txt"]

ADD ws.py /

EXPOSE 8000

ENTRYPOINT ["python", "ws.py"]