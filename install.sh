set -e
npm install


virtualenv -p python3.6 venv

git clone https://github.com/aferral/FUSE-virtual-music-library/commit/279a50ca65c88841578f861b09af76c6f980ae02 $MUSIC_LIBRARY_PATH

source venv/bin/activate
cd $MUSIC_LIBRARY_PATH && pip install -r req.txt


# test connection to create config
python -m test.test_service_conn
echo "NOW SET config.ini in fuse_music"
