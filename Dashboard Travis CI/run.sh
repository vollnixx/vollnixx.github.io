#!/bin/bash
DICTO_PATH="/tmp/dicto_latest.csv"
PHPUNIT_PATH="/tmp/phpunit_latest.csv"

DATE=`date '+%Y-%m-%d-%H:%M:%S'`
cp "$PHPUNIT_PATH" results/"phpunit_$TRAVIS_BUILD_NUMBER_$DATE.txt"
if [ -e "$PHPUNIT_PATH_TMP" ]
	then
		mv "$PHPUNIT_PATH_TMP" "data"
fi
if [ -e "$DICTO_PATH" ]
	then
		mv "$DICTO_PATH" "data"
fi
git add . && git commit -m "$TRAVIS_BUILD_NUMBER - $DATE - $TRAVIS_EVENT_TYPE"
git remote add results https://${VOLLNIXX_VAR}@github.com/vollnixx/vollnixx.github.io > /dev/null 2>&1
git push --quiet --set-upstream results master