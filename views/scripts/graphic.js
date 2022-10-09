const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let stock = urlParams.get('stock');

async function getDatafromBack() {
    try{
        /*const {response} = await fetch(`https://api.hgbrasil.com/finance/stock_price?key=4c08cc1b&symbol=${stock}`);
        const stockinfo = await response.json();*/
        const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${stock.toUpperCase()}&token=ccovb1aad3i91ts8clbgccovb1aad3i91ts8clc0`);
        const stockinfo = await response.json();
        console.log(stockinfo)

        
        show(stockinfo);

    }catch(error){
      console.log(error)
    }
    
}
  getDatafromBack()

async function show(stockinfo) {

  if(stockinfo.name === undefined) {
    document.getElementById("stock-gaphic").innerHTML =  `<H1>We dont found stock "${stock}" on our database!</h1><BR><img src="data:image/jpeg;base64,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">`;
  } else{
    let info = {
      exchange: stockinfo.exchange,
      name: stockinfo.name,
      Industry: stockinfo.finnhubIndustry,
      marketcap: stockinfo.marketCapitalization,
      logo: stockinfo.logo,
      weburl: stockinfo.weburl
    }
    
        document.getElementById("stock_name").innerHTML = info.name;
        document.getElementById("stock-info").innerHTML = `
        <h2Stock Information:><br>
        <img src="${info.logo}">
        <li>Company name: ${info.name}</li>
        <li>Exchange: ${info.exchange}</li>
        <li>Industry: ${info.Industry}</li>
        <li>Market Cap: $${info.marketcap}</li>
        <li><a href="${info.weburl}">${info.weburl}</a></li>
        `;
  
  
      try {
          
          const prices_response = await fetch(`http://api.marketstack.com/v1/eod?access_key=7dc51b06faef0fe69367b530877e64ea&symbols=${stock.toUpperCase()}`);
          const prices = await prices_response.json();
  
          var daysInformation = {
            date10: prices.data[0],
            date9: prices.data[1],
            date8: prices.data[2],
            date7: prices.data[3],
            date6: prices.data[4],
            date5: prices.data[5],
            date4: prices.data[6],
            date3: prices.data[7],
            date2: prices.data[8],
            date1: prices.data[9]
          }
          
          var pregao = {
              price1: daysInformation.date1.close,
              price2: daysInformation.date2.close,
              price3: daysInformation.date3.close,
              price4: daysInformation.date4.close,
              price5: daysInformation.date5.close,
              price6: daysInformation.date6.close,
              price7: daysInformation.date7.close,
              price8: daysInformation.date8.close,
              price9: daysInformation.date9.close,
              price10: daysInformation.date10.close
          }
  
      } catch (error) {
          console.log(error)
      }
  
      const labels = [
          daysInformation.date1.date.substring(0,10),
          daysInformation.date2.date.substring(0,10),
          daysInformation.date3.date.substring(0,10),
          daysInformation.date4.date.substring(0,10),
          daysInformation.date5.date.substring(0,10),
          daysInformation.date6.date.substring(0,10),
          daysInformation.date7.date.substring(0,10),
          daysInformation.date8.date.substring(0,10),
          daysInformation.date9.date.substring(0,10),
          daysInformation.date10.date.substring(0,10)
        ];
  
      
        const data = {
          labels: labels,
          datasets: [{
            label: info.name + `'s Last 9 Operation Days Graphic: `,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [pregao.price1, pregao.price2, pregao.price3, pregao.price4, pregao.price5, pregao.price6,
              pregao.price7, pregao.price8, pregao.price9, pregao.price10],
          }]
            
        };
      
        const config = {
          type: 'line',
          data: data,
          options: {}
        };
      
        const myChart = new Chart(
          document.getElementById('myChart'),
          config
        );
  }

  
}


 