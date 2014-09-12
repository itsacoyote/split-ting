 $(document).ready(function() {
    phoneNumbers = {};
    billTotal = {};
    usageArray = {};
    billTotalInitiate();
    firstUsageInitiate();
    if(isAPIAvailable()) {
      $('#minutes_file').bind('change', function(evt){
        handleFile(evt, 'Minutes');
      });
      $('#messages_file').bind('change', function(evt){
        handleFile(evt, 'Messages');
      });
      $('#megabytes_file').bind('change', function(evt){
        handleFile(evt, 'Megabytes');
      });

      $('#calculate_button').bind('click', function(evt){
        calculateBill();
      });

    }
  });
  
  function billTotalInitiate() {
    billTotal['minutes'] = 0;
    billTotal['messages'] = 0;
    billTotal['megabytes'] = 0;
    billTotal['minutesTotal'] = 0;
    billTotal['messagesTotal'] = 0;
    billTotal['megabytesTotal'] = 0;
  }
  
  function firstUsageInitiate(){
    usageArray['firstMinute'] = Date.parse(new Date());
    usageArray['firstMessage'] = Date.parse(new Date());
    usageArray['firstMegabyte'] = Date.parse(new Date());
    firstUsage = Date.parse(new Date());
    newRates = Date.parse("February 04, 2014");
  }
  
  function earliestUsage(){
    for (i in usageArray) {
        if(usageArray[i] < firstUsage) {
          firstUsage = usageArray[i];
        }
    }
  }

  function isAPIAvailable() {
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
  }

  function handleFile(evt, filetype) {
    var filetype = filetype;
    var files = evt.target.files;
    var file = files[0];
    if (file.name.indexOf(filetype.toLowerCase()) >= 0) {
      switch(filetype) {
        case 'Minutes':
          calculateMinutes(file);
        break;
        case 'Messages':
          calculateMessages(file);
        break;
        case 'Megabytes':
          calculateMegabytes(file);
        break;
      }
    } else {
      Alert('Incorrect file uploaded for ' + filetype);
    }
  }

  function calculateMinutes(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);

      $.each(data, function (index) {
        if(index > 0) {
          if(index == 1) {
            if(data[index][0] != ""){usageArray['firstMinute'] = Date.parse(data[index][0])};
          }
          var number = data[index][4];
          if(typeof(number) !== 'undefined' && data[index][7] != '8558464389') {
            if (number in phoneNumbers && "minutes" in phoneNumbers[number]) {
              phoneNumbers[number]['minutes'] = phoneNumbers[number]['minutes'] + parseInt(data[index][11]);
            } else {
              if (typeof(phoneNumbers[number]) === 'undefined') {
                phoneNumbers[number] = {}; 
              }
              phoneNumbers[number]['minutes'] = parseInt(data[index][11]);
            }
          }
        }
      });

      calculateInitialPlans();
    }
  }

  function calculateMessages(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);

      $.each(data, function (index) {
        if(index > 0) {
          if(index == 1) {
            if(data[index][0] != ""){usageArray['firstMessage'] = Date.parse(data[index][0])};
          }
          var number = data[index][2];
          if(typeof(number) !== 'undefined') {
            if (number in phoneNumbers && "messages" in phoneNumbers[number]) {
              phoneNumbers[number]['messages'] += 1;
            } else {
              if (typeof(phoneNumbers[number]) === 'undefined') {
                phoneNumbers[number] = {}; 
              }
              phoneNumbers[number]['messages'] = parseInt(1);
            }
          }
        }
      });

      calculateInitialPlans();
    }
  }

  function calculateMegabytes(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);

      $.each(data, function (index) {
        if(index > 0) {
          if(index == 1) {
            if(data[index][0] != ""){usageArray['firstMegabyte'] = Date.parse(data[index][0])};
          }        
          var number = data[index][1];
          if(typeof(number) !== 'undefined') {
            if (number in phoneNumbers && "megabytes" in phoneNumbers[number]) {
              phoneNumbers[number]['megabytes'] = phoneNumbers[number]['megabytes'] + parseFloat(data[index][3]/1024);
            } else {
              if (typeof(phoneNumbers[number]) === 'undefined') {
                phoneNumbers[number] = {}; 
              }
              phoneNumbers[number]['megabytes'] = parseFloat(data[index][3]/1024);
            }
          }
        }
      });
      
      for (number in phoneNumbers) {
        phoneNumbers[number]['megabytes'] = Math.round((phoneNumbers[number]['megabytes'] * 10))/10;
      }

      
      calculateInitialPlans();
    }
  }
  
  function calculateInitialPlans() {
    for (number in phoneNumbers) {
      if(typeof(number) === 'undefined') {
        phoneNumbers[number] = {};
      }
      //Check minutes
      if (!('minutes' in phoneNumbers[number])) {
       phoneNumbers[number]['minutes'] = parseInt(0);
      }
      //Check messages
      if (!('messages' in phoneNumbers[number])) {
       phoneNumbers[number]['messages'] = parseInt(0);
      }
      
      //Check megabytes
      if (!('megabytes' in phoneNumbers[number])) {
       phoneNumbers[number]['megabytes'] = parseFloat(0);
      }
    }
    
    var minutesTotal = 0,
        messagesTotal = 0,
        megabytesTotal = 0;
    for (number in phoneNumbers) {
      minutesTotal += parseInt(phoneNumbers[number]['minutes']); 
      messagesTotal += parseInt(phoneNumbers[number]['messages']); 
      megabytesTotal += parseFloat(phoneNumbers[number]['megabytes']); 
    }
    
    earliestUsage();
    
    billTotal['megabytes'] = Math.ceil(Math.round((megabytesTotal * 100)/100));
    billTotal['messages'] = messagesTotal;
    billTotal['minutes'] = minutesTotal;
    updateMegabytesMessage(billTotal['megabytes']);
    updateMessagesMessage(billTotal['messages']);
    updateMinutesMessage(billTotal['minutes']);
    
    
  }

  function updateMinutesMessage(total) {
    $('table#minutes_total > thead:last').html('<tr><th><strong>Total Minutes</strong></th><th>' + total + '</th></tr>');
    var html = '';
    for (var number in phoneNumbers) {
      html += '<tr><td>' + number + '</td><td>' + phoneNumbers[number]['minutes'] + '</td></tr>';
    }
    $('table#minutes_total > tbody:last').html(html);
    $('table#minutes_total').show();
    
    if (billTotal['minutes'] > 0) {
       updateMinutesBilling(); 
    }
  }
  
  function updateMessagesMessage(total) {
    $('table#messages_total > thead:last').html('<tr><th><strong>Total Messages</strong></th><th>' + total + '</th></tr>');
    var html = '';
    for (var number in phoneNumbers) {
      html += '<tr><td>' + number + '</td><td>' + phoneNumbers[number]['messages'] + '</td></tr>';
    }
    $('table#messages_total > tbody:last').html(html);
    $('table#messages_total').show();
    
    if (billTotal['messages'] > 0) {
       updateMessagesBilling(); 
    }
  }
  
  function updateMegabytesMessage(total) {
    $('table#megabytes_total > thead:last').html('<tr><th><strong>Total Megabytes</strong></th><th>' + total + '</th></tr>');
    var html = '';
    for (var number in phoneNumbers) {
      html += '<tr><td>' + number + '</td><td>' + Math.round(phoneNumbers[number]['megabytes']) + '</td></tr>';
    }
    $('table#megabytes_total > tbody:last').html(html);
    $('table#megabytes_total').show();
    
    if (billTotal['megabytes'] > 0) {
      updateMegabytesBilling();
    }
  }
  
  function updateMinutesBilling() {
    var extraMinutesPrice = 0,
        extraMinutes = 0,
        minutesPrice = 0,
        planType = '',
        minutesTotal = billTotal['minutes'],
        overageMinutes = 0;
    
    if (firstUsage >= newRates){
        if (billTotal['minutes'] > 0 && billTotal['minutes'] < 106) {
          minutesPrice = 3;
          planType = 'Small';
        } else if (billTotal['minutes'] > 105 && billTotal['minutes'] < 526 ) {
          minutesPrice = 9;
          planType = 'Medium';
        } else if (billTotal['minutes'] > 525 && billTotal['minutes'] < 1051) {
          minutesPrice = 18;
          planType = 'Large';
        } else if (billTotal['minutes'] > 1050 && billTotal['minutes'] < 2101) {
          minutesPrice = 35;
          planType = 'XL';
        } else {
          minutesPrice = 35;
          planType = 'XXL';
          extraMinutes = billTotal['minutes'] - 2100;
          console.log('Extra Minutes: ' + extraMinutes);
          extraMinutesPrice = extraMinutes * .019;
          extraMinutesPrice = Math.round((extraMinutesPrice * 100))/100;
          console.log('Extra Minutes Price: ' + extraMinutesPrice);
          minutesTotal = 2100;
          overageMinutes = parseInt(billTotal['minutes']) - parseInt(2100);
        }    
    }
    else {    
        if (billTotal['minutes'] > 0 && billTotal['minutes'] < 106) {
          minutesPrice = 3;
          planType = 'Small';
        } else if (billTotal['minutes'] > 105 && billTotal['minutes'] < 526 ) {
          minutesPrice = 9;
          planType = 'Medium';
        } else if (billTotal['minutes'] > 525 && billTotal['minutes'] < 1051) {
          minutesPrice = 18;
          planType = 'Large';
        } else if (billTotal['minutes'] > 1050 && billTotal['minutes'] < 2101) {
          minutesPrice = 35;
          planType = 'XL';
        } else if (billTotal['minutes'] > 2100 && billTotal['minutes'] < 3001 ) {
          minutesPrice = 52;
          planType = 'XXL';
        } else {
          minutesPrice = 52;
          planType = 'XXL';
          extraMinutes = billTotal['minutes'] - 3000;
          console.log('Extra Minutes: ' + extraMinutes);
          extraMinutesPrice = extraMinutes * .02;
          extraMinutesPrice = Math.round((extraMinutesPrice * 100))/100;
          console.log('Extra Minutes Price: ' + extraMinutesPrice);
          minutesTotal = 3000;
          overageMinutes = parseInt(billTotal['minutes']) - parseInt(3000);
        }
    }    
    $('span.billMinutes').html(minutesTotal + ' minutes');
    $('span.billMinutesType').html(planType);
    if (overageMinutes > 0) {
      console.log('overage');
      $('span.overageBillMinutes').html(overageMinutes + ' mins of calls beyond XXL <span class="billTotal">$' + extraMinutesPrice + '</span>');
    }
    $('span.billMinutesTotal').html('$' + minutesPrice);
    billTotal['minutesTotal'] = parseFloat(minutesPrice) + parseFloat(extraMinutesPrice);
    console.log(billTotal['minutesTotal']);
  }
  
  function updateMessagesBilling() {
    console.log('updateMessagesBilling');
    var extraMessagesPrice = 0,
        extraMessages = 0,
        messagesPrice = 0,
        planType = ''
        messagesTotal = billTotal['messages'],
        overageMessages = 0;

    if (firstUsage >= newRates) {
        if (billTotal['messages'] > 0 && billTotal['messages'] < 106) {
          messagesPrice = 3;
          planType = 'Small';
        } else if (billTotal['messages'] > 105 && billTotal['messages'] < 1051) {
          messagesPrice = 5;
          planType = 'Medium';
        } else if (billTotal['messages'] > 1050 && billTotal['messages'] < 2101) {
          messagesPrice = 8;
          planType = 'Large';
        } else if (billTotal['messages'] > 2100 && billTotal['messages'] < 4801) {
          messagesPrice = 11;
          planType = 'XL';
        } else {
          messagesPrice = 11;
          planType = 'XXL';
          extraMessages = parseFloat(billTotal['messages']) - parseFloat(4800);
          console.log('Extra Messages: ' + extraMessages);
          extraMessagesPrice = extraMessages * .0025;
          extraMessagesPrice = Math.round((extraMessagesPrice * 100))/100;
          console.log('Extra Messages Price: ' + extraMessagesPrice);
          overageMessages = parseInt(billTotal['messages']) - parseInt(4800);
        }
    } else {
        if (billTotal['messages'] > 0 && billTotal['messages'] < 106) {
          messagesPrice = 3;
          planType = 'Small';
        } else if (billTotal['messages'] > 105 && billTotal['messages'] < 1051) {
          messagesPrice = 5;
          planType = 'Medium';
        } else if (billTotal['messages'] > 1050 && billTotal['messages'] < 2101) {
          messagesPrice = 8;
          planType = 'Large';
        } else if (billTotal['messages'] > 2100 && billTotal['messages'] < 4201) {
          messagesPrice = 11;
          planType = 'XL';
        } else if (billTotal['messages'] > 4200 && billTotal['messages'] < 6001) {
          messagesPrice = 14;
          planType = 'XXL';
        } else {
          messagesPrice = 14;
          planType = 'XXL';
          extraMessages = parseFloat(billTotal['messages']) - parseFloat(6000);
          console.log('Extra Messages: ' + extraMessages);
          extraMessagesPrice = extraMessages * .0025;
          extraMessagesPrice = Math.round((extraMessagesPrice * 100))/100;
          console.log('Extra Messages Price: ' + extraMessagesPrice);
          overageMessages = parseInt(billTotal['messages']) - parseInt(6000);
        }
    }
        
    $('span.billMessages').html(messagesTotal + ' messages');
    $('span.billMessagesType').html(planType);
    if (overageMessages > 0) {
      $('span.overageBillMessages').html(overageMessages + ' of messages beyond XXL <span class="billTotal">$' + extraMessagesPrice + '</span>');
    }
    $('span.billMessagesTotal').html('$' + messagesPrice);
    billTotal['messagesTotal'] = parseFloat(messagesPrice) + parseFloat(extraMessagesPrice);
    console.log(billTotal['messagesTotal']);
  }
  
  function updateMegabytesBilling() {
    var extraMegabytesPrice = 0,
        extraMegabytes = 0,
        megabytesPrice = 0,
        planType = '',
        megabytesTotal = billTotal['megabytes'],
        overageMegabytes = 0;

    if (firstUsage >= newRates){
        if (billTotal['megabytes'] > 0 && billTotal['megabytes'] < 106) {
          megabytesPrice = 3;
          planType = 'Small';
        } else if (billTotal['megabytes'] > 105 && billTotal['megabytes'] < 526 ) {
          megabytesPrice = 12;
          planType = 'Medium';
        } else if (billTotal['megabytes'] > 525 && billTotal['megabytes'] < 1051) {
          megabytesPrice = 19;
          planType = 'Large';
        } else if (billTotal['megabytes'] > 1050 && billTotal['megabytes'] < 2001) {
          megabytesPrice = 29;
          planType = 'XL';
        } else {
          megabytesPrice = 29;
          planType = 'XXL';
          extraMegabytes = parseFloat(billTotal['megabytes']) - parseFloat(2000);
          console.log('Extra Megabytes: ' + extraMegabytes);
          extraMegabytesPrice = extraMegabytes * .015;
          extraMegabytesPrice = Math.round((extraMegabytesPrice * 100))/100;
          megabytesTotal = 2000;
          overageMegabytes = parseInt(billTotal['megabytes']) - parseInt(2000);
          console.log('Extra Megabytes Price: ' + extraMegabytesPrice);
        }    
    } else {        
        if (billTotal['megabytes'] > 0 && billTotal['megabytes'] < 106) {
          megabytesPrice = 3;
          planType = 'Small';
        } else if (billTotal['megabytes'] > 105 && billTotal['megabytes'] < 526 ) {
          megabytesPrice = 13;
          planType = 'Medium';
        } else if (billTotal['megabytes'] > 525 && billTotal['megabytes'] < 1051) {
          megabytesPrice = 24;
          planType = 'Large';
        } else if (billTotal['megabytes'] > 1050 && billTotal['megabytes'] < 2101) {
          megabytesPrice = 42;
          planType = 'XL';
        } else if (billTotal['megabytes'] > 2100 && billTotal['megabytes'] < 3001) {
          megabytesPrice = 60;
          planType = 'XXL';
        } else {
          megabytesPrice = 60;
          planType = 'XXL';
          extraMegabytes = parseFloat(billTotal['megabytes']) - parseFloat(3000);
          console.log('Extra Megabytes: ' + extraMegabytes);
          extraMegabytesPrice = extraMegabytes * .0225;
          extraMegabytesPrice = Math.round((extraMegabytesPrice * 100))/100;
          megabytesTotal = 3000;
          overageMegabytes = parseInt(billTotal['megabytes']) - parseInt(3000);
          console.log('Extra Megabytes Price: ' + extraMegabytesPrice);
        }
    }
    
    $('span.billMegabytes').html(megabytesTotal + ' megabytes');
    $('span.billMegabytesType').html(planType);
    if (overageMegabytes > 0) {
      $('span.overageBillMegabytes').html(overageMegabytes + ' of megabytes beyond XXL <span class="billTotal">$' + extraMegabytesPrice + '</span>');
    }
    var finalPrice = parseInt(megabytesPrice) + parseInt(extraMegabytesPrice);
    $('span.billMegabytesTotal').html('$' + megabytesPrice);
    billTotal['megabytesTotal'] = parseFloat(megabytesPrice) + parseFloat(extraMegabytesPrice);
    console.log(billTotal['megabytesTotal']);
  }
  
  function calculateBill() {
    var count = 0;
    for (number in phoneNumbers){
      count += 1;
    }
    
    var splitFees = 0,
        fees = 0;
    if ($('#tax_fees').val() != '') {
      var fees = $('#tax_fees').val();
      splitFees = fees/count;
    }
    var additionalFee = 0,
        splitAdditionalFees = 0;
    if ($('#additional_charge').val() != '') {
      additionalFee = $('#additional_charge').val();
      splitAdditionalFees = additionalFee/count;
      console.log('Additional Fee: ' + additionalFee + 'SplitFee: ' + splitAdditionalFees);
    }
    
    var finalBillTotal = 0;
    finalBillTotal = parseFloat(billTotal['minutesTotal']) + parseFloat(billTotal['messagesTotal']) + parseFloat(billTotal['megabytesTotal']) + parseFloat(fees) + parseFloat(additionalFee);
    var finalHtml = '<tr><th>Final Bill Total</th><th>' + (Math.round(finalBillTotal * 100)/100) + '</th></tr>'; 
    $('table#numbersFinalBillTotal > thead:last').replaceWith(finalHtml);
    $('table#numbersFinalBillTotal > tbody').html('');
    for (number in phoneNumbers) {
      var numbersMinutesBill = 0,
          numbersMessagesBill = 0,
          numbersMegabytesBill = 0;
      
	if(billTotal['minutes']>0) {
      numbersMinutesBill = (phoneNumbers[number]['minutes'] / billTotal['minutes']) * billTotal['minutesTotal'];
	} else {
	  numbersMinutesBill = 0;
	}
	if(billTotal['messages']>0) {
      numbersMessagesBill = (phoneNumbers[number]['messages'] / billTotal['messages']) * billTotal['messagesTotal'];
	} else {
	  numbersMessagesBill = 0;
	}
    if(billTotal['megabytes']>0) {
      numbersMegabytesBill = (phoneNumbers[number]['megabytes'] / billTotal['megabytes']) * billTotal['megabytesTotal'];
    } else {
      numbersMegabytesBill = 0;
    }
    
    phoneNumbers[number]['totalBill'] = parseFloat(numbersMinutesBill) + parseFloat(numbersMessagesBill) + parseFloat(numbersMegabytesBill);
      
      var html = '';
      var numberTotal = parseFloat(phoneNumbers[number]['totalBill']) + parseFloat(splitFees) + parseFloat(splitAdditionalFees);
      numberTotal = Math.round((numberTotal * 100))/100;
      html += '<tr><td>' + number + '</td><td>' + numberTotal + '</td></tr>';
      
      $('table#numbersFinalBillTotal > tbody:last').append(html);
      $('#finalBillTotalContainer').show();
    }
  }
