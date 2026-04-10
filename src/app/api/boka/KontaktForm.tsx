.sektionsTitel {
  font - family: 'Playfair Display', serif;
  font - size: 22px;
  color: var(--dark);
  font - weight: 400;
  margin - bottom: 1.5rem;
}

/* --- Tjänster --- */
.tjanstGrid {
  display: grid;
  grid - template - columns: 1fr 1fr;
  gap: 12px;
  margin - bottom: 2.5rem;
}

.tjanstKort {
  border: 1px solid var(--border2);
  background: rgba(250, 246, 239, 0.6);
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify - content: space - between;
  align - items: center;
}

.tjanstKort:hover {
  border - color: var(--gold);
  background: rgba(253, 249, 243, 0.9);
}

.vald {
  border - color: var(--gold)!important;
  background: rgba(253, 249, 243, 0.9)!important;
  box - shadow: inset 3px 0 0 var(--gold);
}

.tjanstNamn {
  font - size: 14px;
  font - weight: 500;
  color: var(--dark);
  margin - bottom: 3px;
}

.tjanstTid {
  font - size: 11px;
  color: var(--warm);
  letter - spacing: 0.05em;
}

.tjanstPris {
  font - family: 'Playfair Display', serif;
  font - size: 18px;
  color: var(--gold);
}

/* --- Kalender --- */
.kalHuvud {
  display: flex;
  align - items: center;
  justify - content: space - between;
  margin - bottom: 1.5rem;
}

.kalKnapp {
  background: none;
  border: 1px solid var(--border2);
  color: var(--warm);
  padding: 8px 16px;
  cursor: pointer;
  font - size: 14px;
  font - family: 'Raleway', sans - serif;
  transition: all 0.2s;
}

.kalKnapp:hover {
  border - color: var(--gold);
  color: var(--dark);
}

.kalGrid {
  display: grid;
  grid - template - columns: repeat(7, 1fr);
  gap: 4px;
  margin - bottom: 2rem;
}

.kalDagLabel {
  text - align: center;
  font - size: 10px;
  letter - spacing: 0.1em;
  color: var(--muted);
  padding: 6px 0;
  text - transform: uppercase;
}

.kalCell {
  text - align: center;
  padding: 10px 4px;
  font - size: 13px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
  color: var(--dark);
}

.kalCell: hover: not(.forbi) {
  border - color: var(--gold);
  color: var(--gold);
}

.valdDag {
  background: var(--dark);
  color: var(--bg)!important;
  border - color: var(--dark)!important;
}

.forbi {
  color: var(--warm - dim);
  cursor: default ;
}

.ornament {
  display: flex;
  align - items: center;
  gap: 12px;
  color: var(--muted);
  font - size: 10px;
  letter - spacing: 0.2em;
  text - transform: uppercase;
  margin: 1.5rem 0 1rem;
}

.ornament:: before,
.ornament::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border2);
}

.tidGrid {
  display: grid;
  grid - template - columns: repeat(4, 1fr);
  gap: 8px;
  margin - bottom: 2.5rem;
}

.tidCell {
  border: 1px solid var(--border2);
  background: rgba(250, 246, 239, 0.6);
  text - align: center;
  padding: 11px;
  font - size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--dark);
  letter - spacing: 0.05em;
}

.tidCell: hover: not(.otillganglig) {
  border - color: var(--gold);
}

.valdTid {
  background: var(--dark)!important;
  color: var(--bg)!important;
  border - color: var(--dark)!important;
}

.otillganglig {
  color: var(--warm - dim);
  cursor: default ;
  text - decoration: line - through;
}

/* --- Formulär --- */
.sammanfattning {
  background: rgba(250, 246, 239, 0.8);
  border: 1px solid var(--border2);
  padding: 1.5rem;
  margin - bottom: 2rem;
}

.sammRad {
  display: flex;
  justify - content: space - between;
  padding: 7px 0;
  font - size: 13px;
  border - bottom: 1px solid var(--border);
}

.sammRad: last - child {
  border - bottom: none;
}

.sammLabel {
  color: var(--warm);
}

.sammTotalt {
  font - weight: 600;
  color: var(--gold);
  padding - top: 12px;
}

.sammTotalt.sammLabel {
  color: var(--gold);
}

.formGrid {
  display: grid;
  grid - template - columns: 1fr 1fr;
  gap: 12px;
  margin - bottom: 1rem;
}

.formFull {
  grid - column: 1 / -1;
}

.formLabel {
  font - size: 10px;
  letter - spacing: 0.15em;
  text - transform: uppercase;
  color: var(--warm);
  display: block;
  margin - bottom: 6px;
}

.formInput {
  width: 100 %;
  background: rgba(250, 246, 239, 0.8);
  border: 1px solid var(--border2);
  padding: 11px 14px;
  font - family: 'Raleway', sans - serif;
  font - size: 13px;
  color: var(--dark);
  outline: none;
  transition: border - color 0.2s;
}

.formInput:focus {
  border - color: var(--gold);
}

.formTextarea {
  resize: vertical;
  min - height: 90px;
}

/* --- Bekräftelse --- */
.bekraftelse {
  text - align: center;
  padding: 3rem 2rem;
}

.bekIcon {
  width: 64px;
  height: 64px;
  border: 1px solid var(--gold);
  border - radius: 50 %;
  display: flex;
  align - items: center;
  justify - content: center;
  margin: 0 auto 1.5rem;
  font - size: 24px;
  color: var(--gold);
}

.bekTitel {
  font - family: 'Playfair Display', serif;
  font - size: 32px;
  color: var(--dark);
  font - weight: 400;
  margin - bottom: 1rem;
}

.divider {
  width: 40px;
  height: 1px;
  background: var(--gold);
  margin: 1rem auto 1.5rem;
}

.bekText {
  font - size: 15px;
  color: var(--dark);
  line - height: 1.8;
  margin - bottom: 1rem;
}

.bekSub {
  font - size: 13px;
  color: var(--warm);
  letter - spacing: 0.05em;
}

/* --- Knappar --- */
.knappar {
  display: flex;
  justify - content: space - between;
  align - items: center;
  margin - top: 2rem;
}

.knappPrimar {
  padding: 13px 2.5rem;
  font - family: 'Raleway', sans - serif;
  font - size: 11px;
  letter - spacing: 0.18em;
  text - transform: uppercase;
  cursor: pointer;
  background: var(--dark);
  color: var(--bg);
  border: 1px solid var(--dark);
  transition: background 0.2s;
}

.knappPrimar: hover: not(: disabled) {
  background: var(--bg2);
}

.knappPrimar:disabled {
  opacity: 0.4;
  cursor: not - allowed;
}

.knappSekundar {
  padding: 13px 2rem;
  font - family: 'Raleway', sans - serif;
  font - size: 11px;
  letter - spacing: 0.18em;
  text - transform: uppercase;
  cursor: pointer;
  background: transparent;
  color: var(--warm);
  border: 1px solid var(--border2);
  transition: all 0.2s;
}

.knappSekundar:hover {
  border - color: var(--gold);
  color: var(--dark);
}

@media(max - width: 600px) {
  .tjanstGrid {
    grid - template - columns: 1fr;
  }
  .tidGrid {
    grid - template - columns: repeat(3, 1fr);
  }
  .formGrid {
    grid - template - columns: 1fr;
  }
}

/* ===== BEKRÄFTELSE ===== */
.bekWrap {
  display: grid;
  grid - template - columns: 1fr 1fr;
  gap: 4rem;
  padding: 2rem 0 4rem;
  align - items: start;
}

.bekLeft {
  display: flex;
  flex - direction: column;
  gap: 1.5rem;
}

.bekIconWrap {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align - items: center;
  justify - content: center;
  margin - bottom: 0.5rem;
}

.bekIconRing {
  position: absolute;
  inset: 0;
  border: 1px solid var(--gold);
  border - radius: 50 %;
  animation: spinSlow 12s linear infinite;
}

.bekIconRing2 {
  position: absolute;
  inset: 6px;
  border: 0.5px solid var(--border2);
  border - radius: 50 %;
  animation: spinSlow 20s linear infinite reverse;
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bekIconCheck {
  font - size: 28px;
  color: var(--gold);
  z - index: 1;
}

.bekEyebrow {
  font - size: 10px;
  letter - spacing: 0.25em;
  text - transform: uppercase;
  color: var(--warm);
}

.bekTitel {
  font - family: 'Playfair Display', serif;
  font - size: clamp(36px, 4vw, 52px);
  font - weight: 400;
  color: var(--dark);
  line - height: 1.1;
}

.bekTitel em {
  color: var(--gold);
  font - style: italic;
}

.bekIngress {
  font - size: 14px;
  color: var(--warm);
  line - height: 1.8;
  max - width: 320px;
}

.bekHem {
  font - size: 11px;
  letter - spacing: 0.15em;
  text - transform: uppercase;
  color: var(--muted);
  text - decoration: none;
  transition: color 0.2s, letter - spacing 0.2s;
  margin - top: 1rem;
}

.bekHem:hover {
  color: var(--dark);
  letter - spacing: 0.22em;
}

/* KVITTO */
.bekRight {
  display: flex;
  flex - direction: column;
  gap: 1rem;
}

.kvitto {
  background: var(--dark);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

.kvittoTop {
  margin - bottom: 2rem;
}

.kvittoLabel {
  font - size: 10px;
  letter - spacing: 0.25em;
  text - transform: uppercase;
  color: rgba(184, 149, 106, 0.6);
  margin - bottom: 1rem;
}

.kvittoDivider {
  height: 0.5px;
  background: rgba(255, 255, 255, 0.08);
}

.kvittoRader {
  display: flex;
  flex - direction: column;
  gap: 0;
}

.kvittoRad {
  display: flex;
  justify - content: space - between;
  align - items: center;
  padding: 14px 0;
  border - bottom: 0.5px solid rgba(255, 255, 255, 0.06);
}

.kvittoNyckel {
  font - size: 11px;
  letter - spacing: 0.1em;
  text - transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
}

.kvittoVarde {
  font - family: 'Playfair Display', serif;
  font - size: 15px;
  color: rgba(255, 255, 255, 0.85);
}

.kvittoFooter {
  display: flex;
  justify - content: space - between;
  align - items: center;
  margin - top: 2rem;
  padding - top: 1.5rem;
  border - top: 0.5px solid rgba(184, 149, 106, 0.25);
}

.kvittoTotaltLabel {
  font - size: 10px;
  letter - spacing: 0.2em;
  text - transform: uppercase;
  color: rgba(184, 149, 106, 0.6);
}

.kvittoTotalt {
  font - family: 'Playfair Display', serif;
  font - size: 24px;
  color: var(--gold);
}

.kvittoStamp {
  position: absolute;
  bottom: -20px;
  right: -20px;
  opacity: 0.06;
}

.stampRing {
  width: 120px;
  height: 120px;
  border: 2px solid #fff;
  border - radius: 50 %;
  display: flex;
  flex - direction: column;
  align - items: center;
  justify - content: center;
  font - size: 11px;
  letter - spacing: 0.2em;
  text - transform: uppercase;
  color: #fff;
  font - family: 'Playfair Display', serif;
}

.stampSub {
  font - size: 8px;
  letter - spacing: 0.15em;
  color: #fff;
  font - family: 'Raleway', sans - serif;
}

.bekObs {
  font - size: 11px;
  color: var(--muted);
  letter - spacing: 0.05em;
  line - height: 1.6;
  text - align: center;
  padding: 0 1rem;
}

@media(max - width: 700px) {
  .bekWrap {
    grid - template - columns: 1fr;
    gap: 2.5rem;
  }
}

.felmeddelande {
  font - size: 13px;
  color: #c0392b;
  background: rgba(192, 57, 43, 0.06);
  border: 1px solid rgba(192, 57, 43, 0.2);
  padding: 12px 16px;
  margin - bottom: 1rem;
  letter - spacing: 0.03em;
}