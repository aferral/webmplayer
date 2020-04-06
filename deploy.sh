source venv/bin/activate 
source env/default_env.sh 



cd src/js

> env.js
echo "var env = {" >> env.js
echo "  API_URL: '$dist_url'," >> env.js
echo "}" >> env.js
echo "module.exports = env;" >> env.js
cd ..
cd ..


npm run dist



python run_server.py $host $port


