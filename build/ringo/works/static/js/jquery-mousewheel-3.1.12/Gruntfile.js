"use strict";module.exports=function(e){e.initConfig({jshint:{options:{jshintrc:".jshintrc"},all:["jquery.mousewheel.js"]},uglify:{options:{compress:!0,mangle:!0,preserveComments:"some",report:"gzip"},build:{src:"jquery.mousewheel.js",dest:"jquery.mousewheel.min.js"}},connect:{server:{options:{hostname:"*",keepalive:!0,middleware:function(e,s){return[e.static(s.base),e.directory(s.base)]}}}}}),e.loadNpmTasks("grunt-contrib-jshint"),e.loadNpmTasks("grunt-contrib-uglify"),e.loadNpmTasks("grunt-contrib-connect"),e.registerTask("default",["jshint","uglify"])};