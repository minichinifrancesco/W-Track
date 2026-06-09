import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants';

// ── Help content per screen ──────────────────────────────────────────────────
const HELP_CONTENT = {
  home: {
    title: 'HOME — Le mie schede',
    sections: [
      {
        heading: 'Schede allenamento',
        body: 'Qui trovi tutte le schede che hai creato. Ogni scheda mostra il nome e il numero di esercizi al suo interno.',
      },
      {
        heading: '+ Nuova scheda',
        body: 'Premi il pulsante in alto a destra oppure il tasto ＋ in basso a destra per creare una nuova scheda. Potrai darle un nome e aggiungerci gli esercizi.',
      },
      {
        heading: 'Dettagli',
        body: 'Mostra un riepilogo degli esercizi presenti nella scheda (nome, serie, ripetizioni, peso predefinito).',
      },
      {
        heading: 'Modifica',
        body: "Apre l'editor della scheda dove puoi rinominare la scheda, aggiungere, rimuovere o riordinare gli esercizi e modificare le serie.",
      },
      {
        heading: 'Inizia workout',
        body: 'Avvia una sessione di allenamento basata sulla scheda. Il timer parte automaticamente e puoi segnare ogni serie come completata.',
      },
      {
        heading: 'Elimina scheda',
        body: "Rimuove la scheda permanentemente. L'azione è confermata con un avviso prima di procedere.",
      },
    ],
  },

  active: {
    title: 'Sessione attiva',
    sections: [
      {
        heading: 'Timer allenamento',
        body: "Mostra il tempo trascorso dall'inizio della sessione. Puoi mettere in pausa o riprendere il conteggio con il pulsante \"Pausa / Riprendi\".",
      },
      {
        heading: 'Statistiche',
        body: 'Il pulsante "Statistiche" in alto apre un riepilogo delle serie già completate nella sessione, diviso per gruppo muscolare.',
      },
      {
        heading: 'Completare una serie',
        body: 'Inserisci peso e ripetizioni (o minuti per gli esercizi a tempo, solo reps per quelli senza peso), poi premi il cerchio ✓ a destra per segnare la serie come completata.',
      },
      {
        heading: 'Timer di recupero',
        body: 'Il badge colorato (es. "60s") in cima a ogni esercizio indica il tempo di recupero. Toccalo per modificarlo. Al completamento di una serie il timer parte in automatico nella barra in fondo.',
      },
      {
        heading: '−15s / +15s / Salta',
        body: 'Durante il recupero puoi sottrarre o aggiungere 15 secondi al countdown, oppure saltare direttamente il recupero con "Salta".',
      },
      {
        heading: '+ Aggiungi serie',
        body: "Aggiunge una nuova riga di serie all'esercizio. Scorri a sinistra su una serie per eliminarla.",
      },
      {
        heading: '+ Aggiungi esercizio',
        body: 'Aggiunge un esercizio alla sessione corrente senza modificare la scheda originale.',
      },
      {
        heading: 'Riordinare esercizi',
        body: 'Tieni premuto a lungo su una scheda esercizio e trascinala nella posizione desiderata. La lista scorre automaticamente avvicinandoti ai bordi.',
      },
      {
        heading: 'Elimina esercizio',
        body: 'Scorri a sinistra sulla scheda di un esercizio per far apparire il pulsante "Elimina".',
      },
      {
        heading: 'Termina / Annulla',
        body: '"Termina" salva la sessione nello storico. "Annulla" chiude la sessione senza salvare nulla.',
      },
    ],
  },

  edit: {
    title: 'Modifica scheda',
    sections: [
      {
        heading: 'Rinominare la scheda',
        body: 'Il campo "Nome:" in cima è modificabile direttamente: tocca il testo e digita il nuovo nome della scheda.',
      },
      {
        heading: 'Salva',
        body: 'Premi il pulsante verde "Salva" in alto a destra per salvare tutte le modifiche (nome incluso). Se esci senza salvare, le modifiche vengono scartate.',
      },
      {
        heading: '+ Aggiungi esercizio',
        body: 'Aggiunge un esercizio alla scheda. Puoi scegliere dalla lista predefinita o dagli esercizi personalizzati.',
      },
      {
        heading: 'Modifica serie',
        body: 'Per ogni esercizio puoi modificare direttamente i valori nelle celle (kg, reps o minuti). Usa "+ Aggiungi serie" per inserire una riga aggiuntiva.',
      },
      {
        heading: 'Elimina serie',
        body: 'Scorri a sinistra su una singola serie per eliminarla.',
      },
      {
        heading: 'Elimina esercizio',
        body: "Scorri a sinistra sulla scheda dell'esercizio per far apparire il pulsante \"Elimina\".",
      },
      {
        heading: 'Riordinare esercizi',
        body: 'Tieni premuto a lungo su una scheda esercizio e trascinala nella posizione desiderata. La lista scorre automaticamente avvicinandoti ai bordi.',
      },
    ],
  },

  exercises: {
    title: 'ESERCIZI',
    sections: [
      {
        heading: 'Guida all\'esecuzione',
        body: 'Tocca il nome di qualsiasi esercizio in qualsiasi schermata (compresi i popup di aggiunta esercizi tramite il pulsante "?") per visualizzare una guida dettagliata e attendibile su come eseguirlo correttamente.',
      },
      {
        heading: 'Lista esercizi',
        body: 'Mostra tutti gli esercizi disponibili raggruppati per gruppo muscolare. Gli esercizi predefiniti non possono essere eliminati.',
      },
      {
        heading: 'Badge "Custom"',
        body: 'Gli esercizi creati da te sono contrassegnati con il badge verde "Custom".',
      },
      {
        heading: '+ Nuovo esercizio',
        body: "Crea un esercizio personalizzato: scegli nome, gruppo muscolare e tipologia. L'esercizio sarà disponibile in tutte le schede.",
      },
      {
        heading: 'Tipologia: Peso + Rip.',
        body: 'Esercizi in cui si registrano sia il peso utilizzato (in kg) che le ripetizioni eseguite. Adatto a esercizi con bilanciere, manubri o macchine (es. panca, squat, stacchi).',
      },
      {
        heading: 'Tipologia: Ripetizioni',
        body: 'Esercizi a corpo libero in cui si registrano solo le ripetizioni, senza peso. Adatto a flessioni, trazioni, addominali e simili.',
      },
      {
        heading: 'Tipologia: A Tempo',
        body: 'Esercizi in cui si registra la durata in minuti. Adatto a esercizi statici o cardio come il plank, la corsa, la cyclette.',
      },
      {
        heading: 'Elimina esercizio custom',
        body: 'Scorri a sinistra su un esercizio custom per eliminarlo. Gli esercizi predefiniti non possono essere eliminati.',
      },
    ],
  },

  history: {
    title: 'STORICO sessioni',
    sections: [
      {
        heading: 'Lista sessioni',
        body: 'Mostra tutte le sessioni di allenamento completate, con nome, data, numero di esercizi e durata totale.',
      },
      {
        heading: 'Dettaglio sessione',
        body: 'Tocca una scheda per aprire il dettaglio completo della sessione con tutti i valori registrati per ogni serie.',
      },
      {
        heading: 'Modifica sessione',
        body: 'Scorri a destra su una sessione per modificare i dati registrati (peso, reps, minuti) direttamente dallo storico.',
      },
      {
        heading: 'Elimina sessione',
        body: 'Scorri a sinistra su una sessione per eliminarla definitivamente dallo storico.',
      },
    ],
  },

  profile: {
    title: 'PROFILO',
    sections: [
      {
        heading: 'Dati personali',
        body: 'Mostra nome, email, età, altezza e peso. Tocca "Modifica" per aggiornare questi dati in qualsiasi momento.',
      },
      {
        heading: 'Statistiche generali',
        body: 'Riepilogo automatico calcolato dallo storico: sessioni totali completate, ore totali di allenamento, serie totali completate e numero di schede create.',
      },
    ],
  },
};

// ── Floating ? button + Modal ────────────────────────────────────────────────
export default function HelpButton({ screen }) {
  const [visible, setVisible] = useState(false);
  const content = HELP_CONTENT[screen];
  if (!content) return null;

  return (
    <>
      <TouchableOpacity
        style={helpStyles.btn}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={helpStyles.btnText}>?</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={helpStyles.backdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setVisible(false)}
          />
          <View style={helpStyles.sheet}>
            {/* Header */}
            <View style={helpStyles.sheetHeader}>
              <Text style={helpStyles.sheetTitle} numberOfLines={2}>
                {content.title}
              </Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={helpStyles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
            >
              {content.sections.map((s, i) => (
                <View key={i} style={helpStyles.section}>
                  <View style={helpStyles.sectionRow}>
                    <View style={helpStyles.dot} />
                    <Text style={helpStyles.sectionHeading}>{s.heading}</Text>
                  </View>
                  <Text style={helpStyles.sectionBody}>{s.body}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const helpStyles = StyleSheet.create({
  btn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5f9ef',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: '70%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
  },
  closeBtn: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: '600',
    paddingTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,
    flexShrink: 0,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  sectionBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    paddingLeft: 15,
  },
});
