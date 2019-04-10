#!/bin/bash
DICTO_PATH="/tmp/dicto_latest.csv"
PHPUNIT_PATH="/tmp/phpunit_latest.csv"

DATE=`date '+%Y-%m-%d-%H:%M:%S'`
FOLDER_DATE=`date '+%Y-%m'`

if [ ! -d "results/$FOLDER_DATE"]
then
	mkdir "results/$FOLDER_DATE"
fi

if [ -e "$PHPUNIT_PATH" ]
then
	cp "$PHPUNIT_PATH" "results/$FOLDER_DATE/phpunit_$TRAVIS_BUILD_NUMBER_$DATE.txt"
fi

if [ -e "$DICTO_PATH" ]
then
	cp "$DICTO_PATH" "results/$FOLDER_DATE/dicto_$TRAVIS_BUILD_NUMBER_$DATE.txt"
fi

git add . && git commit -m "$TRAVIS_BUILD_NUMBER - $DATE - $TRAVIS_EVENT_TYPE"
git remote add results https://${VOLLNIXX_VAR}@github.com/vollnixx/vollnixx.github.io > /dev/null 2>&1
git push --quiet --set-upstream results master