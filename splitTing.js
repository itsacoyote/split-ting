function SplitTing() {}

SplitTing.prototype.isAPIAvailable = function () {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        return true;
    } else {
        // source: File API availability - http://caniuse.com/#feat=fileapi
        // source: <output> availability - http://html5doctor.com/the-output-element/
        document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
        // 6.0 File API & 13.0 <output>
        document.writeln(' - Google Chrome: 13.0 or later<br />');
        // 3.6 File API & 6.0 <output>
        document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
        // 10.0 File API & 10.0 <output>
        document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
        // ? File API & 5.1 <output>
        document.writeln(' - Safari: Not supported<br />');
        // ? File API & 9.2 <output>
        document.writeln(' - Opera: Not supported');
        return false;
    }
};

SplitTing.prototype.buildUsers = function (file, type) {
    var number,
        nickname,
        fileReader = new FileReader();

    fileReader.readAsText(file);

    fileReader.onload = function (event) {
        var csv = event.target.result;
        var data = $.csv.toObjects(csv);

        _.each(data, function (row, index) {
            switch (type) {
                case 'minutes':
                case 'messages':
                    number = row['Phone'];
                    nickname = row['Nickname'];
                    break;
                case 'megabytes':
                    number = row['Device'];
                    nickname = row['Nickname'];
            }

            if (typeof (phoneNumbers[number]) === 'undefined') {
                phoneNumbers[number] = new PhoneNumber({
                    number: number,
                    nickname: nickname
                });
            }
        });
    };
};

SplitTing.prototype.handleFile = function (evt) {
    var files = evt.target.files;
    var fileCount = 0;

    _.each(files, function (file) {
        var filename = file.name.substring(0, 7);

        switch (filename) {
            case 'minutes':
                this.buildUsers(file, 'minutes');
                calculator.calcMinutes(file);
                fileCount++;
                break;
            case 'message':
                this.buildUsers(file, 'messages');
                calculator.calcMessages(file);
                fileCount++;
                break;
            case 'megabyt':
                this.buildUsers(file, 'megabytes');
                calculator.calcMegabytes(file);
                fileCount++;
                break;
            default:
                alert("Incorrect file uploaded!");
        }
    }, this);

    if (fileCount === 3) {
        view.hideFileUploader();
    }
};

SplitTing.prototype.calculateBill = function () {
    bill.setLines(view.getDeviceCharge());

    bill.total.taxes = view.getFees();

    bill.total.plan = bill.minutes.total + bill.messages.total + bill.megabytes.total + bill.deviceCharge + bill.international.total;

    view.displayTotal();
    view.splitTable();
};
