node-proxy
==========

simple nodejs web proxy 

    $ node proxy.js -h
    Usage: proxy [options]
    Options:
    -h, --help               output usage information
    -r, --reverse [reverse]  reverse proxy
    -f, --forward            forward proxy
    -p, --port [port]        port
    -d, --debug              debug

example
-----------
    # forward proxy
    $ node proxy.js -p 3128
    # reverse proxy
    $ node proxy.js -r http://mlwmlw.org
    # debug listen default port 8080
    $ node proxy.js -d

