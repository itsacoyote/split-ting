var view = {};

view.showMinutes = function () {
    $('.bill-minutes')
        .text(bill.minutes.usage)
        .parent()
        .fadeIn();

    $('.minutes-type')
        .text(bill.minutes.plan.size)
        .fadeIn();

    $('.minutes-total')
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

        $('.extras-row .description')
            .append(row1).hide().fadeIn();
        $('.extras-row .total')
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

        $('.extras-row .description')
            .append(row1).hide().fadeIn();

        $('.extras-row .total')
            .append(row2).hide().fadeIn();
    }
};

view.showMegabytes = function () {
    $('.bill-megabytes')
        .text(bill.megabytes.usage)
        .parent()
        .fadeIn();

    $('.megabytes-type')
        .text(bill.megabytes.plan.size)
        .fadeIn();

    $('.megabytes-total')
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

        $('.extras-row .description')
            .append(row1).hide().fadeIn();
        $('.extras-row .total')
            .append(row2).hide().fadeIn();
    }
};

view.showMessages = function () {
    $('.bill-messages')
        .text(bill.messages.usage)
        .parent()
        .fadeIn();

    $('.messages-type')
        .text(bill.messages.plan.size)
        .fadeIn();

    $('.messages-total')
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

        $('.extras-row .description')
            .append(row1).hide().fadeIn();
        $('.extras-row .total')
            .append(row2).hide().fadeIn();
    }
};

view.hideFileUploader = function () {
    $('.input-box').slideUp();
};

view.getDeviceCharge = function () {
    return $('#additional-charge').val() !== '' ? +$('#additional-charge').val() : 0;
};

view.getFees = function () {
    return +$('#ting-fees').val()
};

view.displayTotal = function () {
    $('.total-bill .total').append('<strong>' + bill.total.plan.toFixed(2) + '</strong><strong>' + bill.total.taxes.toFixed(2) + '</strong><strong>' + (bill.total.plan + bill.total.taxes).toFixed(2) + '</strong>');
};

view.splitTable = function () {
    var phoneLabel;

    _.each(phoneNumbers, function (phoneNumber) {
        if (phoneNumber.nickname !== '') {
            phoneLabel = phoneNumber.nickname + '<br>(' + phoneNumber.number + ')';
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

        $('#bill-split-table tbody').append(row);

    });

    $('.container.bill-split').fadeIn();

    $("html, body").animate({
        scrollTop: $(document).height()
    }, "slow");

    return false;
};

view.resetView = function () {
    $('.bill-row .type span').text('');
    $('.bill-row .description > span').fadeOut();
    $('#additional-charge').val('');
    $('#ting-fees').val('');
    $('.total-bill .total').html('');
    $('#bill-split-table tbody').html('');
    $('.container.bill-split').fadeOut();
    $('.extras-row .total').html('');
    $('.bill-row .total span.hidden').fadeOut();

    $("#bill-files").replaceWith($("#bill-files").val('').clone(true));

    $('.input-box').slideDown();
};