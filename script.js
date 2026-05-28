const heatmapData = [
  {
    strike: '1.0800',
    call: 92,
    put: 25
  },
  {
    strike: '1.0825',
    call: 78,
    put: 30
  },
  {
    strike: '1.0850',
    call: 66,
    put: 48
  },
  {
    strike: '1.0875',
    call: 48,
    put: 58
  },
  {
    strike: '1.0900',
    call: 35,
    put: 86
  },
  {
    strike: '1.0925',
    call: 22,
    put: 94
  }
];

const heatmapRows = document.getElementById('heatmapRows');

let totalCall = 0;
let totalPut = 0;

heatmapData.forEach(data => {

  totalCall += data.call;
  totalPut += data.put;

  const row = document.createElement('div');
  row.classList.add('heatmap-row');

  row.innerHTML = `

    <div class="strike">
      ${data.strike}
    </div>

    <div class="bar call-bar">
      <div class="fill-call" style="width:${data.call}%"></div>
    </div>

    <div class="bar put-bar">
      <div class="fill-put" style="width:${data.put}%"></div>
    </div>

  `;

  heatmapRows.appendChild(row);
});


document.getElementById('callVolume').innerText = totalCall + 'K';
document.getElementById('putVolume').innerText = totalPut + 'K';


function randomPrice(){

  const base = 1.0870;
  const random = (Math.random() * 0.006).toFixed(4);

  return (base + Number(random)).toFixed(4);
}

setInterval(() => {

  document.getElementById('livePrice').innerText = randomPrice();

},2000);
