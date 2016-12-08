var view = {};

view.showMinutes = function () {
    $('.billMinutes')
        .text(bill.minutes.usage)
        .parent()
        .fadeIn();

    $('.billMinutesType')
        .text(bill.minutes.plan.size)
        .fadeIn();

    $('.billMinutesTotal')
        .text('$ ' + bill.minutes.plan.price.toFixed(2))
        .fadeIn();

    if (bill.minutes.plan.size === 'XL+') {
        var row1 = [
            '<span class="hidden">',
                bill.minutes.overage.usage,
                ' minutes of calls beyond XL+',
            '</span>'
        ].join('');

        var row2 = [
            '<span class="hidden">',
                '$' + bill.minutes.overage.price.toFixed(2),
            '</span>'
        ].join('');

        $('.extrasRow .description')
            .append(row1).hide().fadeIn();
        $('.extrasRow .colTotal')
            .append(row2).hide().fadeIn();
    }

    if (bill.international.usage > 0) {
        var row1 = [
            '<span>',
                bill.international.usage,
                ' minutes of international calling',
            '</span>'
        ].join('');

        var row2 = [
            '<span>',
                '$' + bill.international.total.toFixed(2),
            '</span>'
        ].join('');

        $('.extrasRow .description')
            .append(row1).hide().fadeIn();

        $('.extrasRow .colTotal')
            .append(row2).hide().fadeIn();
    }
};

view.showMegabytes = function () {
    $('.billMegabytes')
        .text(bill.megabytes.usage)
        .parent()
        .fadeIn();

    $('.billMegabytesType')
        .text(bill.megabytes.plan.size)
        .fadeIn();

    $('.billMegabytesTotal')
        .text('$ ' + bill.megabytes.plan.price.toFixed(2))
        .fadeIn();

    if (bill.megabytes.plan.size === 'XL+') {
        var row1 = [
            '<span class="hidden">',
                bill.megabytes.overage.usage,
                ' MB of data beyond XL+',
            '</span>'
        ].join('');

        var row2 = [
            '<span class="hidden">',
                '$' + bill.megabytes.overage.price.toFixed(2),
            '</span>'
        ].join('');

        $('.extrasRow .description')
            .append(row1).hide().fadeIn();
        $('.extrasRow .colTotal')
            .append(row2).hide().fadeIn();
    }
};

view.showMessages = function () {
    $('.billMessages')
        .text(bill.messages.usage)
        .parent()
        .fadeIn();

    $('.billMessagesType')
        .text(bill.messages.plan.size)
        .fadeIn();

    $('.billMessagesTotal')
        .text('$ ' + bill.messages.plan.price.toFixed(2))
        .fadeIn();

    if (bill.messages.plan.size === 'XL+') {
        var row1 = [
            '<span class="hidden">',
                bill.messages.overage.usage,
                ' messages beyond XL+',
            '</span>'
        ].join('');

        var row2 = [
            '<span class="hidden">',
                '$' + bill.messages.overage.price.toFixed(2),
            '</span>'
        ].join('');

        $('.extrasRow .description')
            .append(row1).hide().fadeIn();
        $('.extrasRow .colTotal')
            .append(row2).hide().fadeIn();
    }
};

view.hideFileUploader = function () {
    $('.input_box').slideUp();
};

view.getDeviceCharge = function () {
    return $('#additional_charge').val() !== '' ? +$('#additional_charge').val() : 0;
};

view.getFees = function () {
    return +$('#ting_fees').val()
};

view.displayTotal = function () {
    $('.totalTotal').append('<strong>' + bill.total.plan.toFixed(2) + '</strong><strong>' + bill.total.taxes.toFixed(2) + '</strong><strong>' + (bill.total.plan + bill.total.taxes).toFixed(2) + '</strong>');
};

view.splitTable = function () {
    var phoneLabel;

    _.each(phoneNumbers, function (phoneNumber) {
        if (phoneNumber.nickname !== '') {
            phoneLabel = phoneNumber.nickname + ' (' + phoneNumber.number + ')';
        } else {
            phoneLabel = phoneNumber.number;
        }

        var row = [
            '<tr>',
                '<td>',
                    phoneLabel,
                '</td>',
                '<td>',
                    phoneNumber.minutes,
                '</td>',
                '<td>',
                    phoneNumber.messages,
                '</td>',
                '<td>',
                    phoneNumber.megabytes.toFixed(1),
                '</td>',
                '<td>',
                    '$' + calculator.calcPersonalBill(phoneNumber),
                '</td>',
            '</tr>'
        ].join('');

        $('#numbersFinalBillTotal tbody').append(row);

    });

    $('.billSplit-container').fadeIn();

    $("html, body").animate({ 
        scrollTop: $(document).height() 
    }, "slow");

    return false;
};

view.resetView = function () {
    $('.billColumn.type span').text('');
    $('.billColumn.description > span').fadeOut();
    $('#additional_charge').val('');
    $('#ting_fees').val('');
    $('.billColumn.totalTotal').html('');
    $('#numbersFinalBillTotal tbody').html('');
    $('.billSplit-container').fadeOut();
    $('.billRow.extrasRow .colTotal').html('');
    $('.billColumn .billTotal').fadeOut();

    $("#bills_files").replaceWith($("#bills_files").val('').clone(true));

    $('.input_box').slideDown();
};