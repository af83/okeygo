#!/usr/bin/env sh
# http://www.sencha.com/learn/Tutorial:PropertyGrid_with_JsonStore

file="public/js/songs.json"
echo '{"data":[' > $file
lists=`ls public/songs`
firstline='';
for line in $lists; do
	artist=$(echo $line | cut -d"-" -f1 | tr "_" " ")
	song=$(echo $line | cut -d"-" -f2 | tr "_" " ")
	if [ -z $firstline ]; then
		firstline='xxx'
	else
		echo -n ',' >> $file 
	fi
	echo '{"artist":"'$artist'", "song":"'$song'"}' >> $file
done
echo ']}' >> $file
