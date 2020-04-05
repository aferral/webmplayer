set -e
npm install browserify
npm install exorcist


virtualenv -p python3.6 venv

git clone https://github.com/aferral/FUSE-virtual-music-library/ fuse_music

source venv/bin/activate
cd fuse_music && pip install -r req.txt


# test connection to create config
python -m test.test_service_conn
echo "NOW SET config.ini in fuse_music"
cd ..
