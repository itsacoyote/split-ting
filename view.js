var view = {};

view.showMinutes = function () {
    $('.billMinutes').text(bill.minutes.usage).parent().fadeIn();
    $('.billMinutesType').text(bill.minutes.plan.size).fadeIn();
    $('.billMinutesTotal').text('$ ' + bill.minutes.total.toFixed(2)).fadeIn();
};

view.showMegabytes = function () {
    $('.billMegabytes').text(bill.megabytes.usage).parent().fadeIn();
    $('.billMegabytesType').text(bill.megabytes.plan.size).fadeIn();
    $('.billMegabytesTotal').text('$ ' + bill.megabytes.total.toFixed(2)).fadeIn();
};

view.showMessages = function () {
    $('.billMessages').text(bill.messages.usage).parent().fadeIn();
    $('.billMessagesType').text(bill.messages.plan.size).fadeIn();
    $('.billMessagesTotal').text('$ ' + bill.messages.total.toFixed(2)).fadeIn();
};
