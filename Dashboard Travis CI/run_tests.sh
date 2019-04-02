#!/bin/bash
#produce data
#libs/composer/vendor/phpunit/phpunit/phpunit --bootstrap ./libs/composer/vendor/autoload.php --configuration ./Services/PHPUnit/config/PhpUnitConfig.xml --exclude-group needsInstalledILIAS --verbose $@ | tee /tmp/phpunit_results

#collect data
RESULT=`tail -n1 < /tmp/phpunit_results`
CSV_FILE="/tmp/phpunit_latest.csv"
CSV_TMP="/tmp/phpunit_changed.csv"
SPLIT_RESULT=(`echo $RESULT | tr ':' ' '`)
PHP_VERSION=`php -r "echo PHP_MAJOR_VERSION . '_' . PHP_MINOR_VERSION;"`
ILIAS_VERSION=`php -r "require_once 'include/inc.ilias_version.php'; echo ILIAS_VERSION_NUMERIC;"`
ILIAS_VERSION=`echo "$ILIAS_VERSION" | tr . _`
JOB_ID=`echo $TRAVIS_JOB_NUMBER`
JOB_URL=`echo $TRAVIS_JOB_WEB_URL`
FAILURE=false
declare -A RESULTS=([Tests]=0 [Assertions]=0 [Errors]=0 [Warnings]=0 [Skipped]=0 [Incomplete]=0);

for TYPE in "${!RESULTS[@]}"; 
	do 
		for PHP_UNIT_RESULT in "${!SPLIT_RESULT[@]}"; 
			do 
				if [ "$TYPE" == "${SPLIT_RESULT[$PHP_UNIT_RESULT]}" ]
					then
						CLEANED=(`echo ${SPLIT_RESULT[$PHP_UNIT_RESULT + 1]} | tr ',.' ' '`)
						RESULTS[$TYPE]=$CLEANED;
				fi
			done 
	done

if [ ${RESULTS[Errors]} > 0 ]
	then
		FAILURE=true
fi
# remove lines
grep -v "$ILIAS_VERSION.*php_$PHP_VERSION" $CSV_FILE > $CSV_TMP 
#write line
echo "$JOB_URL,$JOB_ID,$ILIAS_VERSION,php_$PHP_VERSION,PHP $PHP_VERSION,${RESULTS[Warnings]},${RESULTS[Skipped]},${RESULTS[Incomplete]},${RESULTS[Tests]},${RESULTS[Errors]},$FAILURE" >> "$CSV_TMP";
if [ -e "$CSV_TMP" ]
	then
		echo "exists"
		mv "$CSV_TMP" "$CSV_FILE"
fi