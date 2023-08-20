class Widget {}

type WidgetFactory = () => Widget;

function makeWidget(): Widget {
    return new Widget();
}

function singletonDecorator(factory: WidgetFactory): WidgetFactory {
    let instance: Widget;
    return (): Widget => {
        if (!instance) {
            instance = factory();
        }
        return instance;
    };
}
