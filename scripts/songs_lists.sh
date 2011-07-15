#!/usr/bin/env sh
# aptitude install vim ffmpeg2theora

file="public/js/songs.json"
song_path='public/songs'

# space 2 underscore
find $song_path -name "* *" | nl -ba | sort -nr | cut -f2 > $song_path/tmp.txt
while read iline; do
    predicate=`echo $iline| awk -F "/" '{  print $NF }' | tr " " "_"`
    mv "$iline" "`dirname "$iline"`/$predicate"
done < $song_path/tmp.txt
rm $song_path/tmp.txt

lists=`find $song_path -iname "*.txt" -type f`
firstline='';

echo '{"data":[' > $file
for txt in $lists; do
    # convert \r\n --> \n
    if $(file "$txt" | grep CRLF) ; then
        echo " >>> converting from CRLF to LF"
        sed -i 's/\x0D$//' $txt
    fi

    if $(file "$txt" | grep -q ISO); then
        echo " >>> the files is not UTF-8"
        vim +'set encoding=utf-8' +'set fileencoding=utf-8' +'write ++enc=utf-8' +'quit' "$txt"
    fi

    ARTIST=`grep     "#ARTIST:"     "$txt" | cut -d : -f 2`
    TITLE=`grep      "#TITLE:"      "$txt" | cut -d : -f 2`
    BPM=`grep        "#BPM:"        "$txt" | cut -d : -f 2`

    if [ "x$ARTIST" = "x" -o "x$TITLE" = "x" -o "x$BPM" = "x" ] ; then
        echo " >>> error: this does not seem to ba a valid ultrastar file."
        exit 1
    fi

    # comma not for the first line
    if [ -z $firstline ]; then
        firstline='xxx'
    else
        echo -n ',' >> $file
    fi

    echo '{"artist":"'$ARTIST'", "song":"'$TITLE'"' >> $file
    mp3=$(find `dirname $txt` -type f -iname "*.mp3")
	mp3_prefix=`basename "$mp3" ".mp3"`
	ogg="$(dirname $txt)/${mp3_prefix}.ogg"
	if [ ! -f $ogg ]; then
        echo " >>> warning: ogg does not exist create it with ffmpeg2theora"
		ffmpeg2theora $mp3 -o $ogg
	fi
	ogg_path=$(echo $ogg | sed -e 's|public/||')
    echo ', "url":"'$ogg_path'"' >> $file

    lyrics=$(echo $txt | sed -e "s|public/||")
    echo ', "lyrics":"'$lyrics'"' >> $file

    img=$(find `dirname $txt` -type f -iname "*.jpg" -exec du -sk {} \; |
    sort -nr | head -n1 | awk '{print $2}' | sed -e "s|public/||")
    if [ -z "$img" ]; then
        echo ', "img":"images/cover_fallback.jpg"' >> $file
    else
        echo ', "img":"'$img'"' >> $file
    fi
    echo '}' >> $file
done
echo ']}' >> $file
