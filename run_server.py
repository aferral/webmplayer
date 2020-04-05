import sys
import os

# import music app
path_downloader = os.environ['MUSIC_LIBRARY_PATH']
sys.path.append(path_downloader)
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

# check config
from test.test_service_conn import test_service_get

test_service_get()

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = self.path.split('/')
        if parsed_path[1] == 'list':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # list music from drive 
            x=get_or_create_metadata_database(verbose=False)
            vals=x.list(as_dict=True)
            self.wfile.write(json.dumps(vals).encode())

        elif parsed_path[1] == 'download':
            self.send_response(200)
            self.end_headers()

            id_to_play = parsed_path[2]
            download_and_decript(id_to_play, self.wfile)
        elif self.path == '/':
            self.send_response(200)
            self.end_headers()
            with open(os.path.join(base_abs_path,'index.html'),'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(200)
            self.end_headers()

            calc_path = os.path.join(base_abs_path,self.path[1:])
            print(calc_path)
            with open(calc_path,'rb') as f:
                self.wfile.write(f.read())

import sys
host,port = sys.argv[1],int(sys.argv[2])
print('Starting host: {0} port: {1}'.format(host,port))
httpd = HTTPServer((host, port), SimpleHTTPRequestHandler)
httpd.serve_forever()
