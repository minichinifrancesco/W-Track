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
import { useEffectiveDark } from '../context/SettingsContext';
import { Ionicons } from '@expo/vector-icons';

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
        heading: '+ Nuova scheda / ＋',
        body: 'Premi il pulsante "+ Nuova scheda" in alto a destra oppure il tasto ＋ in basso a destra per creare una nuova scheda. Si aprirà direttamente la schermata di modifica con una scheda vuota: inserisci il nome (obbligatorio) e aggiungi gli esercizi, poi premi "Salva".',
      },
      {
        heading: 'Dettagli',
        body: 'Mostra un riepilogo degli esercizi presenti nella scheda (nome, serie, ripetizioni, peso predefinito).',
      },
      {
        heading: 'Modifica',
        body: "Apre l'editor della scheda dove puoi rinominare la scheda, aggiungere più esercizi in una volta, riordinare e modificare le serie.",
      },
      {
        heading: 'Inizia workout',
        body: 'Avvia una sessione di allenamento basata sulla scheda. Il timer parte automaticamente e puoi segnare ogni serie come completata.',
      },
      {
        heading: 'Elimina scheda',
        body: 'Trascina il riquadro della scheda verso sinistra (slide/swipe) per far apparire il pulsante rosso "Elimina" e rimuovere la scheda definitivamente.',
      },
    ],
  },

  active: {
    title: 'Sessione attiva',
    sections: [
      {
        heading: 'Timer allenamento (modificabile)',
        body: "Mostra il tempo trascorso dall'inizio della sessione. Tocca il timer per modificarlo manualmente (formato HH:MM:SS). Puoi mettere in pausa o riprendere il conteggio con il pulsante \"Pausa / Riprendi\".",
      },
      {
        heading: 'Stats 📊',
        body: 'Il pulsante "Stats 📊" in alto apre un riepilogo delle serie già completate nella sessione, diviso per gruppo muscolare.',
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
        heading: '🔄 Sostituisci esercizio',
        body: "Il pulsante di scambio (swap) 🔄 in alto a destra di ogni esercizio apre la selezione degli esercizi. Scegli quello sostitutivo e premi \"Sostituisci\": l'esercizio viene rimpiazzato mantenendo la posizione nella lista.",
      },
      {
        heading: '+ Aggiungi esercizi (multipli)',
        body: 'Premi "+ Aggiungi esercizio" per aprire il selettore. Puoi toccare più esercizi per selezionarli: verranno aggiunti nell\'ordine in cui li hai toccati. Il badge numerico indica l\'ordine di aggiunta.',
      },
      {
        heading: '+ Aggiungi serie',
        body: "Aggiunge una nuova riga di serie all'esercizio. Scorri a sinistra su una serie per eliminarla.",
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
        heading: 'Note esercizio',
        body: 'Puoi inserire una nota personalizzata per ciascun esercizio (es. configurazione macchina, sensazioni, impostazioni) direttamente dal campo di testo dedicato. Verrà salvata e visualizzata nel dettaglio storico.',
      },
      {
        heading: 'Avviso valori anomali',
        body: 'Se inserisci accidentalmente un peso o un numero di ripetizioni molto superiore (3x o più) rispetto alla serie precedente dello stesso esercizio, all\'atto di premere il pulsante di spunta (✓) apparirà un avviso di sicurezza che ti chiederà di confermare o correggere il valore.',
      },
      {
        heading: 'Medaglia Record Personali (PR) 🏅',
        body: 'Non appena clicchi sulla spunta (✓) per completare una serie, se quest\'ultima supera i tuoi record personali storici o le serie completate nella stessa sessione, comparirà una medaglietta dorata 🏅 accanto al numero della serie per indicare il nuovo PR.',
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
        heading: 'Nome scheda (obbligatorio)',
        body: 'Il campo "Nome:" in cima è modificabile direttamente. Per le schede nuove il nome è obbligatorio: non puoi salvare senza averlo inserito.',
      },
      {
        heading: 'Salva',
        body: 'Premi il pulsante verde "Salva" in alto a destra per salvare tutte le modifiche. Se esci senza salvare, le modifiche vengono scartate (per le schede nuove non viene creata nulla).',
      },
      {
        heading: '+ Aggiungi esercizi (multipli)',
        body: 'Tocca più esercizi nella lista per selezionarli tutti in una volta. Il badge numerico mostra l\'ordine di selezione. Premi "Aggiungi N esercizi" per confermare: verranno inseriti nell\'ordine in cui li hai selezionati.',
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
        heading: 'Barra di ricerca e selettore data',
        body: 'Usa la barra di ricerca in alto per filtrare le sessioni per nome o per esercizi inclusi. Puoi anche utilizzare il selettore di data nativo per mostrare solo i workout completati in un determinato periodo.',
      },
      {
        heading: 'Lista sessioni',
        body: 'Mostra tutte le sessioni di allenamento completate, con nome, data, numero di esercizi e durata totale.',
      },
      {
        heading: 'Dettaglio sessione',
        body: 'Tocca una scheda per aprire il dettaglio completo della sessione con tutti i valori registrati per ogni serie e le note di ciascun esercizio.',
      },
      {
        heading: 'Modifica sessione',
        body: 'Scorri a destra su una sessione per modificare i dati registrati (peso, reps, minuti e note per ogni esercizio). Puoi anche modificare la durata totale toccando il timer nella schermata di modifica.',
      },
      {
        heading: 'Durata modificabile',
        body: 'Nella schermata di modifica di una sessione trovi il timer ⏱ della durata. Toccalo per modificarlo manualmente in formato HH:MM:SS.',
      },
      {
        heading: 'Nota generale workout nello storico',
        body: 'Quando apri il dettaglio di un allenamento completato, troverai in alto un campo "Nota generale workout". È indipendente dall\'impostazione note degli esercizi ed è associato in modo unico e permanente a quella specifica sessione.',
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
      {
        heading: '⚙️ Impostazioni',
        body: 'Il pulsante dell\'ingranaggio ⚙️ in alto a destra apre le impostazioni dell\'app. Da qui puoi cambiare l\'unità di peso (kg / libbre), il tema (Chiaro / Scuro / Automatico), il timer di recupero predefinito e abilitare/disabilitare le note per esercizio.',
      },
      {
        heading: 'Unità di peso (kg / lbs)',
        body: 'Scegli se visualizzare i pesi in chilogrammi o in libbre. La conversione avviene automaticamente (1 kg ≈ 2.205 lbs). I dati sono sempre salvati in kg internamente.',
      },
      {
        heading: 'Tema dell\'app',
        body: '"Chiaro" forza sempre il tema chiaro. "Scuro" forza sempre il tema scuro. "Automatico" segue le impostazioni del dispositivo.',
      },
      {
        heading: 'Timer recupero predefinito',
        body: 'Imposta il tempo di recupero che verrà usato automaticamente quando aggiungi un nuovo esercizio (sia durante una sessione sia in modifica scheda). Puoi sempre modificarlo esercizio per esercizio toccando il badge colorato durante l\'allenamento.',
      },
      {
        heading: 'Impostazione Note Esercizio',
        body: 'Attiva o disattiva la visualizzazione del campo note degli esercizi in Allenamento Attivo e Modifica Scheda. Se disattivata, le note passate rimangono comunque visibili nello storico.',
      },
      {
        heading: 'Notifiche fine recupero',
        body: 'Attiva o disattiva in modo indipendente la vibrazione (feedback aptico) e/o il segnale acustico (suono) riprodotti al termine di ogni timer di recupero.',
      },
    ],
  },
};

// ── Floating ? button + Modal ────────────────────────────────────────────────
export default function HelpButton({ screen }) {
  const [visible, setVisible] = useState(false);
  const isDark = useEffectiveDark();
  const content = HELP_CONTENT[screen];
  if (!content) return null;

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textDark = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#475569';
  const dotColor = COLORS.primary;

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.75}
        style={{
          width: 36,
          height: 36,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="help-circle-outline" size={26} color={COLORS.primary} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={helpStyles.tutOverlay}>
          <View style={[helpStyles.tutCard, { backgroundColor: cardBg }]}>
            {/* Header */}
            <View style={helpStyles.tutHeader}>
              <Ionicons name="information-circle" size={24} color={COLORS.primary} />
              <Text style={[helpStyles.tutTitle, { color: textDark }]} numberOfLines={2}>
                {content.title}
              </Text>
            </View>

            <ScrollView
              style={{ maxHeight: 350, marginVertical: 12 }}
              showsVerticalScrollIndicator={true}
            >
              {content.sections.map((s, i) => (
                <View key={i} style={helpStyles.section}>
                  <View style={helpStyles.sectionRow}>
                    <View style={[helpStyles.dot, { backgroundColor: dotColor }]} />
                    <Text style={[helpStyles.sectionHeading, { color: textDark }]}>{s.heading}</Text>
                  </View>
                  <Text style={[helpStyles.sectionBody, { color: textMuted }]}>{s.body}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={helpStyles.tutActionBtn} onPress={() => setVisible(false)}>
              <Text style={helpStyles.tutActionBtnText}>Ho capito</Text>
            </TouchableOpacity>
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
  tutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tutCard: {
    width: '100%',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  tutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#33415530',
    paddingBottom: 10,
    marginBottom: 8,
  },
  tutTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
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
    marginRight: 8,
    flexShrink: 0,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  sectionBody: {
    fontSize: 13,
    lineHeight: 20,
    paddingLeft: 15,
  },
  tutActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  tutActionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
