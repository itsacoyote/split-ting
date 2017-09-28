var splitTing = new SplitTing();
var bill = new Bill();
var calculator = new Calculator();

var phoneNumbers = {};

if (splitTing.isAPIAvailable()) {
    $('#bill-files').bind('change', function (evt) {
        splitTing.handleFile(evt);
    });

    $('#calculate-button').bind('click', function (evt) {
        splitTing.calculateBill();
    });

    $('#reset-button').bind('click', function () {
        splitTing = new SplitTing();
        bill = new Bill();
        calculator = new Calculator();
        phoneNumbers = {};

        view.resetView();
    });

}
