#-------------------------------------------------
#
# Project created by QtCreator 2011-06-18T13:04:32
#
#-------------------------------------------------

QT       += core gui webkit

TARGET = Web
TEMPLATE = app
target.path=/usr/local/bin
INSTALLS=target


SOURCES += main.cpp

HEADERS  +=

FORMS    += mainwindow.ui

OTHER_FILES += \
    public/index.html \
    public/css/sencha-touch.css \
    public/js/sencha-touch.js \
    public/js/index.js \
    public/media/sample.mp3

RESOURCES += \
    Resources.qrc
