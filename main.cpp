#include <QtGui/QApplication>
#include <QtWebKit/QWebView>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    QWebView view;
    view.load(QUrl("qrc:/public/index.html"));
    view.show();

    return a.exec();
}
