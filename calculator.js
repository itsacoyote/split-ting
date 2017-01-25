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
            var surcharges = +row['Surcharges ($)'];
            var duration = +row['Duration (min)'];

            if (!row['Features'].includes('VM')) {
                if ( row['Partner\'s Phone'] !== self.tingNumber) {
                    if (surcharges > 0) {
                        phoneNumbers[number].international += surcharges;
                        bill.calculateInternational(duration, surcharges);
                    }
                    minutes += duration;
                    phoneNumbers[number].minutes += duration;
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
        var data = $.csv.toObjects(csv);

        _.each(data, function (row, index) {
            var number = row['Phone'];
            var nickname = row['Nickname'];
            
            messages++;
            phoneNumbers[number].messages++;
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
            var data = +row['Kilobytes'];

            kilobytes += data;

            phoneNumbers[number].kilobytes += data;
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
    var minutes = bill.minutes.total ? bill.minutes.total * percentMinutes : 0;
    var messages = bill.messages.total ? bill.messages.total * percentMessages : 0;
    var megabytes = bill.megabytes.total ? bill.megabytes.total * percentMegabytes : 0;
    var deviceCharge = bill.deviceCharge / _.size(phoneNumbers);

    var taxes = bill.total.taxes / _.size(phoneNumbers);

    return (minutes + messages + megabytes + taxes + deviceCharge + person.international).toFixed(3);
};
