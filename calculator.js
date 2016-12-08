function Calculator() {    
    this.tingNumber = '8558464389';
}

Calculator.prototype.calcMinutes = function calcMinutes(file) {
    var fileReader = new FileReader(),    
        self = this,
        minutes = 0;

    fileReader.readAsText(file);

    fileReader.onload = function (event) {
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);        

        _.each(data, function (row, index) {
            if (index > 0) {
                var number = data[index][3];
                var nickname = data[index][4];

                if (typeof (number) !== 'undefined' && 
                    (data[index][7] !== self.tingNumber || data[index][13] !== 'VM')) {
                    if (+data[index][12] > 0) {
                        bill.calculateInternational(+data[index][11], +data[index][12]);
                    }
                    minutes += +data[index][11];
                    phoneNumbers[number].minutes += +data[index][11];
                }
            }
        });

        bill.setMinutes(minutes);
    };
};

Calculator.prototype.calcMessages = function calcMessages(file) {
    var fileReader = new FileReader(),
        messages = 0;

    fileReader.readAsText(file);

    fileReader.onload = function (event) {
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);

        _.each(data, function (row, index) {
            if (index > 0) {
                var number = data[index][2];
                var nickname = data[index][3];

                if (typeof (number) !== 'undefined') {
                    messages += 1;
                    phoneNumbers[number].messages += 1;
                }
            }
        });

        bill.setMessages(messages);
    };
};

Calculator.prototype.calcMegabytes = function calcMegabytes(file) {
    var fileReader = new FileReader(),
        kilobytes = 0;
    
    fileReader.readAsText(file);

    fileReader.onload = function (event) {
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);

        _.each(data, function (row, index) {
            if (index > 0) {
                var number = data[index][1];
                var nickname = data[index][2];

                if (typeof (number) !== 'undefined') {
                    kilobytes += +data[index][4];                    
                }

                phoneNumbers[number].kilobytes = kilobytes;
            }
        });        

        bill.setMegabytes(kilobytes);
    };
};
