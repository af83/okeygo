#!/usr/bin/env sh
# http://www.sencha.com/learn/Tutorial:PropertyGrid_with_JsonStore

file="public/js/songs.json"
echo '{"data":[' > $file
lists=`ls public/songs`
firstline='';
for line in $lists; do
	## artist extract
	artist=$(echo $line | cut -d"-" -f1 | tr "_" " " | sed -e 's/ $//')
	## song extract
	song=$(echo $line | cut -d"-" -f2 | tr "_" " " | sed -e 's/^ //')
	# comma not for the first line
	if [ -z $firstline ]; then
		firstline='xxx'
	else
		echo -n ',' >> $file 
	fi
	echo '{"artist":"'$artist'", "song":"'$song'"' >> $file
	echo ', "url":"songs/'$line'/'$line'.mp3"' >> $file
	echo ', "lyrics":"songs/'$line'/'$line'.txt"}' >> $file
done
echo ']}' >> $file
