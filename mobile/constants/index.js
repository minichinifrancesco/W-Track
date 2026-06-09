export const logoFull = require('../assets/logo.png');
export const logoCompact = require('../assets/logo.png');

export const COLORS = {
  primary: '#16a34a',
  primaryDark: '#15803d',
  // Light theme defaults (will be overridden dynamically in styles)
  background: '#f9fafb',
  card: '#ffffff',
  textDark: '#111827',
  textMuted: '#6b7280',
  border: '#e5e7eb',
};

// Exercise types:
// 'weight_reps' = Peso + Ripetizioni (es. panca piana)
// 'reps'        = Solo Ripetizioni (es. flessioni)
// 'timed'       = A Tempo in minuti (es. plank, cardio)

export const PRESET_EXERCISES = [
  // ── CARDIO ──────────────────────────────────────────────────────────
  // Macchinari
  { id: 1, name: 'Tapis roulant', muscleGroup: 'Cardio', subcategory: 'Macchinari', type: 'timed', description: 'Corsa o camminata su nastro motorizzato. Regola velocità e pendenza per allenare la resistenza cardiovascolare.' },
  { id: 2, name: 'Cyclette', muscleGroup: 'Cardio', subcategory: 'Macchinari', type: 'timed', description: 'Pedalata stazionaria ideale per il condizionamento cardiovascolare e il consumo calorico a basso impatto sulle articolazioni.' },
  { id: 3, name: 'Ellittica', muscleGroup: 'Cardio', subcategory: 'Macchinari', type: 'timed', description: 'Movimento fluido a doppia azione (gambe e braccia) che simula la corsa senza impatti articolari.' },
  { id: 4, name: 'Stair climber / scale', muscleGroup: 'Cardio', subcategory: 'Macchinari', type: 'timed', description: 'Simulatore di salita scale. Altamente efficace per il sistema cardiovascolare e per il tono di glutei e gambe.' },
  { id: 5, name: 'Vogatore', muscleGroup: 'Cardio', subcategory: 'Macchinari', type: 'timed', description: 'Movimento di vogata che coinvolge l\'85% dei muscoli del corpo, unendo forza e resistenza cardiovascolare.' },
  { id: 6, name: 'Bike orizzontale', muscleGroup: 'Cardio', subcategory: 'Macchinari', type: 'timed', description: 'Cyclette con seduta reclinata che offre maggior supporto lombare, riducendo l\'affaticamento della schiena.' },
  { id: 7, name: 'Assault bike', muscleGroup: 'Cardio', subcategory: 'Macchinari', type: 'timed', description: 'Bici a resistenza ad aria. La resistenza aumenta con la velocità di pedalata; ottima per allenamenti HIIT.' },
  { id: 8, name: 'Spin bike', muscleGroup: 'Cardio', subcategory: 'Macchinari', type: 'timed', description: 'Bici da indoor cycling con volano pesante per simulare fedelmente la pedalata su strada e allenamenti ad alta intensità.' },
  // Corpo libero
  { id: 9, name: 'Jumping jack', muscleGroup: 'Cardio', subcategory: 'Corpo libero', type: 'timed', description: 'Salto divaricando contemporaneamente gambe e braccia. Esercizio dinamico per riscaldamento e coordinazione.' },
  { id: 10, name: 'Corsa sul posto', muscleGroup: 'Cardio', subcategory: 'Corpo libero', type: 'timed', description: 'Simulazione di corsa rimanendo fermi sul posto, sollevando leggermente i piedi e coordinando le braccia.' },
  { id: 11, name: 'Skip alto', muscleGroup: 'Cardio', subcategory: 'Corpo libero', type: 'timed', description: 'Corsa sul posto sollevando le ginocchia verso il petto fino ad altezza bacino in modo rapido e alternato.' },
  { id: 12, name: 'Burpees', muscleGroup: 'Cardio', subcategory: 'Corpo libero', type: 'reps', description: 'Esercizio full-body: dalla posizione eretta scendi in push-up, torna in squat e salta sollevando le mani.' },
  { id: 13, name: 'Mountain climber', muscleGroup: 'Cardio', subcategory: 'Corpo libero', type: 'timed', description: 'Dalla posizione di plank alto, porta alternativamente le ginocchia al petto in modo rapido, simulando una scalata.' },
  { id: 14, name: 'High knees', muscleGroup: 'Cardio', subcategory: 'Corpo libero', type: 'timed', description: 'Corsa sul posto ad alta intensità focalizzata sul sollevamento rapido delle ginocchia sopra la linea dell\'anca.' },
  { id: 15, name: 'Salti con la corda', muscleGroup: 'Cardio', subcategory: 'Corpo libero', type: 'timed', description: 'Saltelli ripetuti superando la corda in rotazione. Ottimo per coordinazione, agilità e resistenza.' },
  { id: 16, name: 'Step-up su rialzo', muscleGroup: 'Cardio', subcategory: 'Corpo libero', type: 'reps', description: 'Sali alternativamente con i piedi su una panchina o box stabile, distendendo completamente l\'anca in cima.' },
  // Con pesi
  { id: 17, name: 'Kettlebell swing', muscleGroup: 'Cardio', subcategory: 'Con pesi', type: 'weight_reps', description: 'Fletti le anche e spingi esplosivamente in avanti il bacino per far oscillare il kettlebell fino ad altezza spalle.' },
  { id: 18, name: 'Farmer walk', muscleGroup: 'Cardio', subcategory: 'Con pesi', type: 'weight_reps', description: 'Camminata tenendo due carichi pesanti (manubri o kettlebell) lungo i fianchi, mantenendo postura eretta e addome attivo.' },
  { id: 19, name: 'Thruster con manubri', muscleGroup: 'Cardio', subcategory: 'Con pesi', type: 'weight_reps', description: 'Esegui uno squat profondo con manubri alle spalle e, risalendo esplosivamente, spingili sopra la testa.' },
  { id: 20, name: 'Clean con manubri', muscleGroup: 'Cardio', subcategory: 'Con pesi', type: 'weight_reps', description: 'Porta i manubri da terra alle spalle con un movimento esplosivo guidato dall\'estensione di anche e ginocchia.' },
  { id: 21, name: 'Sled push', muscleGroup: 'Cardio', subcategory: 'Con pesi', type: 'weight_reps', description: 'Spingi una slitta zavorrata su una corsia libera. Ottimo per lo sviluppo di forza resistente e capacità aerobica.' },
  { id: 22, name: 'Circuito con manubri leggeri', muscleGroup: 'Cardio', subcategory: 'Con pesi', type: 'timed', description: 'Sequenza continua di esercizi multiarticolari eseguiti con manubri leggeri a scopo cardio e metabolico.' },

  // ── GAMBE E GLUTEI ──────────────────────────────────────────────────
  // Macchinari
  { id: 23, name: 'Leg press', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi una piattaforma mobile stendendo le ginocchia, senza bloccarle in estensione completa. Ottimo per i quadricipiti.' },
  { id: 24, name: 'Leg extension', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Estendi le ginocchia stando seduto per isolare i quadricipiti. Controlla il movimento sia in salita che in discesa.' },
  { id: 25, name: 'Leg curl da seduto o sdraiato', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Fletti le ginocchia contro la resistenza per isolare i femorali (bicipite femorale). Mantieni il bacino aderente.' },
  { id: 26, name: 'Hip thrust machine', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi il bacino verso l\'alto contro il cuscino della macchina, contraendo i glutei in fase di massima estensione.' },
  { id: 27, name: 'Abductor machine', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Seduto alla macchina, spingi le cosce verso l\'esterno contro i cuscini per allenare i muscoli abduttori (piccolo e medio gluteo).' },
  { id: 300, name: 'Adductor machine', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Seduto alla macchina, chiudi le cosce verso l\'interno contro i cuscini per isolare ed allenare i muscoli adduttori (interno coscia).' },
  { id: 28, name: 'Calf machine', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Esegui una flessione plantare (sulle punte) da seduto o in piedi per isolare e sviluppare i polpacci.' },
  { id: 29, name: 'Hack squat machine', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Squat eseguito su pedana inclinata con schienale fisso, che riduce lo sforzo sulla colonna e isola i quadricipiti.' },
  { id: 30, name: 'Smith machine squat', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Squat eseguito al multipower (bilanciere guidato). Consente di posizionare i piedi più avanti per enfasi su glutei o femorali.' },
  { id: 31, name: 'Glute machine', muscleGroup: 'Gambe e glutei', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi indietro la gamba piegata contro il rullo della macchina per isolare il grande gluteo.' },
  // Pesi liberi
  { id: 32, name: 'Squat con bilanciere', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Accovacciati tenendo il bilanciere sui trapezi. Scendi mantenendo la schiena dritta e le ginocchia in linea coi piedi.' },
  { id: 33, name: 'Front squat', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Squat con il bilanciere posizionato sulla parte anteriore delle spalle (clavicole), spostando il focus sui quadricipiti.' },
  { id: 34, name: 'Affondi con manubri', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Fai un passo avanti tenendo i manubri e scendi finché il ginocchio posteriore quasi sfiora il pavimento.' },
  { id: 35, name: 'Bulgarian split squat', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Squat monopodalico tenendo un piede appoggiato dietro su una panca. Ottimo per glutei e stabilità.' },
  { id: 36, name: 'Stacco rumeno', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Fletti il busto in avanti mantenendo le gambe semitese e spingendo indietro il bacino per allungare femorali e glutei.' },
  { id: 37, name: 'Stacco da terra', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Solleva il bilanciere da terra estendendo contemporaneamente anche e ginocchia. Coinvolge tutta la catena posteriore.' },
  { id: 38, name: 'Hip thrust con bilanciere', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Seduto a terra con la schiena contro una panca, spingi il bacino verso l\'alto sollevando il bilanciere poggiato sulle anche.' },
  { id: 39, name: 'Step-up con manubri', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sali su un box stabile impugnando due manubri. Concentra la spinta sulla gamba che sale.' },
  { id: 40, name: 'Goblet squat', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esegui uno squat tenendo un manubrio o un kettlebell in verticale davanti al petto. Facilita la postura corretta.' },
  { id: 41, name: 'Calf raises con manubri', muscleGroup: 'Gambe e glutei', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sollevati sulle punte dei piedi tenendo due manubri ai fianchi, preferibilmente su un gradino per aumentare l\'escursione.' },
  // Corpo libero
  { id: 42, name: 'Squat libero', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'Accovacciati spingendo indietro il bacino come per sederti, tenendo la schiena dritta e le braccia in avanti per equilibrio.' },
  { id: 43, name: 'Affondi in avanti', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'Fai un passo avanti e scendi piegando le ginocchia a 90 gradi. Ritorna alla posizione di partenza spingendo sul tallone.' },
  { id: 44, name: 'Affondi indietro', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'Fai un passo indietro e scendi piegando le ginocchia. Riduce lo stress sul ginocchio rispetto all\'affondo in avanti.' },
  { id: 45, name: 'Affondi laterali', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'Fai un ampio passo laterale, piegando una gamba e mantenendo l\'altra tesa per allenare l\'interno coscia e glutei.' },
  { id: 46, name: 'Ponte glutei', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato a terra supino con ginocchia flesse, solleva il bacino allineandolo a ginocchia e spalle, contraendo i glutei.' },
  { id: 47, name: 'Hip thrust a terra', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'Esercizio analogo al ponte glutei a terra, focalizzato sulla contrazione prolungata in alto per massimizzare il lavoro.' },
  { id: 48, name: 'Bulgarian split squat senza peso', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'Squat monopodalico a corpo libero con il piede posteriore appoggiato su una panca o sedia.' },
  { id: 49, name: 'Wall sit', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'timed', description: 'Mantieni la posizione di squat appoggiando completamente la schiena alla parete, con ginocchia flesse a 90°.' },
  { id: 50, name: 'Squat jump', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'Esegui uno squat libero e risali in modo esplosivo eseguendo un salto verticale. Attutisci bene l\'atterraggio.' },
  { id: 51, name: 'Donkey kicks', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'In quadrupedia, spingi la pianta del piede verso il soffitto mantenendo il ginocchio piegato a 90°.' },
  { id: 52, name: 'Fire hydrant', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'In quadrupedia, apri lateralmente la coscia mantenendo il ginocchio piegato, per attivare il gluteo medio.' },
  { id: 53, name: 'Calf raises a corpo libero', muscleGroup: 'Gambe e glutei', subcategory: 'Corpo libero', type: 'reps', description: 'Sollevati sulle punte dei piedi a corpo libero, controllando bene la discesa.' },

  // ── PETTO ───────────────────────────────────────────────────────────
  // Macchinari
  { id: 54, name: 'Chest press', muscleGroup: 'Petto', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi le maniglie in avanti stando seduto. Ottimo esercizio di base a macchina per stimolare i pettorali.' },
  { id: 55, name: 'Pectoral machine / pec deck', muscleGroup: 'Petto', subcategory: 'Macchinari', type: 'weight_reps', description: 'Seduto, avvicina i gomiti o le maniglie davanti al petto effettuando un movimento ad arco per isolare i pettorali.' },
  { id: 56, name: 'Cable crossover ai cavi', muscleGroup: 'Petto', subcategory: 'Macchinari', type: 'weight_reps', description: 'In piedi tra i cavi, tira le maniglie incrociandole davanti a te per ottenere una tensione costante su tutto il petto.' },
  { id: 57, name: 'Smith machine bench press', muscleGroup: 'Petto', subcategory: 'Macchinari', type: 'weight_reps', description: 'Panca piana eseguita al multipower. Permette un movimento guidato concentrato esclusivamente sulla spinta.' },
  { id: 58, name: 'Chest press inclinata', muscleGroup: 'Petto', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spinta inclinata a macchina per focalizzare lo sforzo sulla parte superiore del pettorale (fasci clavicolari).' },
  { id: 59, name: 'Pullover machine', muscleGroup: 'Petto', subcategory: 'Macchinari', type: 'weight_reps', description: 'Macchinario che permette di eseguire il pullover per isolare gran dentato e parte bassa del petto/dorsali.' },
  // Pesi liberi
  { id: 60, name: 'Panca piana con bilanciere', muscleGroup: 'Petto', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sdraiato su panca, abbassa il bilanciere fino al petto e spingilo in alto estendendo le braccia. Esercizio fondamentale per la forza.' },
  { id: 61, name: 'Panca inclinata con bilanciere', muscleGroup: 'Petto', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Spinta su panca inclinata a 30-45 gradi per dare enfasi alla porzione superiore del petto.' },
  { id: 62, name: 'Panca piana con manubri', muscleGroup: 'Petto', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Spinte con manubri su panca. Rispetto al bilanciere, consente un movimento più profondo e naturale.' },
  { id: 63, name: 'Panca inclinata con manubri', muscleGroup: 'Petto', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Spinte con manubri su panca inclinata. Ottimo per la simmetria e l\'ipertrofia del petto alto.' },
  { id: 64, name: 'Croci con manubri', muscleGroup: 'Petto', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sdraiato su panca, apri le braccia lateralmente con gomiti leggermente flessi e richiudile mantenendo la tensione.' },
  { id: 65, name: 'Pullover con manubrio', muscleGroup: 'Petto', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Disteso perpendicolarmente alla panca, porta un manubrio da sopra il petto fin dietro la testa tenendo le braccia tese.' },
  { id: 66, name: 'Push press con manubri', muscleGroup: 'Petto', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Spinta sopra la testa aiutandosi con una leggera flessione ed estensione esplosiva delle gambe.' },
  // Corpo libero
  { id: 67, name: 'Push-up classici', muscleGroup: 'Petto', subcategory: 'Corpo libero', type: 'reps', description: 'Flessioni a terra. Mantieni il corpo allineato come in plank, scendi portando il petto vicino a terra e risali.' },
  { id: 68, name: 'Push-up sulle ginocchia', muscleGroup: 'Petto', subcategory: 'Corpo libero', type: 'reps', description: 'Variante facilitata dei push-up in cui l\'appoggio è sulle ginocchia invece che sulle punte dei piedi.' },
  { id: 69, name: 'Push-up inclinati', muscleGroup: 'Petto', subcategory: 'Corpo libero', type: 'reps', description: 'Push-up con le mani appoggiate su un rialzo (panca o step). Sposta l\'enfasi sulla parte bassa del petto.' },
  { id: 70, name: 'Push-up declinati', muscleGroup: 'Petto', subcategory: 'Corpo libero', type: 'reps', description: 'Push-up con i piedi appoggiati su un rialzo stabile, aumentando il carico sulla parte alta del petto e sulle spalle.' },
  { id: 71, name: 'Diamond push-up', muscleGroup: 'Petto', subcategory: 'Corpo libero', type: 'reps', description: 'Push-up eseguiti tenendo le mani vicine a formare un diamante, ponendo maggiore enfasi su tricipiti e interno petto.' },
  { id: 72, name: 'Dip alle parallele', muscleGroup: 'Petto', subcategory: 'Corpo libero', type: 'reps', description: 'Sospenditi alle parallele, fletti le braccia inclinando il busto leggermente in avanti per sollecitare la porzione inferiore del petto.' },
  { id: 73, name: 'Push-up esplosivi', muscleGroup: 'Petto', subcategory: 'Corpo libero', type: 'reps', description: 'Push-up eseguiti in modo esplosivo staccando le mani da terra in fase di risalita (push-up con battito di mani).' },

  // ── SCHIENA ─────────────────────────────────────────────────────────
  // Macchinari
  { id: 74, name: 'Lat machine avanti', muscleGroup: 'Schiena', subcategory: 'Macchinari', type: 'weight_reps', description: 'Seduto, tira la barra verso la parte superiore del petto inclinando leggermente il busto. Ottimo per la larghezza del dorso.' },
  { id: 75, name: 'Pulley basso', muscleGroup: 'Schiena', subcategory: 'Macchinari', type: 'weight_reps', description: 'Tira la maniglia verso l\'ombelico tenendo la schiena dritta e avvicinando le scapole alla fine del movimento.' },
  { id: 76, name: 'Rematore alla macchina', muscleGroup: 'Schiena', subcategory: 'Macchinari', type: 'weight_reps', description: 'Esegui una tirata seduto con il petto ben appoggiato al cuscino per isolare i dorsali ed eliminare il lavoro lombare.' },
  { id: 77, name: 'Vertical row', muscleGroup: 'Schiena', subcategory: 'Macchinari', type: 'weight_reps', description: 'Macchina a tirata verticale/obliqua, ideale per allenare la parte centrale e superiore della schiena.' },
  { id: 78, name: 'Assisted pull-up machine', muscleGroup: 'Schiena', subcategory: 'Macchinari', type: 'weight_reps', description: 'Macchina per trazioni assistite. Consente di eseguire trazioni con un contrappeso per facilitare il movimento.' },
  { id: 79, name: 'Pullover machine', muscleGroup: 'Schiena', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi la barra ad arco verso il basso per isolare e allungare i gran dorsali escludendo i bicipiti.' },
  { id: 80, name: 'Hyperextension machine', muscleGroup: 'Schiena', subcategory: 'Macchinari', type: 'weight_reps', description: 'Estendi il busto allineandolo alle gambe per allenare la zona lombare, i glutei e i femorali.' },
  // Pesi liberi
  { id: 81, name: 'Rematore con bilanciere', muscleGroup: 'Schiena', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Busto inclinato in avanti a circa 45°, tira il bilanciere verso l\'addome tenendo i gomiti stretti e la schiena dritta.' },
  { id: 82, name: 'Rematore con manubrio', muscleGroup: 'Schiena', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Appoggia un ginocchio e una mano su una panca, impugna un manubrio e tiralo verso il fianco portando indietro il gomito.' },
  { id: 83, name: 'Stacco da terra', muscleGroup: 'Schiena', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sollevamento da terra del bilanciere. Lavoro eccezionale per l\'erettore spinale, i glutei e i trapezi.' },
  { id: 84, name: 'Stacco rumeno', muscleGroup: 'Schiena', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Lavora sulla catena posteriore con una flessione controllata delle anche e ginocchia sbloccate, focalizzandosi sull\'allungamento.' },
  { id: 85, name: 'T-bar row', muscleGroup: 'Schiena', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esegui il rematore afferrando l\'impugnatura di una barra a T vincolata a terra. Ottimo per spessore dorsale.' },
  { id: 86, name: 'Pullover con manubrio', muscleGroup: 'Schiena', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sviluppa l\'allungamento e la forza del gran dorsale muovendo il manubrio in un arco dietro la testa.' },
  { id: 87, name: 'Good morning con bilanciere', muscleGroup: 'Schiena', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Bilanciere sulle spalle, fletti il busto in avanti spingendo indietro il bacino. Eccellente per lombari e glutei.' },
  { id: 88, name: 'Scrollate con manubri, per trapezio', muscleGroup: 'Schiena', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Solleva le spalle verso le orecchie impugnando due manubri pesanti. Evita di ruotare le spalle durante l\'esecuzione.' },
  // Corpo libero
  { id: 89, name: 'Trazioni alla sbarra', muscleGroup: 'Schiena', subcategory: 'Corpo libero', type: 'reps', description: 'Appenditi alla sbarra e solleva il corpo finché il mento supera la sbarra. Presa prona per enfasi sul gran dorsale.' },
  { id: 90, name: 'Chin-up', muscleGroup: 'Schiena', subcategory: 'Corpo libero', type: 'reps', description: 'Trazioni con presa supina (palmi rivolti verso di te). Maggior coinvolgimento dei bicipiti e del gran dorsale.' },
  { id: 91, name: 'Australian pull-up', muscleGroup: 'Schiena', subcategory: 'Corpo libero', type: 'reps', description: 'Trazioni orizzontali eseguite sotto una sbarra bassa o anelli mantenendo i piedi appoggiati a terra.' },
  { id: 92, name: 'Superman', muscleGroup: 'Schiena', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato a pancia in giù, solleva contemporaneamente braccia, petto e gambe da terra contraendo lombari e glutei.' },
  { id: 93, name: 'Reverse snow angel', muscleGroup: 'Schiena', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato prono, muovi le braccia tese ad arco dai fianchi fin sopra la testa, sollevando leggermente il petto.' },
  { id: 94, name: 'Plank con tirata', muscleGroup: 'Schiena', subcategory: 'Corpo libero', type: 'weight_reps', description: 'In posizione di plank alto tenendo due manubri, esegui una remata alternata stabilizzando il core.' },
  { id: 95, name: 'Iperestensioni a terra', muscleGroup: 'Schiena', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato prono con le mani dietro la nuca, solleva delicatamente solo la parte superiore del busto per stimolare i lombari.' },

  // ── SPALLE ──────────────────────────────────────────────────────────
  // Macchinari
  { id: 96, name: 'Shoulder press machine', muscleGroup: 'Spalle', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi le maniglie verso l\'alto stando seduto. Macchinario stabile per lo sviluppo dei deltoidi anteriori e mediali.' },
  { id: 97, name: 'Alzate laterali machine', muscleGroup: 'Spalle', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi i supporti imbottiti verso l\'esterno sollevando i gomiti per isolare perfettamente il deltoide laterale.' },
  { id: 98, name: 'Reverse pec deck', muscleGroup: 'Spalle', subcategory: 'Macchinari', type: 'weight_reps', description: 'Seduto al contrario sulla pectoral machine, spingi le maniglie all\'indietro per isolare i deltoidi posteriori.' },
  { id: 99, name: 'Cavi per alzate laterali', muscleGroup: 'Spalle', subcategory: 'Macchinari', type: 'weight_reps', description: 'Esegui le alzate laterali usando i cavi bassi, garantendo una tensione costante su tutta la traiettoria.' },
  { id: 100, name: 'Smith machine military press', muscleGroup: 'Spalle', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spinta verticale con bilanciere guidato al multipower partendo da sotto il mento. Consente isolamento e sicurezza.' },
  // Pesi liberi
  { id: 101, name: 'Military press con bilanciere', muscleGroup: 'Spalle', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'In piedi, spingi il bilanciere sopra la testa partendo dalle clavicole. Esercizio fondamentale per la spinta verticale.' },
  { id: 102, name: 'Shoulder press con manubri', muscleGroup: 'Spalle', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Seduto o in piedi, spingi i manubri sopra la testa in modo controllato. Ottimo per correggere asimmetrie.' },
  { id: 103, name: 'Arnold press', muscleGroup: 'Spalle', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Spinta sopra la testa ruotando i polsi durante il movimento (partendo con palmi rivolti a te e finendo all\'esterno).' },
  { id: 104, name: 'Alzate laterali con manubri', muscleGroup: 'Spalle', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Solleva i manubri lateralmente fino all\'altezza delle spalle tenendo i gomiti leggermente piegati. Allena la larghezza spalle.' },
  { id: 105, name: 'Alzate frontali con manubri', muscleGroup: 'Spalle', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Solleva i manubri in avanti fino all\'altezza degli occhi per isolare i deltoidi anteriori.' },
  { id: 106, name: 'Alzate posteriori con manubri', muscleGroup: 'Spalle', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Fletti il busto a 90° e solleva lateralmente i manubri concentrandoti sull\'attivazione dei deltoidi posteriori.' },
  { id: 107, name: 'Tirate al mento con bilanciere o manubri', muscleGroup: 'Spalle', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Tira il bilanciere verticalmente verso il mento tenendo i gomiti alti rispetto alle mani. Allena trapezi e deltoidi.' },
  { id: 108, name: 'Scrollate con manubri o bilanciere', muscleGroup: 'Spalle', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Scrolla le spalle verso le orecchie stringendo i trapezi in alto senza piegare i gomiti.' },
  // Corpo libero
  { id: 109, name: 'Pike push-up', muscleGroup: 'Spalle', subcategory: 'Corpo libero', type: 'reps', description: 'Push-up eseguiti con il bacino sollevato a formare una V rovesciata, indirizzando il peso corporeo sulle spalle.' },
  { id: 110, name: 'Handstand push-up', muscleGroup: 'Spalle', subcategory: 'Corpo libero', type: 'reps', description: 'Flessioni in verticale al muro. Esercizio avanzato che richiede grande forza nelle spalle ed equilibrio.' },
  { id: 111, name: 'Plank shoulder taps', muscleGroup: 'Spalle', subcategory: 'Corpo libero', type: 'reps', description: 'Dalla posizione di plank alto, tocca alternativamente la spalla opposta mantenendo il bacino stabile.' },
  { id: 112, name: 'Wall walk', muscleGroup: 'Spalle', subcategory: 'Corpo libero', type: 'reps', description: 'Inizia in plank a terra con i piedi al muro, cammina all\'indietro salendo con i piedi fino a raggiungere la verticale.' },
  { id: 113, name: 'Push-up declinati', muscleGroup: 'Spalle', subcategory: 'Corpo libero', type: 'reps', description: 'Eseguiti con i piedi sollevati su un box per caricare maggiormente spalle e parte superiore del petto.' },
  { id: 114, name: 'Bear crawl', muscleGroup: 'Spalle', subcategory: 'Corpo libero', type: 'timed', description: 'Camminata dell\'orso a quattro zampe mantenendo ginocchia staccate da terra a pochi centimetri e addome attivo.' },

  // ── BICIPITI ────────────────────────────────────────────────────────
  // Macchinari
  { id: 115, name: 'Curl machine', muscleGroup: 'Bicipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Fletti i gomiti stando seduto con le braccia poggiate sul cuscino della macchina per isolare i bicipiti.' },
  { id: 116, name: 'Curl ai cavi bassi', muscleGroup: 'Bicipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Curl eseguito ai cavi che garantisce tensione continua su tutto il range di movimento di flessione del gomito.' },
  { id: 117, name: 'Curl alla panca Scott machine', muscleGroup: 'Bicipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Macchinario che replica la panca Scott offrendo un ottimo isolamento dei flessori del braccio.' },
  { id: 118, name: 'Cable curl con corda', muscleGroup: 'Bicipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Flessione dei gomiti ai cavi con presa neutra fornita dalla corda per stimolare anche il brachioradiale.' },
  { id: 119, name: 'Cable curl con barra', muscleGroup: 'Bicipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Curl ai cavi con barra dritta o sagomata, ideale per stimolare intensamente il bicipite brachiale.' },
  // Pesi liberi
  { id: 120, name: 'Curl con bilanciere', muscleGroup: 'Bicipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'In piedi, fletti i gomiti sollevando il bilanciere senza oscillare con il busto. Esercizio classico per la massa dei bicipiti.' },
  { id: 121, name: 'Curl con manubri', muscleGroup: 'Bicipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esegui la flessione dei gomiti ruotando i palmi verso l\'alto (supinazione) durante la salita.' },
  { id: 122, name: 'Hammer curl', muscleGroup: 'Bicipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Curl eseguito con presa neutra (palmi che si guardano) per colpire bicipite, brachiale e brachioradiale.' },
  { id: 123, name: 'Curl concentrato', muscleGroup: 'Bicipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Seduto, appoggia il gomito all\'interno della coscia ed esegui la flessione per un isolamento totale del bicipite.' },
  { id: 124, name: 'Curl su panca inclinata', muscleGroup: 'Bicipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Seduto su panca inclinata a 45-60°, esegui il curl lasciando cadere le braccia perpendicolari per massimizzare il prestiramento.' },
  { id: 125, name: 'Curl alla panca Scott', muscleGroup: 'Bicipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esegui il curl appoggiando le braccia sul piano inclinato della panca Scott, per eliminare il cheating lombare.' },
  { id: 126, name: 'Zottman curl', muscleGroup: 'Bicipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sali in curl classico supinato, poi ruota i palmi in basso (pronazione) prima di scendere in fase eccentrica.' },
  // Corpo libero
  { id: 127, name: 'Chin-up presa supina', muscleGroup: 'Bicipiti', subcategory: 'Corpo libero', type: 'reps', description: 'Trazioni alla sbarra con palmi rivolti verso di te. Coinvolgono intensamente i bicipiti come motori primari.' },
  { id: 128, name: 'Australian chin-up', muscleGroup: 'Bicipiti', subcategory: 'Corpo libero', type: 'reps', description: 'Trazioni orizzontali a sbarra bassa o anelli con presa supina per focalizzarsi sui flessori del braccio.' },
  { id: 129, name: 'Isometria alla sbarra con mento sopra la barra', muscleGroup: 'Bicipiti', subcategory: 'Corpo libero', type: 'timed', description: 'Mantieniti appeso alla sbarra con il mento sopra di essa, contraendo forte bicipiti e schiena.' },
  { id: 130, name: 'Curl con asciugamano', muscleGroup: 'Bicipiti', subcategory: 'Corpo libero', type: 'reps', description: 'Esercizio che sfrutta un asciugamano ancorato in modo solido per eseguire trazioni isometriche o curl sfruttando la tensione.' },

  // ── TRICIPITI ───────────────────────────────────────────────────────
  // Macchinari
  { id: 131, name: 'Pushdown ai cavi con barra', muscleGroup: 'Tricipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi la barra verso il basso estendendo completamente i gomiti. Mantieni i gomiti fissi vicino ai fianchi.' },
  { id: 132, name: 'Pushdown ai cavi con corda', muscleGroup: 'Tricipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi la corda in basso allargando le estremità alla fine del movimento per contrarre al massimo i tricipiti.' },
  { id: 133, name: 'Dip machine', muscleGroup: 'Tricipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi i supporti verso il basso stando seduto per simulare le parallele in totale stabilità e controllo del carico.' },
  { id: 134, name: 'Triceps extension machine', muscleGroup: 'Tricipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Stando seduto, spingi i supporti estendendo i gomiti per isolare i tricipiti.' },
  { id: 135, name: 'French press ai cavi', muscleGroup: 'Tricipiti', subcategory: 'Macchinari', type: 'weight_reps', description: 'Estensione dei gomiti eseguita ai cavi per mantenere tensione costante sul tricipite durante tutta la fase di allungamento.' },
  // Pesi liberi
  { id: 136, name: 'French press con bilanciere EZ', muscleGroup: 'Tricipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sdraiato su panca, piega i gomiti portando la barra EZ verso la fronte, quindi estendili per sollevare il peso.' },
  { id: 137, name: 'Estensioni tricipiti con manubrio sopra la testa', muscleGroup: 'Tricipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Seduto, impugna un manubrio a due mani e portalo dietro il collo, quindi estendi i gomiti sopra la testa.' },
  { id: 138, name: 'Kickback con manubri', muscleGroup: 'Tricipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Busto inclinato avanti, braccio parallelo al busto, estendi l\'avambraccio all\'indietro mantenendo il gomito alto.' },
  { id: 139, name: 'Panca presa stretta con bilanciere', muscleGroup: 'Tricipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sdraiato, impugna il bilanciere con le mani a larghezza spalle e spingi. Ottimo multiarticolare per la forza dei tricipiti.' },
  { id: 140, name: 'Skull crusher', muscleGroup: 'Tricipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Simile alla french press, eseguito portando i manubri o il bilanciere leggermente oltre la testa per maggior allungamento.' },
  { id: 141, name: 'Tate press', muscleGroup: 'Tricipiti', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sdraiato su panca con manubri al petto (gomiti in fuori), estendi le braccia verso l\'alto facendo compiere un arco interno.' },
  // Corpo libero
  { id: 142, name: 'Dip su panca', muscleGroup: 'Tricipiti', subcategory: 'Corpo libero', type: 'reps', description: 'Appoggia le mani sul bordo di una panca dietro di te e scendi flettendo i gomiti a 90°. Risali spingendo sui palmi.' },
  { id: 143, name: 'Dip alle parallele', muscleGroup: 'Tricipiti', subcategory: 'Corpo libero', type: 'reps', description: 'Sospenditi alle parallele con busto eretto, piega i gomiti tenendoli vicino al corpo per focalizzare lo sforzo sui tricipiti.' },
  { id: 144, name: 'Diamond push-up', muscleGroup: 'Tricipiti', subcategory: 'Corpo libero', type: 'reps', description: 'Push-up tenendo gli indici e i pollici uniti sotto il petto, ponendo forte enfasi sull\'estensione dei tricipiti.' },
  { id: 145, name: 'Push-up presa stretta', muscleGroup: 'Tricipiti', subcategory: 'Corpo libero', type: 'reps', description: 'Push-up eseguiti tenendo le mani allineate alle spalle e i gomiti stretti lungo i fianchi.' },
  { id: 146, name: 'Plank to push-up', muscleGroup: 'Tricipiti', subcategory: 'Corpo libero', type: 'reps', description: 'Passa dalla posizione di plank sugli avambracci a quella di push-up alto spingendo una mano alla volta.' },
  { id: 147, name: 'Estensioni tricipiti a corpo libero su sbarra bassa', muscleGroup: 'Tricipiti', subcategory: 'Corpo libero', type: 'reps', description: 'Piegamento del busto sotto una sbarra poggiando solo le mani, portando la fronte alla sbarra per caricare i tricipiti.' },

  // ── ADDOME E CORE ───────────────────────────────────────────────────
  // Macchinari
  { id: 148, name: 'Ab crunch machine', muscleGroup: 'Addome e core', subcategory: 'Macchinari', type: 'weight_reps', description: 'Macchinario seduto per eseguire il crunch contro resistenza. Utile per sovraccaricare in sicurezza l\'addome.' },
  { id: 149, name: 'Torso rotation machine', muscleGroup: 'Addome e core', subcategory: 'Macchinari', type: 'weight_reps', description: 'Esegui la rotazione del busto contro la resistenza per allenare gli obliqui interni ed esterni.' },
  { id: 150, name: 'Cable crunch', muscleGroup: 'Addome e core', subcategory: 'Macchinari', type: 'weight_reps', description: 'In ginocchio davanti alla carrucola alta, impugna la corda dietro la nuca e fletti la colonna verso il pavimento.' },
  { id: 151, name: 'Leg raise machine', muscleGroup: 'Addome e core', subcategory: 'Macchinari', type: 'reps', description: 'Appoggiato sugli avambracci sulla sedia romana, solleva le ginocchia o le gambe tese per stimolare l\'addome basso.' },
  { id: 152, name: 'Panca romana', muscleGroup: 'Addome e core', subcategory: 'Macchinari', type: 'reps', description: 'Esegui i sollevamenti del busto o delle gambe bloccato sulla panca inclinata per il core.' },
  { id: 153, name: 'Back extension machine', muscleGroup: 'Addome e core', subcategory: 'Macchinari', type: 'weight_reps', description: 'Macchinario per l\'estensione lombare, ideale per rinforzare i muscoli erettori spinali della schiena.' },
  // Pesi liberi
  { id: 154, name: 'Russian twist con disco o manubrio', muscleGroup: 'Addome e core', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Seduto a terra con busto a 45° e piedi sollevati, ruota il busto lateralmente portando un peso da un lato all\'altro.' },
  { id: 155, name: 'Sit-up con disco', muscleGroup: 'Addome e core', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Classico sit-up eseguito tenendo un disco di peso appoggiato al petto o teso sopra la testa.' },
  { id: 156, name: 'Plank con peso sulla schiena', muscleGroup: 'Addome e core', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esegui il plank sui gomiti posizionando un disco zavorrato sulla zona lombare/dorsale per aumentare la stabilità.' },
  { id: 157, name: 'Woodchopper ai cavi o con manubrio', muscleGroup: 'Addome e core', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esegui una rotazione del busto dall\'alto verso il basso tirando il cavo o manubrio in diagonale per gli obliqui.' },
  { id: 158, name: 'Farmer walk', muscleGroup: 'Addome e core', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Camminata con carichi elevati che richiede una forte attivazione stabilizzatrice di tutto il core.' },
  { id: 159, name: 'Side bend con manubrio', muscleGroup: 'Addome e core', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Fletti lateralmente il busto tenendo un manubrio in una mano per sollecitare i quadrati dei lombi e gli obliqui.' },
  { id: 160, name: 'Turkish get-up', muscleGroup: 'Addome e core', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esercizio complesso in cui ci si alza da sdraiati a in piedi sorreggendo un manubrio o kettlebell sopra la testa.' },
  // Corpo libero
  { id: 161, name: 'Crunch', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato supino, solleva le scapole da terra contraendo l\'addome, senza tirare il collo con le mani.' },
  { id: 162, name: 'Reverse crunch', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato supino, solleva il bacino da terra portando le ginocchia verso il petto.' },
  { id: 163, name: 'Plank', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'timed', description: 'Mantieni il corpo dritto e allineato appoggiandoti solo sugli avambracci e sulle punte dei piedi. Attiva addome e glutei.' },
  { id: 164, name: 'Side plank', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'timed', description: 'Plank laterale appoggiato su un solo gomito, allineando caviglie, bacino e spalle. Ottimo per gli obliqui.' },
  { id: 165, name: 'Mountain climber', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'timed', description: 'Dalla posizione di plank alto, simula la scalata dinamica portando le ginocchia al petto.' },
  { id: 166, name: 'Bicycle crunch', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'reps', description: 'Crunch alternato portando il gomito destro verso il ginocchio sinistro e viceversa, simulando una pedalata.' },
  { id: 167, name: 'Leg raises', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato supino, solleva le gambe tese a 90° e abbassale lentamente senza inarcare la zona lombare.' },
  { id: 168, name: 'Hollow hold', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'timed', description: 'Posizione isometrica sdraiati supini sollevando spalle e gambe da terra, tenendo la zona lombare incollata al pavimento.' },
  { id: 169, name: 'Dead bug', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato supino con braccia in alto e ginocchia a 90°, distendi braccio e gamba opposti stabilizzando il core.' },
  { id: 170, name: 'Bird dog', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'reps', description: 'In quadrupedia, allunga contemporaneamente braccio e gamba opposti fino a renderli paralleli al pavimento.' },
  { id: 171, name: 'V-up', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'reps', description: 'Solleva contemporaneamente busto e gambe tese da terra cercando di toccare i piedi con le mani in volo.' },
  { id: 172, name: 'Flutter kicks', muscleGroup: 'Addome e core', subcategory: 'Corpo libero', type: 'timed', description: 'Sdraiato supino con le mani sotto i glutei, esegui dei piccoli e rapidi calci alternati verticali con le gambe tese.' },

  // ── POLPACCI ────────────────────────────────────────────────────────
  // Macchinari
  { id: 173, name: 'Standing calf machine', muscleGroup: 'Polpacci', subcategory: 'Macchinari', type: 'weight_reps', description: 'Sollevamento sulle punte in piedi con i cuscinetti della macchina appoggiati sulle spalle.' },
  { id: 174, name: 'Seated calf machine', muscleGroup: 'Polpacci', subcategory: 'Macchinari', type: 'weight_reps', description: 'Sollevamento sulle punte da seduto con la resistenza posizionata sulle cosce. Isola il muscolo soleo.' },
  { id: 175, name: 'Calf press alla leg press', muscleGroup: 'Polpacci', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi la pedana della leg press esclusivamente effettuando una flessione plantare con la punta dei piedi.' },
  { id: 176, name: 'Smith machine calf raise', muscleGroup: 'Polpacci', subcategory: 'Macchinari', type: 'weight_reps', description: 'Esegui il calf raise con il bilanciere del multipower sulle spalle posizionando i piedi su uno scalino.' },
  // Pesi liberi
  { id: 177, name: 'Calf raises con manubri', muscleGroup: 'Polpacci', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esegui i sollevamenti sulle punte tenendo due manubri lungo i fianchi per aumentare il sovraccarico.' },
  { id: 178, name: 'Calf raises con bilanciere', muscleGroup: 'Polpacci', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sollevamenti sulle punte tenendo il bilanciere in appoggio sui trapezi.' },
  { id: 179, name: 'Calf raises su step con manubri', muscleGroup: 'Polpacci', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sollevamenti eseguiti su step per consentire una maggiore escursione ed allungamento del tendine.' },
  { id: 180, name: 'Farmer walk sulle punte', muscleGroup: 'Polpacci', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Cammina per una distanza prefissata appoggiandoti esclusivamente sulle punte dei piedi e tenendo due carichi.' },
  // Corpo libero
  { id: 181, name: 'Calf raises a terra', muscleGroup: 'Polpacci', subcategory: 'Corpo libero', type: 'reps', description: 'Esegui i sollevamenti sulle punte dei piedi a terra a corpo libero, focalizzandoti sulla contrazione.' },
  { id: 182, name: 'Calf raises su gradino', muscleGroup: 'Polpacci', subcategory: 'Corpo libero', type: 'reps', description: 'Esegui i sollevamenti sulle punte su un gradino per incrementare la fase di discesa allungando il polpaccio.' },
  { id: 183, name: 'Calf raises a una gamba', muscleGroup: 'Polpacci', subcategory: 'Corpo libero', type: 'reps', description: 'Esegui i sollevamenti su un solo piede per raddoppiare l\'intensità del carico a corpo libero.' },
  { id: 184, name: 'Camminata sulle punte', muscleGroup: 'Polpacci', subcategory: 'Corpo libero', type: 'timed', description: 'Cammina tenendo i talloni ben sollevati da terra per mantenere i polpacci in contrazione costante.' },
  { id: 185, name: 'Saltelli sul posto', muscleGroup: 'Polpacci', subcategory: 'Corpo libero', type: 'timed', description: 'Saltella sulle punte simulando il salto con la corda per stimolare la reattività elastica del polpaccio.' },

  // ── GLUTEI SPECIFICI ────────────────────────────────────────────────
  // Macchinari
  { id: 186, name: 'Hip thrust machine', muscleGroup: 'Glutei specifici', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spinta pelvica guidata per il massimo sovraccarico e isolamento del grande gluteo.' },
  { id: 187, name: 'Glute kickback machine', muscleGroup: 'Glutei specifici', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spingi la pedana indietro estendendo l\'anca contro la resistenza per isolare il gluteo.' },
  { id: 188, name: 'Abductor machine', muscleGroup: 'Glutei specifici', subcategory: 'Macchinari', type: 'weight_reps', description: 'Apri le gambe verso l\'esterno per attivare selettivamente il gluteo medio e il tensore della fascia lata.' },
  { id: 189, name: 'Cable kickback', muscleGroup: 'Glutei specifici', subcategory: 'Macchinari', type: 'weight_reps', description: 'Con la cavigliera collegata al cavo basso, spingi la gamba tesa all\'indietro mantenendo il core fermo.' },
  { id: 190, name: 'Leg press con piedi alti', muscleGroup: 'Glutei specifici', subcategory: 'Macchinari', type: 'weight_reps', description: 'Esegui la leg press posizionando i piedi in alto sulla pedana per deviare lo sforzo da quadricipite a gluteo e femorali.' },
  { id: 191, name: 'Smith machine hip thrust', muscleGroup: 'Glutei specifici', subcategory: 'Macchinari', type: 'weight_reps', description: 'Hip thrust eseguito al multipower posizionando una panca dietro per la schiena ed il bilanciere sulle anche.' },
  // Pesi liberi
  { id: 192, name: 'Hip thrust con bilanciere', muscleGroup: 'Glutei specifici', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Poggia le scapole sulla panca, spingi il bilanciere posizionato sulle anche verso l\'alto contraendo i glutei.' },
  { id: 193, name: 'Ponte glutei con manubrio', muscleGroup: 'Glutei specifici', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sdraiato supino a terra, spingi le anche poggiandovi sopra un manubrio pesante.' },
  { id: 194, name: 'Stacco rumeno', muscleGroup: 'Glutei specifici', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Concentrati sullo stiramento spingendo indietro i fianchi e scendendo con manubri/bilanciere radenti le gambe.' },
  { id: 195, name: 'Bulgarian split squat', muscleGroup: 'Glutei specifici', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Squat monopodalico ideale per glutei: scendi profondamente flettendo il ginocchio anteriore.' },
  { id: 196, name: 'Affondi camminati', muscleGroup: 'Glutei specifici', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esegui affondi alternati camminando in avanti per sottoporre i glutei a un lavoro dinamico e profondo.' },
  { id: 197, name: 'Sumo squat con manubrio', muscleGroup: 'Glutei specifici', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Squat a gambe molto divaricate e punte in fuori tenendo un manubrio in mezzo. Attiva glutei e interno coscia.' },
  { id: 198, name: 'Kettlebell swing', muscleGroup: 'Glutei specifici', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Oscillazione esplosiva generata dall\'hip hinge (cerniera d\'anca), ideale per stimolare la potenza dei glutei.' },
  // Corpo libero
  { id: 199, name: 'Glute bridge', muscleGroup: 'Glutei specifici', subcategory: 'Corpo libero', type: 'reps', description: 'Solleva il bacino contraendo i glutei in alto a corpo libero.' },
  { id: 200, name: 'Hip thrust a terra', muscleGroup: 'Glutei specifici', subcategory: 'Corpo libero', type: 'reps', description: 'Estensione delle anche eseguita a terra a corpo libero con enfasi sulla contrazione picco.' },
  { id: 201, name: 'Single-leg glute bridge', muscleGroup: 'Glutei specifici', subcategory: 'Corpo libero', type: 'reps', description: 'Esegui il ponte glutei sollevando una gamba in aria, aumentando la difficoltà per il gluteo d\'appoggio.' },
  { id: 202, name: 'Donkey kick', muscleGroup: 'Glutei specifici', subcategory: 'Corpo libero', type: 'reps', description: 'Slanci posteriori in quadrupedia guidati dal tallone verso l\'alto.' },
  { id: 203, name: 'Fire hydrant', muscleGroup: 'Glutei specifici', subcategory: 'Corpo libero', type: 'reps', description: 'In quadrupedia, apri lateralmente l\'anca per stimolare il gluteo medio.' },
  { id: 204, name: 'Squat sumo', muscleGroup: 'Glutei specifici', subcategory: 'Corpo libero', type: 'reps', description: 'Squat a corpo libero a stance ampio e punte ruotate all\'esterno.' },
  { id: 205, name: 'Frog pump', muscleGroup: 'Glutei specifici', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato supino, unisci le piante dei piedi piegando le ginocchia a rana, quindi solleva il bacino.' },
  { id: 206, name: 'Side-lying leg raise', muscleGroup: 'Glutei specifici', subcategory: 'Corpo libero', type: 'reps', description: 'Sdraiato su un fianco, solleva lateralmente la gamba tesa per allenare l\'abduttore.' },

  // ── FULL BODY ───────────────────────────────────────────────────────
  // Macchinari
  { id: 207, name: 'Vogatore', muscleGroup: 'Full body', subcategory: 'Macchinari', type: 'timed', description: 'Combina la spinta delle gambe e la tirata delle braccia coinvolgendo quasi tutti i muscoli.' },
  { id: 208, name: 'Sled push', muscleGroup: 'Full body', subcategory: 'Macchinari', type: 'weight_reps', description: 'Spinta slitta con carico per attivare gambe, core, spalle e braccia.' },
  { id: 209, name: 'Cable station circuit', muscleGroup: 'Full body', subcategory: 'Macchinari', type: 'weight_reps', description: 'Circuito multiarticolare ai cavi per unire forza e resistenza per tutto il corpo.' },
  { id: 210, name: 'Smith machine squat + press', muscleGroup: 'Full body', subcategory: 'Macchinari', type: 'weight_reps', description: 'Esegui uno squat al multipower e, salendo, effettua una spinta verticale sopra la testa.' },
  { id: 211, name: 'Functional trainer ai cavi', muscleGroup: 'Full body', subcategory: 'Macchinari', type: 'weight_reps', description: 'Esercizi funzionali multi-piano che stimolano coordinazione e forza per tutto il corpo.' },
  // Pesi liberi
  { id: 212, name: 'Squat + shoulder press', muscleGroup: 'Full body', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esegui uno squat profondo con manubri e spingili in alto durante la fase di risalita.' },
  { id: 213, name: 'Thruster con manubri', muscleGroup: 'Full body', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Movimento fluido di squat seguito da una spinta esplosiva dei manubri sopra la testa.' },
  { id: 214, name: 'Stacco da terra', muscleGroup: 'Full body', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esercizio fondamentale per la catena posteriore, le gambe, la schiena e le braccia.' },
  { id: 215, name: 'Clean con manubri', muscleGroup: 'Full body', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Esercizio olimpico adattato per manubri: tirata esplosiva da terra per portare i pesi alle spalle.' },
  { id: 216, name: 'Kettlebell swing', muscleGroup: 'Full body', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Lavoro balistico incentrato sull\'estensione d\'anca che coinvolge glutei, femorali, core e spalle.' },
  { id: 217, name: 'Farmer walk', muscleGroup: 'Full body', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Camminata zavorrata per stimolare forza di presa, trapezi, gambe e stabilità del core.' },
  { id: 218, name: 'Snatch con manubrio', muscleGroup: 'Full body', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Strappo monopodalico: porta il manubrio da terra a sopra la testa con un unico movimento esplosivo.' },
  { id: 219, name: 'Turkish get-up', muscleGroup: 'Full body', subcategory: 'Pesi liberi', type: 'weight_reps', description: 'Sollevati da terra tenendo il braccio teso con manubrio sopra la testa. Richiede stabilità estrema.' },
  // Corpo libero
  { id: 220, name: 'Burpees', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'reps', description: 'Fletti le braccia a terra, torna in accovacciata e salta in alto battendo le mani.' },
  { id: 221, name: 'Jump squat', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'reps', description: 'Squat a corpo libero seguito da salto verticale esplosivo.' },
  { id: 222, name: 'Mountain climber', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'timed', description: 'Porta alternativamente e velocemente le ginocchia al petto in plank.' },
  { id: 223, name: 'Push-up', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'reps', description: 'Push-up classici a terra per stimolare petto, spalle e tricipiti.' },
  { id: 224, name: 'Plank', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'timed', description: 'Isometria totale per la forza e la stabilità del core.' },
  { id: 225, name: 'Affondi alternati', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'reps', description: 'Affondi eseguiti alternando gamba destra e sinistra a corpo libero.' },
  { id: 226, name: 'Bear crawl', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'timed', description: 'Camminata carponi a ginocchia sospese che stimola coordinazione, spalle e core.' },
  { id: 227, name: 'Squat + salto', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'reps', description: 'Esegui uno squat e collegalo immediatamente a un salto esplosivo.' },
  { id: 228, name: 'Inchworm', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'reps', description: 'Da eretto fletti il busto, cammina avanti con le mani fino a plank e riavvicina i piedi.' },
  { id: 229, name: 'Sprawl', muscleGroup: 'Full body', subcategory: 'Corpo libero', type: 'reps', description: 'Scendi in plank togliendo le gambe indietro velocemente, tocca il bacino a terra e rimettiti in piedi.' }
];

export const getAvailableMuscleGroups = (allExercises = PRESET_EXERCISES) => {
  const groups = new Set();
  allExercises.forEach((ex) => groups.add(ex.muscleGroup));
  return Array.from(groups);
};
