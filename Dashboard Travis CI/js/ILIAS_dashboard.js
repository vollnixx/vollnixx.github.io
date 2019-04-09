SimpleILIASDashboard = (function () {
  'use strict';

  let pub = {}, pro = {}, pri = {
    danger_span               : '<span class="badge badge-pill badge-danger">Danger</span>',
    success_span              : '<span class="badge badge-pill badge-success">Success</span>',
    background_colors_success : "['#D8EBD2', '#92C780', '#BBDCAF', '#74B85D', '#99B85D']",
    background_colors_fail    : "['#fa6553', '#e20201', '#f33a2f', '#C7372B', '#99372B']",
    html_snippets : {
      card_header             : '.card-header h6',
      phpunit_date_class      : '.phpunit_date',
      phpunit_state_html      : '<p class="mr-2"><i class="fas fa-circle',
      dicto_state_html        : '<span class=""><a class="badge badge-pill',
      card_header_html_begin  : '<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">'
    }
  };

  pub.createPHPUnitWidget = function (url, version, job_id, id, title, warn, skip, incomp, risky, fail, failure, date) {
    let failed = '';

    if (failure === "true") {
      failed = '-warning';
    }

    return '<a href="' + url + '" class="col-xl-4 col-lg-5" target="_blank"> ' +
            ' <div class="col-xl-12">' +
              ' <div class="card shadow mb-4" id="' + version + '_' + id + '_card">' +
                pri.html_snippets.card_header_html_begin +
                ' <h5>' + title + '</h6>' + '<h7>' + job_id + '</h7>' +
              ' </div>' +
              ' <div class="card-body phpunit">' +
                ' <div class="row hidden">' +
                  ' <div class="col-md-7">' +
                    ' <div class="chart-pie pt-6 pb-2">' +
                      ' <canvas id="' + version + '_' + id + '"></canvas>' +
                    ' </div>' +
                  ' </div>' +
                  ' <div class="col-md-5">' +
                    ' <div class="mt-4 text-left small ">' +
                      pri.html_snippets.phpunit_state_html + ' text-warnings'   + failed + '"></i> ' + warn + ' Warnings </p>' +
                      pri.html_snippets.phpunit_state_html + ' text-skipped'    + failed + '"></i> ' + skip + ' Skipped </p>' +
                      pri.html_snippets.phpunit_state_html + ' text-incomplete' + failed + '"></i> ' + incomp + ' Incomplete </p>' +
                      pri.html_snippets.phpunit_state_html + ' custom-risky'    + failed + '"></i> ' + risky + ' Risky </p>' +
                      pri.html_snippets.phpunit_state_html + ' text-failed'     + failed + '"></i> ' + fail + ' Failed </p>' +
                    ' </div>' + 
                  ' </div>' +
                ' </div>'+
              ' </div><span class="date_footer small">' + date + '</span>' +
            ' </div>' + 
          ' </div>' +
        ' </a>' ;
  }

    pub.createDictoWidget = function (date, job_id, url, jf, total, resolved, added) {

    if(jf > 0) {
      jf = '+' + jf;
    }

    let title  =  '<h6>Dicto ' + date + '</h6>' + '<a href=" ' + url + ' "><h6>' + job_id + '</h6></a>';
    let values =  pri.html_snippets.dicto_state_html + ' badge-warning mr-2" href="#">' + total + ' Total</a> </span>' +
                  pri.html_snippets.dicto_state_html + ' badge-success mr-2" href="#">' + resolved + ' Resolved</a> </span>' +
                  pri.html_snippets.dicto_state_html + ' badge-danger mr-2" href="#">'  + added + ' Added</a> </span>'; 

    if(jf !== "0"){
      title = 'Since last Jour fixe';
      values =  pri.html_snippets.dicto_state_html + ' badge-warning mr-2" href="#">' + jf + ' Total</a> </span>' +
                pri.html_snippets.dicto_state_html + ' badge-success mr-2" href="#">' + resolved + ' Resolved</a> </span>' +
                pri.html_snippets.dicto_state_html + ' badge-danger mr-2" href="#">'  + added + ' Added</a> </span>'; 
    } 

    return '<div class="col-xl-4 col-lg-4"> ' +
            '<div class="card shadow mb-4">' +
               pri.html_snippets.card_header_html_begin +
                title +
              '</div>' +
              '<div class="card-body d-flex justify-content-between">' + 
               values
              '</div>' +
            '</div>' +
          '</div>';
  };


 pub.initialiseGraph = function (card_id, card_object, failure, warn, skip, incomp, risky, failed, complete) {
   let card_cleaned_id = card_id.split("_card")[0];
   let backgroundColor = pri.background_colors_success;

   if (failure === "true") {
         backgroundColor = pri.background_colors_fail;
   }
 
    card_object.append( 
            '<script>'+
              '$( document ).ready(function() {' +
                'let ctx = document.getElementById("' + card_cleaned_id +'");'+
                'let myPieChart = new Chart(ctx, {'+
                  'type: "doughnut", data: '+
                    '{ '+
                      'labels: ["Warnings", "Skipped", "Incomplete", "Risky", "Failed"],'+
                      'datasets: ['+
                        '{data: [ '+ warn +', '+ skip +', '+ incomp + ', ' + risky + ' , ' + failed +'], '+
                          'backgroundColor: ' + backgroundColor + ',' + 
                          'hoverBackgroundColor: ["#ffa500","#ffa500","#ffa500","#ffa500"],'+
                          'hoverBorderColor: "rgba(234, 236, 244, 1)"'+
                          '}],'+
                        '},'+
                      'options: {'+
                            'elements: '+
                                  '{'+
                                    'center: {'+
                                          'text: "Tests: ' + complete + '",color: "#212529", fontStyle: "Helvetica", sidePadding: 20 '+
                                        '}'+
                                   '}, '+
                      'maintainAspectRatio: false,'+
                      'tooltips:'+
                        '{backgroundColor: "#0059ff",bodyFontColor:"#ffffff",borderColor: "#dddfeb",'+
                          'borderWidth: 1,xPadding: 15,yPadding: 15,displayColors: false,caretPadding: 10,'+
                          'bodyFontFamily: "sans-serif",},'+
                      'legend: {display: false},cutoutPercentage: 60,},'+
                    '});'+
                '});'+
            '</script>');

  };

  pub.replaceLoaderSymbolForPHPUnitCard = function (card_id, failure, warn, skip, incomp, risky, failed, complete) {
    let card_object = $('#' + card_id);

    if (failure === "true") {
      pro.addPHPUnitHeader(card_object, pri.danger_span);
    }
    else {
      pro.addPHPUnitHeader(card_object, pri.success_span);
    }

    card_object.find('.phpunit').removeClass('phpunit');
    card_object.find('.row').removeClass('hidden');
    pub.initialiseGraph(card_id, card_object, failure, warn, skip, incomp, risky, failed, complete);
  };

  pro.addPHPUnitHeader = function(card_object, state) {
    card_object.find(pri.html_snippets.card_header).html(
        card_object.find(pri.html_snippets.card_header).html() + state
      );
  };

  pro.compareByThird = function(first, second) {
    let left = first.split(',');
    let right = second.split(',');
    if (left[2] < right[2]) {
        return 1;
    } else if (left[2] > right[2] ){
        return -1;
    } else {
        return 0;
    }
  }

  pub.createPHPUnitWidgets = function (data) {
    let allRows = data.split(/\r?\n|\r/);

    allRows.sort(pro.compareByThird);

    $('.card-header').find('.badge-danger').remove();

    for (let singleRow = 0; singleRow < allRows.length; singleRow++) {
          let cells = allRows[singleRow].split(',');
          if(cells.length > 1) {
            let url       = cells[0], 
                job_id    = cells[1],
                version   = cells[2],
                id        = cells[3], 
                title     = cells[4], 
                warn      = cells[5], 
                skip      = cells[6], 
                incomp    = cells[7],
                complete  = cells[8], 
                failed    = cells[9], 
                risky     = cells[10], 
                failure   = cells[11],
                date      = cells[12];
            let version_string = 'ILIAS_' + version;
            console.log(cells)

        if( $('.phpunit_data').find('.' + version_string).length === 0) {
            let version_readable = version_string.replace(/_/g, ".");
            version_readable = version_readable.replace(/ILIAS\./g, "ILIAS ");
            $('.phpunit_data').append('<div class="' + version_string + ' col-md-12"><h5>' + version_readable + '</h5></div>')
        }
        $('.phpunit_data .' + version_string).append(pub.createPHPUnitWidget(url, version_string, job_id, id, title, warn, skip, incomp, risky, failed, failure, date));

        let interval = setInterval(function () {
          SimpleILIASDashboard.replaceLoaderSymbolForPHPUnitCard(version_string + '_' + id + "_card", failure, warn, skip, incomp, risky, failed, complete);
          
          clearInterval(interval);
        }, Math.random() * 1000);
      }
 
    }
  };

    pub.createDictoWidgets = function (data) {
      let allRows = data.split(/\r?\n|\r/);
   
      for ( let singleRow = 0; singleRow < allRows.length; singleRow++ ) {
            let cells = allRows[singleRow].split(',');

         if(cells.length > 1) {
            let  date     = cells[0], 
                 job_id   = cells[1],
                 url      = cells[2],
                 jf       = cells[3], 
                 total    = cells[4], 
                 resolved = cells[5], 
                 added    = cells[6];
      
            $('.dicto-data').append(pub.createDictoWidget(date, job_id, url, jf, total, resolved, added));
      }
    }
  };

  pub.anErrorOccured = function(){
    location.reload();
  };

  pub.getPHPUnitData = function () {
    let url = 'data/phpunit_latest.csv';
    let callback = pub.createPHPUnitWidgets;
    
    pro.getDataFile(url, callback);
  };

  pub.getDictoData = function () {
    let url = 'data/dicto_latest.csv';
    let callback = pub.createDictoWidgets;
  
    pro.getDataFile(url, callback);
  };

  pro.getDataFile = function(url, callback) {
    $.ajax({
      url:      url + '?' + new Date().getTime(),
      dataType: 'text',
    }).done(callback)
    .fail(function (jqXHR, textStatus, errorThrown) { setInterval(function () {
          pub.anErrorOccured();
      }, Math.random() * 5000); });
  };

  pub.appendChartJSExtensionForCenterText = function() {
       Chart.pluginService.register({
      beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
          //Get ctx from string
          let ctx = chart.chart.ctx;

          //Get options from the center object in options
          let centerConfig = chart.config.options.elements.center;
          let fontStyle = centerConfig.fontStyle || 'Arial';
          let txt = centerConfig.text;
          let color = centerConfig.color || '#000';
          let sidePadding = centerConfig.sidePadding || 20;
          let sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
            //Start with a base font of 30px
          ctx.font = "30px " + fontStyle;

          //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          let stringWidth = ctx.measureText(txt).width;
          let elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          let widthRatio = elementWidth / stringWidth;
          let newFontSize = Math.floor(30 * widthRatio);
          let elementHeight = (chart.innerRadius * 2);

          // Pick a new font size so it will not be larger than the height of label.
          let fontSizeToUse = Math.min(newFontSize, elementHeight);

          //Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          let centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          ctx.font = fontSizeToUse + "px " + fontStyle;
          ctx.fillStyle = color;

          //Draw text in center
          ctx.fillText(txt, centerX, centerY);
        }
      }
    });
  };


  return pub;
  
  }());

$( document ).ready(function() {
    $('.card-header').find('.badge-danger').remove();
    SimpleILIASDashboard.getPHPUnitData();
    SimpleILIASDashboard.getDictoData();
    SimpleILIASDashboard.appendChartJSExtensionForCenterText();
    $('body').scrollspy({ target: '#nav_list' });


});