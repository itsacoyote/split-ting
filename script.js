var splitTing = new SplitTing();
var bill = new Bill();
var calculator = new Calculator();

var phoneNumbers = {};

if (splitTing.isAPIAvailable()) {
    $('#bills_files').bind('change', function (evt) {
        splitTing.handleFile(evt);
    });

    $('#calculate_button').bind('click', function (evt) {
        splitTing.calculateBill();
    });

    $('#reset_button').bind('click', function () {
        splitTing = new SplitTing();
        bill = new Bill();
        calculator = new Calculator();
        phoneNumbers = {};

        view.resetView();
    });

}
