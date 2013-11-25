ko.observableArray.fn.refresh = function () {
    var data = this().slice(0);
    this([]);
    this(data);
};

ko.bindingHandlers.enter = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        ko.utils.registerEventHandler(element, 'keydown', function(evt) {
            if (evt.keyCode === 13) {
                evt.preventDefault();
                evt.target.blur();
                valueAccessor().call(viewModel);
            }
        });
    }
};