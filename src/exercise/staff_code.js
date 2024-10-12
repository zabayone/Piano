var NotaDefinitiva;
document.addEventListener("DOMContentLoaded", function() {
    alert("Put your browser in full-screen mode to better enjoy the app (PRESS F11)")
    const svg = document.getElementById('pentagramma');
    let nota = null;
    let notaAccidentale = null;
    let bottonePremuto = false;
    let tagliAddizionaliPermanenti = []; // Array per memorizzare i tagli addizionali permanenti

    const noteMap = {
        10.5:'C6',
        23:'B5',
        35.5:'A5',
        48:'G5',
        60.5:'F5',
        73:'E5',
        85.5:'D5',
        98:'C5',
        110.5:'B4',
        123:'A4',
        135.5:'G4',
        148: 'F4', 
        160.5: 'E4', 
        173: 'D4', 
        185.5: 'C4',
        198: 'B3', 
        210.5: 'A3', 
        223: 'G3', 
        235.5: 'F3', 
        248: 'E3', 
        260.5: 'D3', 
        273: 'C3', 

    };



    function disegnaLinea(x1, y1, x2, y2, className = 'pentagramma') {
        const linea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        linea.setAttribute('x1', x1);
        linea.setAttribute('y1', y1);
        linea.setAttribute('x2', x2);
        linea.setAttribute('y2', y2);
        linea.classList.add(className);
        svg.appendChild(linea);
        return linea;
    }

    const startX = 50;
    const endX = 750;
    const startY = 148;
    const lineSpacing = 25;
    const positions = [];

    // Aggiungi le linee del pentagramma
    for (let i = 0; i < 5; i++) {
        const y = startY + i * lineSpacing;
        disegnaLinea(startX, y, endX, y);
        positions.push(y);
    }

    // Aggiungi posizioni intermedie sul pentagramma
    for (let i = 0; i < 4; i++) {
        const y = startY + i * lineSpacing + lineSpacing / 2;
        positions.push(y);
    }

    // Aggiungi posizioni dei tagli addizionali e intermedie sopra e sotto il pentagramma
    for (let i = 1; i <= 3; i++) {
        positions.unshift(startY - i * lineSpacing); // Above the staff
        positions.unshift(startY - i * lineSpacing + lineSpacing / 2); // Intermediate above
        positions.push(startY + 4 * lineSpacing + i * lineSpacing); // Below the staff
        positions.push(startY + 4 * lineSpacing + i * lineSpacing + lineSpacing / 2); // Intermediate below
    }

    function aggiungiNota(x, y) {

        document.getElementById('bemolleButton').style.backgroundColor = '#c8553d';
        document.getElementById('bemolleButton').style.borderColor = '#c8553d';
        document.getElementById('bemolleButton').style.borderStyle = 'outset';
        document.getElementById('diesisButton').style.backgroundColor = '#c8553d';
        document.getElementById('diesisButton').style.borderColor = '#c8553d';
        document.getElementById('diesisButton').style.borderStyle = 'outset';

        const simboloAccidentalePrecedente = svg.querySelector('.accidental');
        if (simboloAccidentalePrecedente) {
            svg.removeChild(simboloAccidentalePrecedente);
        }

        if (nota) {
            svg.removeChild(nota);
        }

        nota = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        nota.setAttribute('cx', x + 150);
        nota.setAttribute('cy', y);
        nota.setAttribute('r', 10);
        nota.classList.add('note');
        svg.appendChild(nota);

        let notaMusicale = noteMap[y] || 'Unknown'; // Recupera la nota associata alla posizione Y
        NotaDefinitiva = notaMusicale

 

        if (bottonePremuto && notaAccidentale) {
            let stringControl = notaMusicale[0];
            if(notaAccidentale === '♭'){
                if (stringControl !='C' && stringControl != 'F'){
                    notaMusicale= notaMusicale + notaAccidentale; // Aggiungi il diesis o bemolle   
                    const simboloAccidentale = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    simboloAccidentale.textContent = notaAccidentale;
                    simboloAccidentale.setAttribute('x', x + 138);
                    simboloAccidentale.setAttribute('y', y + 10);
                    simboloAccidentale.classList.add('accidental');
                    svg.appendChild(simboloAccidentale);
                }
            }else
            {
                if (stringControl !='B' && stringControl != 'E'){
                    notaMusicale= notaMusicale + notaAccidentale; // Aggiungi il diesis o bemolle   
                    const simboloAccidentale = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    simboloAccidentale.textContent = notaAccidentale;
                    simboloAccidentale.setAttribute('x', x + 138);
                    simboloAccidentale.setAttribute('y', y + 10);
                    simboloAccidentale.classList.add('accidental');
                    svg.appendChild(simboloAccidentale);
                }
            }
            NotaDefinitiva = conversion(notaMusicale)
            
        }

        // Mostra la nota musicale sullo schermo
        
        //document.getElementById('notaVisualizzata').
        //textContent = 'Nota: ' + NotaDefinitiva;
        window.startProcessing(NotaDefinitiva);

        // Aggiungi tagli addizionali permanenti
        aggiungiTagliAddizionaliPermanenti(y);
    }

    function trovaPosizioneY(y) {
        let posizionePiuVicino = positions[0];
        let distanzaMinima = Math.abs(y - positions[0]);
    
        for (let i = 1; i < positions.length; i++) {
            const distanza = Math.abs(y - positions[i]);
            if (distanza < distanzaMinima) {
                distanzaMinima = distanza;
                posizionePiuVicino = positions[i];
            }
        }
    
        // Aggiungi condizioni per gestire le posizioni sopra e sotto la quarta e quinta linea addizionale
        if (y < startY - 3 * lineSpacing) {
            posizionePiuVicino = startY - 3.5 * lineSpacing;
        }
        if (y < startY - 3.5 * lineSpacing) {
            posizionePiuVicino = startY - 4 * lineSpacing;
        }
        if (y < startY - 4 * lineSpacing) {
            posizionePiuVicino = startY - 4.5 * lineSpacing;
        }
        if (y < startY - 4.5 * lineSpacing) { // Modificato da 4 a 5
            posizionePiuVicino = startY - 5 * lineSpacing;
        }
        if (y < startY - 5 * lineSpacing) { // Modificato da 4 a 5
            posizionePiuVicino = startY - 5.5 * lineSpacing;
        }
    
        // Gestisci posizioni sotto il pentagramma
        if (y > startY + 4.5 * lineSpacing && y <= startY + 5 * lineSpacing) {
            posizionePiuVicino = startY + 4.5 * lineSpacing; 
        }
        if (y > startY + 5 * lineSpacing) {
            posizionePiuVicino = startY + 5 * lineSpacing; 
        }
    
        return posizionePiuVicino;
    }

    function aggiungiTagliAddizionaliPermanenti(y) {
        
        rimuoviTagliAddizionaliPermanenti();

        const x1 = 170; 
        const x2 = 230; 

        if (y < startY) {
            for (let i = startY - lineSpacing; i >= y; i -= lineSpacing) {
                const linea = disegnaLinea(x1, i, x2, i, 'ledger-line-permanent');
                tagliAddizionaliPermanenti.push(linea);
            }
        } else if (y > startY + 4 * lineSpacing) {
            for (let i = startY + 4 * lineSpacing + lineSpacing; i <= y; i += lineSpacing) {
                const linea = disegnaLinea(x1, i, x2, i, 'ledger-line-permanent');
                tagliAddizionaliPermanenti.push(linea);
            }
        }
    }

    function rimuoviTagliAddizionaliPermanenti() {
        tagliAddizionaliPermanenti.forEach(function(linea) {
            svg.removeChild(linea);
        });
        tagliAddizionaliPermanenti = []; // Svuota l'array dei tagli addizionali permanenti
    }

    svg.addEventListener('click', function(event) {
        const rect = svg.getBoundingClientRect();
        const x = startX; // Assicurati che la coordinata x sia correttamente estratta
        const y = event.clientY - rect.top;
        const posizioneCorrettaY = trovaPosizioneY(y);
        aggiungiNota(x, posizioneCorrettaY);
        bottonePremuto = false;
    });

    svg.addEventListener('mousemove', function(event) {
        const rect = svg.getBoundingClientRect();
        const y = event.clientY - rect.top;
        mostraTagliAddizionali(y);
    });

    svg.addEventListener('mouseleave', function() {
        rimuoviTagliAddizionaliTemporanei();
    });

    var diesisButton = document.getElementById('diesisButton').addEventListener('click', function() { 
        notaAccidentale = '♯';
        bottonePremuto = true;
        document.getElementById('diesisButton').style.backgroundColor = '#F28F3B';
        document.getElementById('diesisButton').style.borderColor = '#F28F3B';
        document.getElementById('diesisButton').style.borderStyle = 'inset';

    });

    var bemolleButton = document.getElementById('bemolleButton').addEventListener('click', function() {
        notaAccidentale = '♭';
        bottonePremuto = true;
        document.getElementById('bemolleButton').style.backgroundColor = '#F28F3B';
        document.getElementById('bemolleButton').style.borderColor = '#F28F3B';
        document.getElementById('bemolleButton').style.borderStyle = 'inset';
        
    });

    function mostraTagliAddizionali(y) {
        rimuoviTagliAddizionaliTemporanei();
        const x1 = 170; // Ho modificato startX in modo da evitare errori
        const x2 = 230; // Ho modificato endX in modo da evitare errori

        if (y < startY) {
            for (let i = startY - lineSpacing; i >= y; i -= lineSpacing) {
                disegnaLinea(x1, i, x2, i, 'ledger-line-temporary');
            }
        } else if (y > startY + 4 * lineSpacing) {
            for (let i = startY + 4 * lineSpacing + lineSpacing; i <= y; i += lineSpacing) {
                disegnaLinea(x1, i, x2, i, 'ledger-line-temporary');
            }
        }
    }

    function rimuoviTagliAddizionaliTemporanei() {
        const tagliAddizionali = svg.querySelectorAll('.ledger-line-temporary');
        tagliAddizionali.forEach(function(linea) {
            svg.removeChild(linea);
        });
    }

    window.addEventListener('resize', function() {
        ridimensionaPentagramma();
    });

    function ridimensionaPentagramma() {
        const rect = svg.getBoundingClientRect();
        const width = rect.width;

        const linee = svg.querySelectorAll('.pentagramma');
        linee.forEach(function(linea) {
            svg.removeChild(linea);
        });

        for (let i = 0; i < 5; i++) {
            const y = startY + i * lineSpacing;
            disegnaLinea(startX, y, width - startX, y);
        }

        for (let i = 0; i < 4; i++) {
            const y = startY + i * lineSpacing + lineSpacing / 2;
            positions.push(y);
        }

        const chiaveDiViolino = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        chiaveDiViolino.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'chiave_di_violino.png');
        chiaveDiViolino.setAttribute('x', '10');
        chiaveDiViolino.setAttribute('y', startY - 110);
        chiaveDiViolino.setAttribute('width', '40');
        chiaveDiViolino.setAttribute('height', '80');
        chiaveDiViolino.style.transform = "scale(2.6)";
        svg.appendChild(chiaveDiViolino);
    }

    ridimensionaPentagramma();
});

const noteArray = ['C6','B5','A5','G5','F5','E5','D5','C5','B4','A4','G4','F4', 'E4', 'D4', 'C4','B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3']

function conversion(notaMusicale){
    let conversion = notaMusicale
    let str = notaMusicale[0] + notaMusicale[1];
    if(notaMusicale.includes('♯')){
        for (let i = 0; i < noteArray.length; i++){
            if(noteArray[i] === str){
                conversion = noteArray[i-1] + 'b';
                break;
            }
        }
        
    }
    if (notaMusicale.includes('♭')){
        conversion = notaMusicale[0] + notaMusicale[1] + 'b';
    }
    
    return conversion;
}