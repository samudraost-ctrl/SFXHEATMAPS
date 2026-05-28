const marketData = {

  EURUSD: {
    price: 1.0874,
    strikes: [
      { strike:'1.0800', call:92, put:25 },
      { strike:'1.0825', call:78, put:30 },
      { strike:'1.0850', call:66, put:48 },
      { strike:'1.0875', call:48, put:58 },
      { strike:'1.0900', call:35, put:86 },
      { strike:'1.0925', call:22, put:94 }
    ]
  },

  GBPUSD: {
    price: 1.2742,
    strikes: [
      { strike:'1.2680', call:88, put:20 },
      { strike:'1.2700', call:74, put:42 },
      { strike:'1.2720', call:60, put:55 },
      { strike:'1.2740', call:46, put:70 },
      { strike:'1.2760', call:30, put:90 }
    ]
  },

  USDJPY: {
    price: 156.42,
    strikes: [
      { strike:'155.80', call:42, put:90 },
      { strike:'156.00', call:54, put:72 },
      { strike:'156.20', call:68, put:48 },
      { strike:'156.40', call:80, put:35 },
      { strike:'156.60', call:92, put:20 }
    ]
  },

  XAUUSD: {
    price: 2352.80,
    strikes: [
      { strike:'2330', call:96, put:18 },
      { strike:'2340', call:82, put:30 },
      { strike:'2350', call:68, put:52 },
      { strike:'2360', call:44, put:74 },
      { strike:'2370', call:26, put:96 }
    ]
  },

  BTCUSD: {
    price: 68420,
    strikes: [
      { strike:'67500', call:92, put:35 },
      { strike:'68000', call:80, put:48 },
      { strike:'68500', call:68, put:60 },
      { strike:'69000', call:48, put:82 },
      { strike:'69500', call:26, put:96 }
    ]
  }

};

const heatmapRows = document.getElementById('heatmapRows');

const pairCards = document.querySelectorAll('.pair-card');

let activePair = 'EURUSD';

function renderHeatmap(pair){

  const data = marketData[pair];

  heatmapRows.innerHTML = '';

  let totalCall = 0;
  let totalPut = 0;

  data.strikes.forEach(item => {

    totalCall += item.call;
    totalPut += item.put;

    const row = document.createElement('div');

    row.classList.add('heatmap-row');

    row.innerHTML = `

      <div class="strike">
        ${item.strike}
      </div>

      <div class="bar call-bar">
        <div class="fill-call"
        style="width:${item.call}%"></div>
      </div>

      <div class="bar put-bar">
        <div class="fill-put"
        style="width:${item.put}%"></div>
      </div>

    `;

    heatmapRows.appendChild(row);

  });

  document.getElementById('callVolume')
  .innerText = totalCall + 'K';

  document.getElementById('putVolume')
  .innerText = totalPut + 'K';

  document.getElementById('livePrice')
  .innerText = data.price;

  const sentiment =
  totalCall > totalPut
  ? 'Bullish'
  : 'Bearish';

  const sentimentEl =
  document.querySelector('.bullish');

  sentimentEl.innerText = sentiment;

  if(sentiment === 'Bullish'){
    sentimentEl.style.color = '#00ff95';
  } else {
    sentimentEl.style.color = '#ff3366';
  }

}

pairCards.forEach(card => {

  card.addEventListener('click', () => {

    pairCards.forEach(c => {
      c.classList.remove('active');
    });

    card.classList.add('active');

    activePair = card.innerText;

    renderHeatmap(activePair);

  });

});

renderHeatmap(activePair);

function updateRealtimeMarket(){

  const data = marketData[activePair];

  const randomMove =
  (Math.random() - 0.5) * 0.8;

  data.price =
  Number(data.price) + randomMove;

  if(activePair.includes('USD')
  && !activePair.includes('XAU')
  && !activePair.includes('BTC')){

    data.price = data.price.toFixed(4);

  } else {

    data.price = data.price.toFixed(2);

  }

  data.strikes.forEach(level => {

    level.call =
    Math.max(
      10,
      Math.min(
        100,
        level.call + (Math.random() * 12 - 6)
      )
    );

    level.put =
    Math.max(
      10,
      Math.min(
        100,
        level.put + (Math.random() * 12 - 6)
      )
    );

  });

  renderHeatmap(activePair);

}

setInterval(() => {

  updateRealtimeMarket();

}, 2500);
