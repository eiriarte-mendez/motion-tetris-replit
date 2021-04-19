
const weltContainer = document.getElementById('welt');

const tetroVoschauContainer = document.getElementById('vorschau');

const punkteContainer = document.getElementById('punkte');

const zeilenAnzahlContainer = document.getElementById('zeilen-total');

const levelContainer = document.getElementById('level');

// Erzeugt die `welt` Matrix
const weltErzeugen = (hoehe, breite) => {
    return (new Array(hoehe)).fill((new Array(breite)).fill(0));
};

// initialisiert den Weltraster
const weltContainerInitialisieren = (welt, prefix) => {
    weltContainer.innerHTML = welt
        .map(
            (zellen, y) => zellen.reduce(
                (spalten, _, x) => `${spalten}<div id="${prefix}_${y}-${x}" class="tetro"></div>`, ''
            )
        )
        .join('<br>');
};

const tetroVorschauContainerInitialisieren = (prefix) => {
    const raster = weltErzeugen(4, 4);
    tetroVoschauContainer.innerHTML = raster
        .map(
            (zellen, y) => zellen.reduce(
                (spalten, _, x) => `${spalten}<div id="${prefix}_${y}-${x}" class="tetro"></div>`, ''
            )
        )
        .join('<br>');
};

const tetroStyleNamen = {
    1: 'O',
    2: 'I',
    3: 'L',
    4: 'J',
    5: 'S',
    6: 'Z',
    7: 'T'
};

// aktualisiert die Darstellung auf dem Browser
const weltRasterAktualisieren = (welt, tetro, prefix) => {
    for (let zeile = 0; zeile < welt.length; zeile++) {
        for (let spalte = 0; spalte < welt[0].length; spalte++) {
            const zelle = document.getElementById(`${prefix}_${zeile}-${spalte}`);
            zelle.classList.remove('gefuellt', 'O', 'I', 'L', 'J', 'S', 'Z', 'T');

            if (tetro.istAufZelle(zeile, spalte)) {
                const tetroZelle = tetro.zelle(zeile, spalte);
                if (tetroZelle > 0)
                    zelle.classList.add(tetroStyleNamen[tetroZelle], 'gefuellt');
            }

            const weltZelle = welt[zeile][spalte];
            if (weltZelle > 0)
                zelle.classList.add(tetroStyleNamen[weltZelle], 'gefuellt');
        }
    }
};

// aktualisiert die Vorschaubox
const tetroVorschauAktualisieren = ({ muster }, prefix) => {
    for (let zeile = 0; zeile < 4; zeile++) {
        const y = muster.length - 1 - zeile;
        for (let spalte = 0; spalte < 4; spalte++) {
            const zelle = document.getElementById(`${prefix}_${3 - zeile}-${spalte}`);
            zelle.classList.remove('gefuellt', 'O', 'I', 'L', 'J', 'S', 'Z', 'T');

            if (zeile >= muster.length || spalte >= muster.length) {
                zelle.className = 'tetro';
                continue;
            }

            const tetroZelle = muster[y][spalte];
            if (tetroZelle > 0)
                zelle.classList.add(tetroStyleNamen[tetroZelle], 'gefuellt');
        }
    }
};

const tetroAufWeltAblegen = (welt, { spalte, zeile, muster }) => {
    return welt.map((spaltenList, y) => {
        const tetroZeile = (y - zeile);

        return spaltenList.map((weltZelle, x) => {
            const tetroSpalte = (x - spalte);

            if (tetroZeile < 0
                || tetroZeile >= muster.length
                || tetroSpalte < 0
                || tetroSpalte >= muster.length) {
                return weltZelle;
            }

            const tetroZelle = muster[tetroZeile][tetroSpalte];

            return tetroZelle !== 0 ? tetroZelle : weltZelle;
        });

    });
};

const findeVolleZeilen = (welt) => welt.reduce((_volleZeilen, spaltenListe, zeile) => {
    if (spaltenListe.some((spalte) => spalte === 0)) {
        return _volleZeilen;
    }

    return [..._volleZeilen, zeile];
}, []);

// löscht eine Zeile im gegebenen `index` und fügt eine neue Zeile am Anfang hinzu.
const loescheWeltZeile = (index, tetris) => {
    const neueZeile = (new Array(tetris.breite)).fill(0);
    tetris.welt.splice(index, 1);
    tetris.welt = [neueZeile, ...tetris.welt];
    tetris.aktualisieren();
}

// aktualisiert alle Anzeigen zum Spiel mit den gegebenen Werte.
const spielAnzeigenAktualisieren = (punkte, zeilen, level) => {
    punkteContainer.innerText = `00000000${punkte}`.substr(-7);
    zeilenAnzahlContainer.innerText = `00000000${zeilen}`.substr(-7);
    levelContainer.innerText = `00000000${level}`.substr(-7);
}
