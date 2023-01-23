tps://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=AMZN&interval=5min&apikey=TTCY25MVPCB3LIJV
console.log("hey")
let timeFrame = null;
function searchInputFunc(e){
   console.log(e)
   
}
 function loadFunc(){
  if(window.localStorage.length == 0){
		//alert("NULLLLLLL");
	}else{
		for(let items=0; items<window.localStorage.length; items++){
			// lclStorageData=window.localStorage.getItem("stock"+(items+1));
      // let watchListArea = document.getElementsByClassName("stockArea")[0]
			// watchListArea.insertBefore( lclStorageData, lclStorageData.firstChild);
		}
	}
 }
 //document.getElementById("inputSearchBox").addEventListener("keypress",(evt)=>searchInput(evt));
 let timesOut;
 function searchInput(){
  document.getElementById("spanForSearchItmes").style.display="block";
  let keyword = document.getElementById("inputSearchBox").value;
  
  let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+keyword+"&apikey=TTCY25MVPCB3LIJV";
clearTimeout(timesOut);
  timesOut = setTimeout(()=>{
        const searchApi = fetch(url).then((resonse)=>resonse.json()).then(
          (data)=>{
            if(Object.keys(data)[0] != "Information" && Object.keys(data)[0] != "Note" && Object.keys(data)[0] != "Error Message"){
            showsSearchBarItmes(data);
            }else{
              
            }
          }
        )
  },300)
 }

 let searchBest10Result = [];
 function showsSearchBarItmes(data){
  document.getElementById("spanForSearchItmes").innerHTML="";

         searchBest10Result = Object.values(data)[0];
        searchBest10Result.map((result, index)=>{
          document.getElementById("spanForSearchItmes").innerHTML += "<li key={"+index+"} >"+result['1. symbol']+"</li>";

        })
        var listData = document.getElementById('spanForSearchItmes');
        listData.onclick = function(event) {
           document.getElementById("inputSearchBox").value=event.target.innerHTML;
           document.getElementById("spanForSearchItmes").style.display="none";
               };  
 }



function ClickTimeSeries(evt, timeframes) {
    document.getElementById("INTRADAY").style.backgroundColor="gray";
    document.getElementById("DAILY").style.backgroundColor="gray";
    document.getElementById("WEEKLY").style.backgroundColor="gray";
    document.getElementById("MONTHLY").style.backgroundColor="gray";

    
    document.getElementById(timeframes).style.backgroundColor="red";
    timeFrame = timeframes;
  }

  function submitSearchFunc(){
    
    let searchVal = document.getElementById("inputSearchBox").value;

    if(searchVal != "" && timeFrame != null){
        
       let url = "https://www.alphavantage.co/query?function=TIME_SERIES_"+timeFrame+"&symbol="+searchVal+"&interval="+5+"min&apikey=TTCY25MVPCB3LIJV";
        const data = fetch(url).then((resonse)=>resonse.json())
        .then((data)=>{

          //console.log(data);
          fetchApiData(data,searchVal,timeFrame);
        })
    }else if(searchVal == "" && timeFrame != null){
           alert("Please enter Symbol....");
    }else if(searchVal != "" && timeFrame == null){
      alert("Please Select Time Frame....");
    }else{
      alert("Please Enter Symbol and select Time Frame....");
    }
  document.getElementById("spanForSearchItmes").style.display="none";
}

let stockBoxId =1;
function fetchApiData(data,searchVal,timeFrame){
  //console.log(Object.keys(data)[1]);
if(Object.keys(data)[0] != "Information" && Object.keys(data)[0] != "Note"){
  let timeFramesKey = Object.keys(data)[1];
  let watchListArea = document.getElementsByClassName("stockArea")[0];
         // console.log(watchListArea);
         let watchBlokArea = createBoxwithTable(stockBoxId, data, searchVal, timeFrame, timeFramesKey);
         watchListArea.insertBefore( watchBlokArea, watchListArea.firstChild);
         //localStorage.setItem("stock"+stockBoxId, watchBlokArea.outerHTML);
         stockBoxId++;
}else{
  alert(Object.values(data)[0]);
}
}
let  hashStocks = [];
function createBoxwithTable(stockBoxId, data, searchVal, timeFrame, timeFramesKey){
  let stock = document.createElement("p");
  stock.append(createStockBox(stockBoxId, data, searchVal, timeFrame, timeFramesKey));
  stock.append(createTableStock(stockBoxId, data, searchVal, timeFrame, timeFramesKey));
  stock.setAttribute("class","stockListClass");
  stock.setAttribute("id","stockBoxFull"+stockBoxId);
  stock.addEventListener("click",stockBtnClickHandler)

  hashStocks.push({symbol : searchVal, domStock :stock});
 
  return stock;
}

function stockBtnClickHandler(evt){
  
  let stkId = evt.target.id.slice(5);
  if(document.getElementById("stockTable"+stkId) != null){
  if(document.getElementById("stockTable"+stkId).style.display == "block"){
    document.getElementById("stockTable"+stkId).style.display = "none";
  }else{
    document.getElementById("stockTable"+stkId).style.display = "block";
  }

}
}

function createStockBox(stockBoxId, data, searchVal, timeFrame, timeFramesKey){
       // console.log(Object.values(data));
      // console.log(timeFramesKey)
      let stockRateOpen = Object.values(data[timeFramesKey])[0]['1. open'];
      

         let stockBox = document.createElement("p");
          stockBox.setAttribute("class","BtnWatchList");
          stockBox.setAttribute("id","stock"+stockBoxId);
          
         let spanSymbolTxt = document.createElement("span");
           spanSymbolTxt.setAttribute("class","symbolTxt");
         //spanSymbolTxt.innerText=data['Meta Data']['2. Symbol'];
           spanSymbolTxt.innerText=searchVal;
           stockBox.append(spanSymbolTxt);
  
        let spanStockRate = document.createElement("span");
           spanStockRate.setAttribute("class","rateWatchListBox");
           spanStockRate.innerText=(Math.round(stockRateOpen * 100) / 100).toFixed(2);
           stockBox.append(spanStockRate);

        let stockBtnTimeFrame = document.createElement("button");
          stockBtnTimeFrame.setAttribute("class","stockBtnArea");
          stockBtnTimeFrame.innerText=timeFrame; 
          stockBox.append(stockBtnTimeFrame);

        let stockCloseBtn = document.createElement("button");
          stockCloseBtn.setAttribute("class","closeIconeBtn");
          
          stockCloseBtn.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i>`;
          stockCloseBtn.addEventListener("click",function (evt){
                 let rmvDivId = evt.path[2].id.slice(5);
                 document.getElementById("stockBoxFull"+rmvDivId).remove();
                 hashStocks= hashStocks.filter((elemt)=> elemt.domStock.id !== "stockBoxFull"+rmvDivId);
                 
          });
          stockBox.append(stockCloseBtn);
         
          

          return stockBox;
        //watchListArea.append(stockBox);
}



function createTableStock(stockBoxId, data, searchVal, timeFrame, timeFramesKey){
  
  
  //console.log(Object.values(data['Time Series (5min)'])[0]);
   let stockTable = document.createElement("p");
   stockTable.setAttribute("class","tableStockArea");
   stockTable.setAttribute("id","stockTable"+stockBoxId);

  // console.log(Object.keys(data['Time Series (5min)']));

  
    let dateOfStock = Object.keys(data[timeFramesKey])[0].split(" ");
  
   let tableBox = document.createElement("table");
    tableBox.style.borderSpacing = "12px 0px";
   
   var row = tableBox.insertRow(-1);
 
   var headerTable = document.createElement("TH");
   headerTable.style.fontSize = "12px";

   headerTable.innerHTML = dateOfStock[0];
   row.appendChild(headerTable);   

   headerTable = document.createElement("TH");
   headerTable.innerHTML = "OPEN";
    row.appendChild(headerTable);
 
    headerTable = document.createElement("TH");
    headerTable.innerHTML = "HIGH";
    row.appendChild(headerTable);
     
    headerTable = document.createElement("TH");
    headerTable.innerHTML = "LOW";
    row.appendChild(headerTable);

    headerTable = document.createElement("TH");
    headerTable.innerHTML = "CLOSE";
    row.appendChild(headerTable);

    headerTable = document.createElement("TH");
    headerTable.innerHTML = "VOLUME";
    row.appendChild(headerTable);
   //console.log(Object.values(data['Time Series (5min)'])[0]);

    for (var i = 0; i < 5; i++) {
    // console.log(i);
      var row = tableBox.insertRow(-1);

      //Add the data cells.
      var cell = row.insertCell(-1);
      if(timeFramesKey === "Time Series (5min)"){
      cell.innerHTML = Object.keys(data[timeFramesKey])[i].split(" ")[1];
      }else{
        cell.innerHTML = Object.keys(data[timeFramesKey])[i];
      }
      cell = row.insertCell(-1);
      cell.innerHTML = fixValue(Object.values(data[timeFramesKey])[i]["1. open"]);

      cell = row.insertCell(-1);
      cell.innerHTML = fixValue(Object.values(data[timeFramesKey])[i]["2. high"]);

      cell = row.insertCell(-1);
      cell.innerHTML = fixValue(Object.values(data[timeFramesKey])[i]["3. low"]);

      cell = row.insertCell(-1);
      cell.innerHTML = fixValue(Object.values(data[timeFramesKey])[i]["4. close"]);

      cell = row.insertCell(-1);
      cell.innerHTML = Object.values(data[timeFramesKey])[i]["5. volume"];
     }

     stockTable.appendChild(tableBox);
    return stockTable;
}

function fixValue(d){
   return (Math.round(d * 100) / 100).toFixed(2);
}

let searchStockTimer;
function searchStocks(){
  let srchStocks = document.getElementById("searchTxtStocks").value;
  
clearTimeout(searchStockTimer);
searchStockTimer = setTimeout(()=>{
        filterDoms(hashStocks, srchStocks);
        
  },1500)
}

function filterDoms(hashStocks, srchStocks){
  let countDoms =0;

      document.querySelectorAll(".stockArea")[0].innerHTML = "";
          hashStocks.map((elemt, index)=>{
            if(elemt.symbol == srchStocks){
              document.querySelectorAll(".stockArea")[0].insertBefore(elemt.domStock, document.querySelectorAll(".stockArea")[0].firstChild);
              countDoms++;
            }
          })
          
          if(countDoms==0){
            hashStocks.map((elemt, index)=>{
            document.querySelectorAll(".stockArea")[0].insertBefore(elemt.domStock, document.querySelectorAll(".stockArea")[0].firstChild);
            }
            )
          }
}
