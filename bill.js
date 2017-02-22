function Bill() {
    this.deviceCharge = 0;

    this.total = {
        taxes: 0,
        plan: 0
    }

    this.minutes = {
        usage: 0,
        plan: {
            size: 'S',
            price: 0
        },
        overage: {
            usage: 0,
            price: 0
        },
        total: 0
    };
    this.messages = {
        usage: 0,
        plan: {
            size: 'S',
            price: 0
        },
        overage: {
            usage: 0,
            price: 0
        },
        total: 0
    };
    this.megabytes = {
        usage: 0,
        plan: {
            size: 'S',
            price: 0
        },
        overage: {
            usage: 0,
            price: 0
        },
        total: 0
    };

    this.kilobytes = 0;

    this.international = {
        usage: 0,
        total: 0
    };

    this.directoryAssistance = {
        usage: 0,
        total: 0
    };
}

Bill.prototype.setLines = function(lines) {
    this.deviceCharge = lines;
};

Bill.prototype.setMinutes = function (minutes) {
    var topPlan = tingPlans.minutes.levels[3];

    if (minutes > this.fivePercentEdge(topPlan)) {
        this.minutes.usage = topPlan;
        this.minutes.overage.usage = (minutes - topPlan);
    } else {
        this.minutes.usage = minutes;
    }

    this.calculateMinutes();
};

Bill.prototype.setMessages = function (messages) {
    var topPlan = tingPlans.messages.levels[3];

    if (messages > this.fivePercentEdge(topPlan)) {
        this.messages.usage = topPlan;
        this.messages.overage.usage = (messages - topPlan);
    } else {
        this.messages.usage = messages;
    }

    this.calculateMessages();
};

Bill.prototype.setMegabytes = function (kilobytes) {
    var topPlan = tingPlans.megabytes.levels[3];
    var megabytes = Math.ceil(kilobytes / 1024);
    this.kilobytes = kilobytes;

    if (megabytes > this.fivePercentEdge(topPlan)) {
        this.megabytes.usage = topPlan;
        this.megabytes.overage.usage = (megabytes - topPlan);
    } else {
        this.megabytes.usage = Math.ceil(megabytes);
    }

    this.calculateMegabytes();
};

Bill.prototype.calculateInternational = function (minutes, surcharge) {
    this.international.total += surcharge;
    this.international.usage += minutes;
};

Bill.prototype.calculateMinutes = function () {
    if (this.minutes.usage === 0) {
        this.minutes.plan.size = 'S';
        this.minutes.plan.price = 0;
    } else if (this.minutes.usage > 0 && this.minutes.overage.usage <= 0) {
        if (this.minutes.usage <= tingPlans.minutes.levels[0]) {
            this.minutes.plan.size = 'S';
            this.minutes.plan.price = tingPlans.minutes.plans['S'];
        } else if (this.minutes.usage <= this.fivePercentEdge(tingPlans.minutes.levels[1])) {
            this.minutes.plan.size = 'M';
            this.minutes.plan.price = tingPlans.minutes.plans['M'];
        } else if (this.minutes.usage <= this.fivePercentEdge(tingPlans.minutes.levels[2])) {
            this.minutes.plan.size = 'L';
            this.minutes.plan.price = tingPlans.minutes.plans['L'];
        } else if (this.minutes.usage <= this.fivePercentEdge(tingPlans.minutes.levels[3])) {
            this.minutes.plan.size = 'XL';
            this.minutes.plan.price = tingPlans.minutes.plans['XL'];
        }

    } else {
        this.minutes.plan.size = 'XL+';
        this.minutes.plan.price = tingPlans.minutes.plans['XL'];
        this.minutes.overage.price = (this.minutes.overage.usage * tingPlans.minutes.plans['XXL']);
    }

    this.minutes.total = this.minutes.plan.price + this.minutes.overage.price;

    view.showMinutes();
};

Bill.prototype.calculateMessages = function () {
    if (this.messages.usage === 0) {
        this.messages.plan.size = 'S';
        this.messages.plan.price = 0;
    } else if (this.messages.usage > 0 && this.messages.overage.usage <= 0) {
        if (this.messages.usage <= tingPlans.messages.levels[0]) {
            this.messages.plan.size = 'S';
            this.messages.plan.price = tingPlans.messages.plans['S'];
        } else if (this.messages.usage <= this.fivePercentEdge(tingPlans.messages.levels[1])) {
            this.messages.plan.size = 'M';
            this.messages.plan.price = tingPlans.messages.plans['M'];
        } else if (this.messages.usage <= this.fivePercentEdge(tingPlans.messages.levels[2])) {
            this.messages.plan.size = 'L';
            this.messages.plan.price = tingPlans.messages.plans['L'];
        } else if (this.messages.usage <= this.fivePercentEdge(tingPlans.messages.levels[3])) {
            this.messages.plan.size = 'XL';
            this.messages.plan.price = tingPlans.messages.plans['XL'];
        }

    } else {
        this.messages.plan.size = 'XL+';
        this.messages.plan.price = tingPlans.messages.plans['XL'];
        this.messages.overage.price = (this.messages.overage.usage * tingPlans.messages.plans['XXL']);
    }

    this.messages.total = this.messages.plan.price + this.messages.overage.price;

    view.showMessages();
};

Bill.prototype.calculateMegabytes = function () {
    if (this.megabytes.usage === 0) {
        this.megabytes.plan.size = 'S';
        this.megabytes.plan.price = 0;
    } else if (this.megabytes.usage > 0 && this.megabytes.overage.usage <= 0) {
        if (this.megabytes.usage <= tingPlans.megabytes.levels[0]) {
            this.megabytes.plan.size = 'S';
            this.megabytes.plan.price = tingPlans.megabytes.plans['S'];
        } else if (this.megabytes.usage <= this.fivePercentEdge(tingPlans.megabytes.levels[1])) {
            this.megabytes.plan.size = 'M';
            this.megabytes.plan.price = tingPlans.megabytes.plans['M'];
        } else if (this.megabytes.usage <= this.fivePercentEdge(tingPlans.megabytes.levels[2])) {
            this.megabytes.plan.size = 'L';
            this.megabytes.plan.price = tingPlans.megabytes.plans['L'];
        } else if (this.megabytes.usage <= this.fivePercentEdge(tingPlans.megabytes.levels[3])) {
            this.megabytes.plan.size = 'XL';
            this.megabytes.plan.price = tingPlans.megabytes.plans['XL'];
        }
    } else {
        this.megabytes.plan.size = 'XL+';
        this.megabytes.plan.price = tingPlans.megabytes.plans['XL'];
        var gigabytes = Math.ceil(this.megabytes.overage.usage / 1024);

        this.megabytes.overage.price = (gigabytes * tingPlans.megabytes.plans['XXL']);
    }

    this.megabytes.total = this.megabytes.plan.price + this.megabytes.overage.price;

    view.showMegabytes();
};

Bill.prototype.setDirectoryAssistance = function() {
    this.directoryAssistance.usage++;
    this.directoryAssistance.total++;
}

Bill.prototype.fivePercentEdge = function(limit) {
    var fivePercent = limit * 0.05;

    return limit + fivePercent;
};