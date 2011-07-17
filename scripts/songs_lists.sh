#!/usr/bin/env sh

## Generate songs.json for okeygo
## aptitude install perl vim ffmpeg2theora imagemagick
##
## This script comes with ABSOLUTELY NO WARRANTY; for details see COPYING.
## This is free software, and you are welcome to redistribute it
## under certain conditions; see COPYING for details.

set -e

DESCRIPTION="Generate songs.json for okeygo"

SONGS_PATH=public/songs
JSON=public/js/songs.json
COVER_FALLBACK=images/cover_fallback.jpg

usage() {
    echo ${DESCRIPTION}
    echo "Usage: $(basename $0) [--help] [songs_path] [songs.json]"
    echo "Default songs_path: ${SONGS_PATH}, json: ${JSON}"
    exit
}

CGI_escape() {
    STRING="${1}"
    perl -MCGI -e \ 'print CGI->escape(@ARGV), "\n"' "${STRING}"
}

Remove_public() {
    STRING="${1}"
    VALUE=$(echo ${STRING} | sed -e 's|public/||')
    echo ${VALUE}
}

Space_to_undercore() {
    STRING="${1}"
    VALUE=$(echo ${STRING} | tr " " "_")
    echo ${VALUE}
}

Add_covers_to_json() {
    COVER="${1}"
    JSON="${2}"
    IMG_PREFIX=$(basename "${COVER}" ".jpg")
    IMG_THUMB="$(dirname ${COVER})/${IMG_PREFIX}_50.jpg"
    if [ ! -f ${IMG_THUMB} ]; then
        echo " >>> thumb does not exist create it with imagemagick"
        convert ${COVER} -gravity center -resize 50x50 ${IMG_THUMB}
    fi
    echo ', "img":"'$(Remove_public "${COVER}")'"' >> ${JSON}
    echo ', "thumb":"'$(Remove_public ${IMG_THUMB})'"' >> ${JSON}
}

if [ "$1" = "--help" ]; then
    usage
fi

if [ -n "$1" ]; then
    SONGS_PATH=$1
fi
if [ -n "$2" ]; then
    JSON=$2
fi

if $(which wget > /dev/null 2>/dev/null) ; then
  DOWNLOAD_CMD="wget -O"
elif $(which curl > /dev/null 2>/dev/null) ; then
  DOWNLOAD_CMD="curl -o"
else
  echo " >>> error: install either wget or curl."
  exit 1
fi

echo ${DESCRIPTION}
echo "Starting with songs_path: ${SONGS_PATH} and json: ${JSON}"

# space 2 underscore
find ${SONGS_PATH} -name "* *" | nl -ba | sort -nr | cut -f2 > ${SONGS_PATH}/tmp.txt
while read iline; do
    predicate=$(echo $iline | awk -F "/" '{  print $NF }')
    predicate=$(Space_to_undercore "${predicate}")
    mv "$iline" "$(dirname "$iline")/$predicate"
done < ${SONGS_PATH}/tmp.txt
rm ${SONGS_PATH}/tmp.txt

LYRICS_LISTS=$(find ${SONGS_PATH} -iname "*.txt" -type f)
JSON_FIRSTLINE=""

echo '{"data":[' > ${JSON}
for TXT in ${LYRICS_LISTS}; do
    # convert \r\n --> \n
    if $(file "${TXT}" | grep CRLF) ; then
        echo " >>> converting from CRLF to LF"
        sed -i 's/\x0D$//' ${TXT}
    fi
    # utf-8 file
    if $(file "${TXT}" | grep -q ISO); then
        echo " >>> the files is not UTF-8"
        vim +'set encoding=utf-8' +'set fileencoding=utf-8' \
            +'write ++enc=utf-8' +'quit' "${TXT}"
    fi

    # Pre requirement
    ARTIST=`grep     "#ARTIST:"     "${TXT}" | cut -d : -f 2`
    TITLE=`grep      "#TITLE:"      "${TXT}" | cut -d : -f 2`
    BPM=`grep        "#BPM:"        "${TXT}" | cut -d : -f 2`

    if [ "x${ARTIST}" = "x" -o "x${TITLE}" = "x" -o "x${BPM}" = "x" ] ; then
        echo " >>> error: this does not seem to ba a valid ultrastar file."
        exit 1
    fi

    # comma not for the first line
    if [ -z ${JSON_FIRSTLINE} ]; then
        JSON_FIRSTLINE='xxx'
    else
        echo -n ',' >> ${JSON}
    fi

    echo '{"artist":"'$ARTIST'", "title":"'$TITLE'"' >> ${JSON}
    echo ', "lyrics":"'$(Remove_public ${TXT})'"' >> ${JSON}

    LYRICS_DIR=$(dirname ${TXT})

    # Song files
    MP3=$(find ${LYRICS_DIR} -type f -iname "*.mp3")
    MP3_PREFIX=$(basename "${MP3}" ".mp3")
    OGG=$(find ${LYRICS_DIR} -type f -iname "*.ogg")
    if [ ! -f ${OGG} ]; then
        echo " >>> warning: ogg does not exist create it with ffmpeg2theora"
        OGG_OUTFILE="${LYRICS_DIR}/${MP3_PREFIX}.ogg"
        ffmpeg2theora ${MP3} -o ${OGG_OUTFILE}
        OGG=${OGG_OUTFILE}
    fi
    echo ', "url":"'$(Remove_public "${OGG}")'"' >> ${JSON}

    # Cover, get the most big jpg
    COVER=$(find ${LYRICS_DIR} -type f -iname "*.jpg" -exec du -sk {} \; | 
    sort -nr | head -n1 | awk '{print $2}')
    if [ ! -f "${COVER}" ]; then
        ESCAPED=$(CGI_escape "\"${ARTIST}\" \"${TITLE}\" cover")
        GG_IMAGES="http://images.google.com/images?q=$ESCAPED"
        echo " >>> Please look for the cover here, or press return to skip"
        echo " >>> ${GG_IMAGES}"
        read COVER_URL
        if [ -z "${COVER_URL}" ] ; then
            echo " >>> skipping use fallback"
            echo ', "img":"'${COVER_FALLBACK}'"' >> ${JSON}
        else
            echo " >>> downloading image ..."
            COVER="${LYRICS_DIR}/$(Space_to_undercore "${ARTIST} - ${TITLE}").jpg"
            $DOWNLOAD_CMD "${COVER}" "$COVER_URL"
            Add_covers_to_json "${COVER}" "${JSON}"
        fi
    else
        Add_covers_to_json "${COVER}" "${JSON}"
    fi
    echo '}' >> ${JSON}
done
echo ']}' >> ${JSON}

echo "Done."
