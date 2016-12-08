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
        var data = $.csv.toObjects(csv);        

        _.each(data, function (row, index) {
            var number = row['Phone'];
            var nickname = row['Nickname'];
            
            if ( row['Partner\'s Phone'] !== self.tingNumber || row['Features'] !== 'VM') {
                if (+row['Surcharges ($)'] > 0) {
                    bill.calculateInternational(+row['Duration (min)'], +row['Surcharges ($)']);
                }
                minutes += +row['Duration (min)'];
                phoneNumbers[number].minutes += +row['Duration (min)'];
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
        var data = $.csv.toObjects(csv);

        _.each(data, function (row, index) {
            var number = row['Phone'];
            var nickname = row['Nickname'];

            messages += 1;
            phoneNumbers[number].messages += 1;
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
        var data = $.csv.toObjects(csv);

        _.each(data, function (row, index) {
            var number = row['Device'];
            var nickname = row['Nickname'];

            kilobytes += +row['Kilobytes'];  

            phoneNumbers[number].kilobytes += +row['Kilobytes'];
        });        

        _.each(phoneNumbers, function(number) {
            number.megabytes = number.kilobytes / 1024;
        });

        bill.setMegabytes(kilobytes);
    };
};

Calculator.prototype.calcPersonalBill = function (person) {
    //determine the percent usage of user for each type
    var percentMinutes = person.minutes / (bill.minutes.usage + bill.minutes.overage.usage);

    var percentMessages = person.messages / (bill.messages.usage + bill.messages.overage.usage);

    var percentMegabytes = (person.kilobytes / bill.kilobytes);

    //calculate user's part of the bill
    var minutes = bill.minutes.total * percentMinutes;
    var messages = bill.messages.total * percentMessages;
    var megabytes = bill.megabytes.total * percentMegabytes;

    var taxes = bill.total.taxes / bill.lines;
    var deviceCharge = 6;

    return (minutes + messages + megabytes + taxes + deviceCharge).toFixed(3);
};
