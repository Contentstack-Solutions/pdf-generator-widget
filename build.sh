# build command format is
# sh build.sh

set -e
#The above command is to fail build if any one of the below build steps fail

rm -rf to-deploy
mkdir to-deploy

#API Build
if [ -d "api" ]
	then
		cd api
		rm -rf node_modules
		npm install --only=prod
		zip -r api.zip * -x package*.json server.js
		mv api.zip ../to-deploy
		cd ..
fi


#UI Build
if [ -d "ui" ]
	then
		cd ui
		rm -rf build
		rm -rf node_modules
		npm install
		npm run build
		zip -r ui.zip build/
		mv ui.zip ../to-deploy
		cd ..
fi
