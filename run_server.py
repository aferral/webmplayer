import sys
import os

# import music app
path_downloader = 'fuse_music'
sys.path.append(os.path.abspath(path_downloader))
base_abs_path = os.path.abspath('./')
print(base_abs_path)
os.chdir(path_downloader)

import http.server
import socketserver
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import io
from subprocess import Popen, PIPE
import json
from data_manager import get_or_create_metadata_database
from drive_utils import download_and_decript

backend_url = os.environ['dist_url']
allowed_paths = ['dist','img','fonts']
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = self.path.split('/')
        if parsed_path[1] == 'list':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin',backend_url)
            self.end_headers()

            # list music from drive 
            x=get_or_create_metadata_database(verbose=False)
            vals=x.list(as_dict=True)
            self.wfile.write(json.dumps(vals).encode())

        elif parsed_path[1] == 'download':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin',backend_url)
            self.end_headers()

            id_to_play = parsed_path[2]
            download_and_decript(id_to_play, self.wfile)
        elif self.path == '/':
            self.send_response(200)
            self.end_headers()
            with open(os.path.join(base_abs_path,'index.html'),'rb') as f:
                self.wfile.write(f.read())
        elif parsed_path[1] in allowed_paths: # only enable access to dist files
            self.send_response(200)
            self.end_headers()

            calc_path = os.path.join(base_abs_path,self.path[1:])
            print(calc_path)
            with open(calc_path,'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(200)
            self.end_headers()

            self.wfile.write('not ok'.encode('utf8'))

import sys
host,port = sys.argv[1],int(sys.argv[2])
print('Starting host: {0} port: {1}'.format(host,port))
httpd = HTTPServer((host, port), SimpleHTTPRequestHandler)
httpd.serve_forever()
