#!/usr/bin/env python
#icomment''


import json
import logging
import random
import datetime
import tornado.ioloop
import tornado.web
import tornado.websocket
import urllib.parse

from auth_handle import get_auth_user_info


class MyAppWebSocket(tornado.websocket.WebSocketHandler):
    def check_auth(self, user_id):
        try:
            ssid = self.get_cookie("AUTH_SSID", None)
            user_data = get_auth_user_info(ssid)
            if not user_data:
                return False
            return user_data['uid'] == user_id
        except:
            self.close(code=500, reason="Socket failed to get info from authorization server.")
            return False

    def open(self, user_id, identifier, pathname):
        if not self.check_auth(user_id):
            # self.application.debug_logger.debug("AUTH FAILED user_id " + user_id) # DEBUG
            # self.application.debug_logger.debug("AUTH FAILED pathname " + pathname) # DEBUG
            # self.application.debug_logger.debug("AUTH FAILED identifier " + identifier) # DEBUG
            self.close(code=400, reason="Authorization required.")
        else:
            if not user_id in self.application.sockets:
                self.application.sockets[user_id] = {}
            if not pathname in self.application.sockets[user_id]:
                self.application.sockets[user_id][pathname] = {}
            self.application.sockets[user_id][pathname][identifier] = self
            self.user_id = user_id
            self.pathname = pathname
            self.identifier = identifier
            # self.application.debug_logger.debug("OPEN user_id " + user_id) # DEBUG
            # self.application.debug_logger.debug("OPEN pathname " + pathname) # DEBUG
            # self.application.debug_logger.debug("OPEN identifier " + identifier) # DEBUG
            # self.application.debug_logger.debug(user_id + " sockets " + str(self.application.sockets[user_id])) # DEBUG

    def on_message(self, message):
        # self.application.debug_logger.debug("message " + message) # DEBUG
        data = json.loads(message)
        if data["wtf"] == "message":
            data["noty_id"] = str(datetime.datetime.now().microsecond) + "|" + str(int(random.random() * 100000))
            data["send_notification"] = True
            data_to_send = json.dumps(data)
            user_pathnames = self.application.sockets.get(data["user"], list())
            for pathname in user_pathnames:
                for identifier in self.application.sockets[data["user"]][pathname]:
                    try:
                        # self.application.debug_logger.debug("PATH " + pathname) # DEBUG
                        # self.application.debug_logger.debug("send_notification " + str(data["send_notification"])) # DEBUG
                        self.application.sockets[data["user"]][pathname][identifier].write_message(data_to_send)
                        if data["send_notification"]:
                            data["send_notification"] = False
                            data_to_send = json.dumps(data)
                    except tornado.websocket.WebSocketClosedError:
                        continue
        elif data["wtf"] in ("close_noties", "close_resolve_error_noties"):
            user_pathnames = self.application.sockets.get(data["user"], list())
            for pathname in user_pathnames:
                for identifier in self.application.sockets[data["user"]][pathname]:
                    try:
                        self.application.sockets[data["user"]][pathname][identifier].write_message(message)
                    except tornado.websocket.WebSocketClosedError:
                        continue
        else:
            exclude = data.get("exclude", list())
            user_ids = set(self.application.sockets.keys()) - set(exclude)
            pathnames = data.get("pathnames", "all")
            for user_id in user_ids:
                if pathnames == "all":
                    pathnames = self.application.sockets[user_id].keys()
                for pathname in pathnames:
                    identifiers = self.application.sockets[user_id].get(pathname, list())
                    for identifier in identifiers:
                        try:
                            self.application.sockets[user_id][pathname][identifier].write_message(message)
                        except tornado.websocket.WebSocketClosedError:
                            continue


    def on_close(self):
        try:
            del self.application.sockets[self.user_id][self.pathname][self.identifier]
            # self.application.debug_logger.debug("CLOSE user_id " + self.user_id) # DEBUG
            # self.application.debug_logger.debug("CLOSE pathname " + self.pathname) # DEBUG
            # self.application.debug_logger.debug("CLOSE identifier " + self.identifier) # DEBUG
        except (KeyError, AttributeError):
            pass
        # self.application.debug_logger.debug(" sockets " + str(self.application.sockets)) # DEBUG

    def check_origin(self, origin):
        parsed_origin = urllib.parse.urlparse(origin)
        return parsed_origin.netloc.endswith(".oblgazeta.ru")


application = tornado.web.Application(
    [(r'/ws/(?P<user_id>[a-z]+)/(?P<pathname>.*)/(?P<identifier>.*)/', MyAppWebSocket)],
    debug=True,
)
application.sockets = {}
application.debug_logger = logging.getLogger()
application.debug_logger.setLevel(logging.DEBUG)


if __name__ == '__main__':
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
