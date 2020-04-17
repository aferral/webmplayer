import sys
import mimetypes
import os
import re
from io import BytesIO

from flask import request, send_file, Response
from flask import Flask

# import music app
path_downloader = 'fuse_music'
sys.path.append(os.path.abspath(path_downloader))
base_abs_path = os.path.abspath('./')
print(base_abs_path)
os.chdir(path_downloader)

import json
from data_manager import get_or_create_metadata_database
from drive_utils import download_and_decript,iter_file
backend_url = os.environ['dist_url']

app = Flask(__name__,static_folder=os.path.join(base_abs_path,'static'))
use_partial=False

@app.after_request
def after_request(response):
    if use_partial:
        response.headers.add('Accept-Ranges', 'bytes')
    return response

@app.route('/')
def serve_index():
    return send_file(os.path.join(base_abs_path,'index.html'))

@app.route('/list')
def list_music():
    # list music from drive
    x = get_or_create_metadata_database(verbose=False)
    vals = x.list(as_dict=True)
    response = app.response_class(
        response=json.dumps(vals),
        status=200,
        mimetype='application/json'
    )
    response.headers['Access-Control-Allow-Origin'] = backend_url
    return response


@app.route('/download/<id_to_play>')
def download_parcial(id_to_play):
    return Response(iter_file(id_to_play),mimetype='audio')


if __name__ == "__main__":
    host, port = sys.argv[1], int(sys.argv[2])
    print('Starting host: {0} port: {1}'.format(host, port))

    app.run(host=host, port=port)

