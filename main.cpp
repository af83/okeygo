#include <QtGui/QApplication>
#include <QtWebKit/QWebView>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    a.setApplicationName("Web");
    QWebView view;
    view.settings()->setAttribute(QWebSettings::LocalContentCanAccessRemoteUrls, true);
    view.load(QUrl("qrc:/public/index.html"));
    view.show();
    return a.exec();
}
