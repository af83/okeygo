# OKEYGO, by af83!

You need a webkit browser.
Serve public/ directory with the webserver of your choice:

    cd public/

    thin -A file start

or

    python -m SimpleHTTPServer 3000

Generate the list with:

    ./scripts/songs_lists.sh

Goto http://localhost:3000/index.html
