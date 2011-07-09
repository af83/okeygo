#!/usr/bin/env sh
# http://www.sencha.com/learn/Tutorial:PropertyGrid_with_JsonStore

file="public/js/songs.json"
song_path='public/songs'

lists=`ls $song_path`
firstline='';

echo '{"data":[' > $file
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
	url=$(find $song_path/$line -type f -iname "*.mp3" | sed -e "s|public/||")
	echo ', "url":"'$url'"' >> $file

    lyrics=$(find $song_path/$line -type f -iname "*.txt" | sed -e "s|public/||")
	echo ', "lyrics":"'$lyrics'"' >> $file

    img=$(find $song_path/$line -type f -iname "*.jpg" -exec du -sk {} \; |
    sort -nr | head -n1 | awk '{print $2}' | sed -e "s|public/||")
    if [ -z "$img" ]; then
        echo ', "img":"images/cover_fallback.jpg"' >> $file
    else
        echo ', "img":"'$img'"' >> $file
    fi
    echo '}' >> $file
done
echo ']}' >> $file
