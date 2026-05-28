const symbols = {

  EURUSD: "FX:EURUSD",
  GBPUSD: "FX:GBPUSD",
  USDJPY: "FX:USDJPY",
  AUDUSD: "FX:AUDUSD",
  NZDUSD: "FX:NZDUSD",
  USDCAD: "FX:USDCAD",
  USDCHF: "FX:USDCHF",

  EURJPY: "FX:EURJPY",
  GBPJPY: "FX:GBPJPY",
  AUDJPY: "FX:AUDJPY",

  XAUUSD: "OANDA:XAUUSD",
  XAGUSD: "OANDA:XAGUSD",

  BTCUSD: "BINANCE:BTCUSDT",
  ETHUSD: "BINANCE:ETHUSDT",
  SOLUSD: "BINANCE:SOLUSDT",
  XRPUSD: "BINANCE:XRPUSDT",

  NAS100: "FOREXCOM:NAS100",
  US30: "FOREXCOM:US30",
  SPX500: "FOREXCOM:SPX500"

};

const heatmapRows =
document.getElementById("heatmapRows");

const pairCards =
document.querySelectorAll(".pair-card");

let activePair = "EURUSD";

async function getRealtimePrice(symbol){

  try{

    const response = await fetch(
      "https://scanner.tradingview.com/global/scan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          symbols: {
            tickers: [symbol],
            query: { types: [] }
          },
          columns: [
            "close",
            "change",
            "volume"
          ]
        })
      }
    );

    const data = await response.json();

    return {
      price: data.data[0].d[0],
      change: data.data[0].d[1],
      volume: data.data[0].d[2]
    };

  }catch(error){

    console.log(error);

    return null;

  }

}

function generateHeatmap(price){

  const rows = [];

  let step;

  if(price > 50000){

    step = price * 0.003;

  }else if(price > 1000){

    step = price * 0.002;

  }else{

    step = price * 0.001;

  }

  for(let i = -4; i <= 4; i++){

    const strike = price + (i * step);

    rows.push({

      strike:
      price > 1000
      ? strike.toFixed(0)
      : strike.toFixed(4),

      call:
      Math.floor(
        Math.random() * 90 + 10
      ),

      put:
      Math.floor(
        Math.random() * 90 + 10
      )

    });

  }

  return rows;

}

function renderHeatmap(rows, market){

  heatmapRows.innerHTML = "";

  let totalCall = 0;
  let totalPut = 0;

  rows.forEach(level => {

    totalCall += level.call;
    totalPut += level.put;

    const row =
    document.createElement("div");

    row.classList.add("heatmap-row");

    row.innerHTML = `

      <div class="strike">
        ${level.strike}
      </div>

      <div class="bar call-bar">

        <div
        class="fill-call"
        style="width:${level.call}%">
        </div>

      </div>

      <div class="bar put-bar">

        <div
        class="fill-put"
        style="width:${level.put}%">
        </div>

      </div>

    `;

    heatmapRows.appendChild(row);

  });

  document.getElementById(
    "callVolume"
  ).innerText =
  totalCall.toFixed(0) + "K";

  document.getElementById(
    "putVolume"
  ).innerText =
  totalPut.toFixed(0) + "K";

  const livePrice =
  Number(market.price);

  if(livePrice > 1000){

    document.getElementById(
      "livePrice"
    ).innerText =
    livePrice.toFixed(2);

  }else{

    document.getElementById(
      "livePrice"
    ).innerText =
    livePrice.toFixed(4);

  }

  const sentiment =
  totalCall > totalPut
  ? "Bullish"
  : "Bearish";

  const sentimentEl =
  document.querySelector(".bullish");

  sentimentEl.innerText =
  sentiment;

  if(sentiment === "Bullish"){

    sentimentEl.style.color =
    "#00ff95";

  }else{

    sentimentEl.style.color =
    "#ff3366";

  }

}

async function updateMarket(){

  const symbol =
  symbols[activePair];

  const market =
  await getRealtimePrice(symbol);

  if(!market) return;

  const heatmap =
  generateHeatmap(
    Number(market.price)
  );

  renderHeatmap(
    heatmap,
    market
  );

}

pairCards.forEach(card => {

  card.addEventListener("click", () => {

    pairCards.forEach(c => {

      c.classList.remove("active");

    });

    card.classList.add("active");

    activePair =
    card.innerText;

    updateMarket();

  });

});

updateMarket();

setInterval(() => {

  updateMarket();

}, 5000);
